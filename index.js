import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';

// Importing the modules
import code from './pair.js';
import qr from './qr.js';  // Add this import

const app = express();

// Resolve the current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

import('events').then(events => {
    events.EventEmitter.defaultMaxListeners = 500;
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (if you have CSS/JS/images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/code', code);
app.use('/qr', qr);  // Add this route

// HTML Pages
app.use('/pair', async (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

app.use('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// QR page (if you want a separate page for QR)
app.use('/qr-page', async (req, res) => {
    res.sendFile(path.join(__dirname, 'qr.html')); // You'll need to create qr.html
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'MAD-MAX WhatsApp Bot'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        availableRoutes: ['/', '/pair', '/qr/generate', '/code', '/health']
    });
});

app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║           MAD-MAX WHATSAPP BOT           ║
    ╠══════════════════════════════════════════╣
    ║  Instagram: @um4rxd                      ║
    ║  GitHub: @Um4r719                        ║
    ╠══════════════════════════════════════════╣
    ║  Server running on:                      ║
    ║  http://localhost:${PORT}                ${PORT < 1000 ? ' ' : ''}║
    ║  http://0.0.0.0:${PORT}                  ${PORT < 1000 ? ' ' : ''}║
    ╠══════════════════════════════════════════╣
    ║  Available Endpoints:                    ║
    ║  • /          - Home page                ║
    ║  • /pair      - Pair page                ║
    ║  • /qr        - QR endpoints             ║
    ║  • /code      - Code pairing             ║
    ║  • /health    - Health check             ║
    ╚══════════════════════════════════════════╝
    `);
});

export default app;