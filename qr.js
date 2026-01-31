import express from 'express';
import fs from 'fs';
import pino from 'pino';
import { makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } from '@whiskeysockets/baileys';
import { upload } from './mega.js';
import qrcode from 'qrcode';

const router = express.Router();

// Store active QR sessions
const activeSessions = new Map();
const SESSION_TIMEOUT = 300000; // 5 minutes

// Ensure the session directory exists
function removeFile(FilePath) {
    try {
        if (!fs.existsSync(FilePath)) return false;
        fs.rmSync(FilePath, { recursive: true, force: true });
    } catch (e) {
        console.error('Error removing file:', e);
    }
}

// Cleanup old sessions
function cleanupOldSessions() {
    const now = Date.now();
    for (const [sessionId, session] of activeSessions.entries()) {
        if (now - session.createdAt > SESSION_TIMEOUT) {
            cleanupSession(sessionId);
        }
    }
}
setInterval(cleanupOldSessions, 60000); // Cleanup every minute

function cleanupSession(sessionId) {
    const session = activeSessions.get(sessionId);
    if (session) {
        if (session.socket) {
            try {
                session.socket.end();
            } catch (e) {
                console.error('Error closing socket:', e);
            }
        }
        removeFile(session.dir);
        activeSessions.delete(sessionId);
        console.log(`Cleaned up session: ${sessionId}`);
    }
}

// Generate random session ID
function generateSessionId() {
    return 'qr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate random Mega ID
function generateRandomId(length = 6, numberLength = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const number = Math.floor(Math.random() * Math.pow(10, numberLength));
    return `${result}${number}`;
}

// QR Code generation endpoint
router.get('/generate', async (req, res) => {
    const sessionId = generateSessionId();
    const dirs = `./sessions/${sessionId}`;
    
    // Create sessions directory if not exists
    if (!fs.existsSync('./sessions')) {
        fs.mkdirSync('./sessions', { recursive: true });
    }
    
    // Clean up existing directory
    removeFile(dirs);
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState(dirs);
        
        const socket = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
            },
            version: [2, 3000, 1027934701],
            printQRInTerminal: true, // This will print QR in terminal
            logger: pino({ level: 'silent' }),
            browser: Browsers.windows('Edge'),
        });

        // Store session data
        const sessionData = {
            socket,
            dir: dirs,
            createdAt: Date.now(),
            isAuthenticated: false,
            saveCreds,
            state,
            qrCode: null,
            qrGenerated: false,
            clientInfo: null
        };

        activeSessions.set(sessionId, sessionData);

        // Listen for QR code
        socket.ev.on('connection.update', async (update) => {
            const session = activeSessions.get(sessionId);
            if (!session) return;

            const { qr, connection, lastDisconnect } = update;

            // Handle QR Code generation
            if (qr) {
                console.log(`QR generated for session: ${sessionId}`);
                session.qrCode = qr;
                session.qrGenerated = true;
                
                try {
                    // Generate QR image as data URL
                    const qrImageUrl = await qrcode.toDataURL(qr);
                    session.qrImageUrl = qrImageUrl;
                    
                    // Store in cache for the status endpoint
                    session.qrData = {
                        qr,
                        qrImageUrl,
                        sessionId,
                        timestamp: Date.now()
                    };
                } catch (error) {
                    console.error('Error generating QR image:', error);
                }
            }

            // Handle successful connection
            if (connection === 'open') {
                console.log(`WhatsApp connected for session: ${sessionId}`);
                session.isAuthenticated = true;
                session.clientInfo = socket.user;

                // Send welcome message
                await socket.sendMessage(socket.user.id, { 
                    text: '🔗 *MAD-MAX WhatsApp Bot*\n\nGenerating your session, please wait...' 
                });

                // Wait a bit for stability
                await delay(8000);

                try {
                    // Upload session to Mega
                    const megaUrl = await upload(
                        fs.createReadStream(`${dirs}/creds.json`), 
                        `${generateRandomId()}.json`
                    );

                    // Format session string
                    const sessionString = `MAD-MAX;;;${megaUrl.replace('https://mega.nz/file/', '')}`;

                    // Send session to user
                    await socket.sendMessage(socket.user.id, { 
                        text: `*YOUR SESSION ID:*\n\`\`\`${sessionString}\`\`\`\n\nCopy this code and use it during deployment.` 
                    });

                    // Send instructions
                    await socket.sendMessage(socket.user.id, { 
                        text: '✅ *MAD-MAX Successfully Linked!*\n\n📋 *Instructions:*\n1. Copy the session ID above\n2. Use it as SESSION_STRING during deploy\n3. Bot will be ready in few minutes\n\n⚠️ *Important:*\n• Keep this session ID secure\n• Don\'t share it with anyone\n• For issues: https://wa.me/25769769295\n\n🎉 *Good luck with your bot!*' 
                    });

                    // Store final session data
                    session.finalData = {
                        sessionId: sessionId,
                        sessionString: sessionString,
                        phoneNumber: socket.user.id.split('@')[0],
                        timestamp: Date.now(),
                        megaUrl: megaUrl
                    };

                    // Cleanup after successful connection
                    setTimeout(() => {
                        cleanupSession(sessionId);
                    }, 30000);

                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    await socket.sendMessage(socket.user.id, { 
                        text: '❌ *Error uploading session*\n\nPlease try again or contact support.' 
                    });
                }
            }

            // Handle disconnection
            if (connection === 'close') {
                console.log(`Connection closed for session: ${sessionId}`);
                if (!session.isAuthenticated) {
                    // If not authenticated, cleanup
                    setTimeout(() => {
                        cleanupSession(sessionId);
                    }, 10000);
                }
            }
        });

        // Listen for credentials update
        socket.ev.on('creds.update', saveCreds);

        // Return session ID for polling
        res.json({
            success: true,
            sessionId: sessionId,
            message: 'Session created. Poll /qr/status/:sessionId for QR code',
            statusUrl: `/qr/status/${sessionId}`
        });

    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create session',
            error: error.message
        });
    }
});

// Check QR status endpoint
router.get('/status/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const session = activeSessions.get(sessionId);

    if (!session) {
        return res.status(404).json({
            success: false,
            message: 'Session not found or expired',
            status: 'expired'
        });
    }

    const response = {
        success: true,
        sessionId: sessionId,
        status: session.isAuthenticated ? 'authenticated' : 'waiting',
        qrGenerated: session.qrGenerated,
        createdAt: session.createdAt,
        elapsedTime: Date.now() - session.createdAt
    };

    // Add QR data if available
    if (session.qrData) {
        response.qrData = session.qrData;
    }

    // Add final data if authenticated
    if (session.isAuthenticated && session.finalData) {
        response.authenticated = true;
        response.finalData = session.finalData;
        
        // Auto-cleanup after providing final data
        setTimeout(() => {
            cleanupSession(sessionId);
        }, 5000);
    }

    res.json(response);
});

// Get QR image directly
router.get('/image/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const session = activeSessions.get(sessionId);

    if (!session || !session.qrImageUrl) {
        return res.status(404).json({
            success: false,
            message: 'QR code not available'
        });
    }

    // Extract base64 data from data URL
    const base64Data = session.qrImageUrl.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');
    
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length
    });
    res.end(imgBuffer);
});

// Cleanup endpoint (manual cleanup)
router.delete('/cleanup/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    cleanupSession(sessionId);
    
    res.json({
        success: true,
        message: 'Session cleaned up'
    });
});

// List active sessions (for debugging)
router.get('/active', async (req, res) => {
    const sessions = Array.from(activeSessions.entries()).map(([id, session]) => ({
        id,
        createdAt: session.createdAt,
        isAuthenticated: session.isAuthenticated,
        qrGenerated: session.qrGenerated,
        elapsedTime: Date.now() - session.createdAt
    }));

    res.json({
        success: true,
        count: sessions.length,
        sessions: sessions
    });
});

export default router;