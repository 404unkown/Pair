<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAD MAX</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #0a0a15;
      position: relative;
    }

    /* Animated Lines Background */
    .lines-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
    }

    .line {
      position: absolute;
      background: transparent;
      animation: moveLine linear infinite;
      border-radius: 2px;
    }

    .horizontal {
      width: 100%;
      height: 2px;
      top: 0;
      background: linear-gradient(90deg, transparent, #ff00ff, transparent);
      box-shadow: 0 0 10px #ff00ff;
    }

    .vertical {
      width: 2px;
      height: 100%;
      left: 0;
      background: linear-gradient(180deg, transparent, #00ffff, transparent);
      box-shadow: 0 0 10px #00ffff;
    }

    .diagonal-left {
      width: 3px;
      height: 200%;
      background: linear-gradient(45deg, transparent, #ffff00, transparent);
      box-shadow: 0 0 10px #ffff00;
      transform: rotate(45deg);
    }

    .diagonal-right {
      width: 3px;
      height: 200%;
      background: linear-gradient(-45deg, transparent, #ff6600, transparent);
      box-shadow: 0 0 10px #ff6600;
      transform: rotate(-45deg);
    }

    @keyframes moveLine {
      0% {
        transform: translateX(-100%) translateY(-100%);
      }
      100% {
        transform: translateX(100%) translateY(100%);
      }
    }

    /* Glow Effects */
    .glow-effect {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      z-index: 0;
    }

    .glow-1 {
      background: radial-gradient(circle, #ff00ff 0%, transparent 70%);
      top: 10%;
      left: 10%;
      animation: float 15s ease-in-out infinite;
    }

    .glow-2 {
      background: radial-gradient(circle, #00ffff 0%, transparent 70%);
      bottom: 10%;
      right: 10%;
      animation: float 18s ease-in-out infinite reverse;
    }

    .glow-3 {
      background: radial-gradient(circle, #ffff00 0%, transparent 70%);
      top: 60%;
      left: 80%;
      animation: float 20s ease-in-out infinite;
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(40px, -40px) scale(1.1); }
      66% { transform: translate(-30px, 30px) scale(0.9); }
    }

    /* Container */
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      position: relative;
    }

    /* Glass Card with New Color Scheme */
    .glass-card {
      width: 450px;
      padding: 35px;
      background: rgba(20, 15, 40, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 25px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.5),
        0 0 50px rgba(255, 0, 255, 0.2),
        0 0 100px rgba(0, 255, 255, 0.1);
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .glass-card:hover {
      transform: translateY(-5px);
    }

    /* Logo with Gradient */
    .logo {
      margin-bottom: 25px;
      position: relative;
    }

    .logo h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
      padding-bottom: 10px;
    }

    .logo h1::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent);
      border-radius: 2px;
    }

    .subtitle {
      color: #b0b0ff;
      font-size: 15px;
      margin-bottom: 30px;
      font-weight: 400;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* Method Selector */
    .method-selector {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      justify-content: center;
    }

    .method-btn {
      padding: 14px 24px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      color: #ddd;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      justify-content: center;
      backdrop-filter: blur(5px);
    }

    .method-btn.active {
      background: linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3));
      border-color: #ff00ff;
      color: #fff;
      box-shadow: 0 5px 20px rgba(255, 0, 255, 0.3);
    }

    .method-btn:hover:not(.active) {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    /* Input Group */
    .input-group {
      margin-bottom: 25px;
    }

    .input-container {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      padding: 6px;
      gap: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .input-container:focus-within {
      border-color: #ff00ff;
      box-shadow: 0 0 25px rgba(255, 0, 255, 0.3);
    }

    .input-container input {
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.95);
      width: 100%;
      flex-basis: 70%;
      padding: 16px 20px;
      border: none;
      border-left: 4px solid #ff00ff;
      color: #222;
      font-size: 17px;
      transition: all 0.3s ease;
    }

    .input-container input:focus {
      outline: none;
      background: rgba(255, 255, 255, 1);
      border-left: 4px solid #00ffff;
    }

    .input-container input::placeholder {
      color: #666;
    }

    .input-container button {
      flex-basis: 30%;
      padding: 16px;
      background: linear-gradient(135deg, #ff00ff, #00ffff);
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 15px;
    }

    .input-container button:hover {
      background: linear-gradient(135deg, #00ffff, #ff00ff);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 0, 255, 0.4);
    }

    /* Code Display */
    .waiting-message {
      color: #b0b0ff;
      font-size: 15px;
      margin: 20px 0;
      display: none;
      font-weight: 400;
      background: rgba(255, 255, 255, 0.05);
      padding: 12px;
      border-radius: 10px;
      border: 1px solid rgba(0, 255, 255, 0.2);
    }

    .code-display {
      margin: 25px 0;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .code-text {
      color: #fff;
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 12px 20px;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
    }

    .code-text:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }

    .code-text span {
      color: #ffff00;
      text-shadow: 0 0 15px rgba(255, 255, 0, 0.5);
    }

    /* QR Section */
    .qr-section {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin: 25px 0;
    }

    .qr-container {
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      min-height: 260px;
      min-width: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ff00ff;
    }

    .qr-instructions {
      color: #ddd;
      text-align: center;
      font-size: 15px;
      background: rgba(255, 255, 255, 0.05);
      padding: 18px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      max-width: 320px;
      backdrop-filter: blur(5px);
    }

    .qr-instructions ol {
      text-align: left;
      margin: 15px 0;
      padding-left: 25px;
    }

    .qr-instructions li {
      margin-bottom: 8px;
      color: #b0b0ff;
    }

    .qr-button {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #ffff00, #ff6600);
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #000;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 15px;
      margin-top: 15px;
    }

    .qr-button:hover {
      background: linear-gradient(135deg, #ff6600, #ffff00);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 0, 0.4);
    }

    /* Music Control */
    .music-control {
      margin-top: 25px;
    }

    .music-button {
      background: linear-gradient(135deg, #00ffff, #ff00ff);
      color: #000;
      border: none;
      padding: 14px 30px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0 auto;
      box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
    }

    .music-button:hover {
      background: linear-gradient(135deg, #ff00ff, #00ffff);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(255, 0, 255, 0.4);
    }

    /* Footer */
    .footer-text {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      margin-top: 25px;
      font-weight: 400;
      letter-spacing: 0.5px;
    }

    /* Error Message */
    .error-message {
      color: #ff5555;
      background: rgba(255, 85, 85, 0.1);
      padding: 12px;
      border-radius: 10px;
      border: 1px solid rgba(255, 85, 85, 0.3);
      text-align: center;
    }

    /* Animations */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .pulse {
      animation: pulse 2s infinite;
    }

    /* Responsive */
    @media (max-width: 500px) {
      .glass-card {
        width: 90%;
        padding: 25px 20px;
        margin: 20px;
      }

      .method-selector {
        flex-direction: column;
      }

      .input-container {
        flex-direction: column;
      }

      .input-container input {
        border-radius: 12px;
        margin-bottom: 8px;
      }

      .input-container button {
        border-radius: 12px;
        padding: 14px;
      }

      .qr-container {
        padding: 15px;
        min-height: 230px;
        min-width: 230px;
      }

      .logo h1 {
        font-size: 26px;
      }
    }
  </style>
</head>
<body>
  <!-- Animated Lines Background -->
  <div class="lines-bg" id="linesBg"></div>
  
  <!-- Glow Effects -->
  <div class="glow-effect glow-1"></div>
  <div class="glow-effect glow-2"></div>
  <div class="glow-effect glow-3"></div>

  <div class="container">
    <div class="glass-card">
      <div class="logo">
        <h1>404-<span style="color: #ffff00">XMD</span> PAIR</h1>
      </div>

      <div class="subtitle">
        Choose your preferred authentication method
      </div>

      <!-- Method Selection -->
      <div class="method-selector">
        <button class="method-btn active" id="codeMethodBtn">
          <i class="fas fa-key"></i> CODE METHOD
        </button>
        <button class="method-btn" id="qrMethodBtn">
          <i class="fas fa-qrcode"></i> QR METHOD
        </button>
      </div>

      <!-- Code Method Section -->
      <div id="codeSection">
        <div class="input-group">
          <div class="input-container">
            <input type="tel" id="number" placeholder="254769769295" name="number">
            <button id="submit">
              <i class="fas fa-sign-in-alt"></i> GET CODE
            </button>
          </div>
        </div>

        <div id="waiting-message" class="waiting-message">
          <i class="fas fa-spinner fa-spin"></i> Please wait a moment...
        </div>

        <div id="pair" class="code-display">
          <div class="code-text">Enter your number and click GET CODE</div>
        </div>
      </div>

      <!-- QR Method Section -->
      <div id="qrSection" class="qr-section">
        <div class="qr-container" id="qrCode">
          <div style="color: #666; text-align: center; padding: 20px; font-size: 14px;">
            <i class="fas fa-qrcode fa-3x" style="color: #999; margin-bottom: 10px;"></i><br>
            QR Code will appear here<br>
            <small>Click GENERATE QR below</small>
          </div>
        </div>
        <div class="qr-instructions">
          <strong style="color: #ffff00">How to Scan:</strong>
          <ol>
            <li>Open WhatsApp on your phone</li>
            <li>Tap Menu (⋮) → Linked Devices</li>
            <li>Tap "Link a Device"</li>
            <li>Scan the QR code above</li>
          </ol>
          <p style="color: #00ffff; margin-top: 10px; font-size: 13px;">
            <i class="fas fa-sync-alt fa-spin"></i> QR will auto-refresh when needed
          </p>
        </div>
        <button class="qr-button" id="generateQR">
          <i class="fas fa-qrcode"></i> GENERATE QR CODE
        </button>
        <div id="qrWaiting" class="waiting-message">
          <i class="fas fa-spinner fa-spin"></i> Generating QR code...
        </div>
      </div>

      <div class="music-control">
        <button class="music-button" onclick="toggleMusic()">
          <i class="fas fa-music"></i>
          <span id="music-text">Play Music</span>
        </button>
        <audio id="backgroundMusic" loop>
          <source src="https://files.catbox.moe/9comi4.mp3" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>

      <div class="footer-text">
        Secure WhatsApp Session Pairing | 404-XMD
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Create animated lines
      const linesBg = document.getElementById('linesBg');
      const lineTypes = ['horizontal', 'vertical', 'diagonal-left', 'diagonal-right'];
      const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff6600'];
      
      for (let i = 0; i < 15; i++) {
        const line = document.createElement('div');
        line.className = `line ${lineTypes[Math.floor(Math.random() * lineTypes.length)]}`;
        line.style.left = `${Math.random() * 100}%`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.animationDuration = `${15 + Math.random() * 20}s`;
        line.style.animationDelay = `${Math.random() * 5}s`;
        line.style.opacity = 0.3 + Math.random() * 0.5;
        linesBg.appendChild(line);
      }

      const pairElement = document.getElementById("pair");
      const submitButton = document.getElementById("submit");
      const generateQRButton = document.getElementById("generateQR");
      const numberInput = document.getElementById("number");
      const waitingMessage = document.getElementById("waiting-message");
      const qrWaiting = document.getElementById("qrWaiting");
      const qrCodeElement = document.getElementById("qrCode");
      const backgroundMusic = document.getElementById("backgroundMusic");
      const musicText = document.getElementById("music-text");
      const codeSection = document.getElementById("codeSection");
      const qrSection = document.getElementById("qrSection");
      const codeMethodBtn = document.getElementById("codeMethodBtn");
      const qrMethodBtn = document.getElementById("qrMethodBtn");

      let isPlaying = false;
      let currentMethod = 'code';

      // Method switching
      qrMethodBtn.addEventListener('click', () => {
        if (currentMethod === 'qr') return;

        currentMethod = 'qr';
        qrMethodBtn.classList.add('active');
        codeMethodBtn.classList.remove('active');
        codeSection.style.display = 'none';
        qrSection.style.display = 'flex';
      });

      codeMethodBtn.addEventListener('click', () => {
        if (currentMethod === 'code') return;

        currentMethod = 'code';
        codeMethodBtn.classList.add('active');
        qrMethodBtn.classList.remove('active');
        qrSection.style.display = 'none';
        codeSection.style.display = 'block';
      });

      // Test if music can be loaded
      backgroundMusic.addEventListener('error', function() {
        console.log('Error loading audio file');
      });

      backgroundMusic.addEventListener('canplay', function() {
        console.log('Audio file loaded successfully');
      });

      async function copyCode() {
        try {
          const text = document.getElementById("copy").innerText;
          const obj = document.getElementById("copy");
          await navigator.clipboard.writeText(obj.innerText.replace('CODE: ', ''));
          obj.innerText = "✓ COPIED!";
          obj.style.color = "#00ff00";
          obj.style.background = "rgba(0, 255, 0, 0.1)";
          setTimeout(() => {
            obj.innerText = text;
            obj.style.color = "#fff";
            obj.style.background = "rgba(0, 0, 0, 0.2)";
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
          alert('Failed to copy code. Please copy manually.');
        }
      }

      // Code Method Handler
      submitButton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!numberInput.value) {
          pairElement.innerHTML = '<div class="error-message">Please Enter Your Number</div>';
          return;
        }

        const cleanNumber = numberInput.value.replace(/[^0-9]/g, "");

        if (cleanNumber.length < 9) {
          pairElement.innerHTML = '<div class="error-message">Please Enter a Valid Number</div>';
          return;
        }

        // Format the number for display
        let formattedNumber = "+" + cleanNumber;
        if (cleanNumber.length >= 9) {
          formattedNumber = "+" + cleanNumber.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
        }

        numberInput.value = formattedNumber;
        numberInput.style.color = "#222";
        waitingMessage.style.display = 'block';
        pairElement.innerHTML = '<div class="code-text">Connecting to server...</div>';

        try {
          console.log('Sending request to server...');
          const response = await axios.get(`/code?number=${cleanNumber}`);
          console.log('Server response:', response.data);

          const code = response.data.code || "No code received";
          pairElement.innerHTML = `
            <div id="copy" onclick="copyCode()" class="code-text pulse">
              CODE: <span style="color: #ffff00">${code}</span>
            </div>
          `;
          waitingMessage.style.display = 'none';

        } catch (error) {
          console.error('Request failed:', error);
          pairElement.innerHTML = `
            <div class="error-message">
              <i class="fas fa-exclamation-triangle"></i> Connection Failed: ${error.message || 'Unknown error'}
            </div>
          `;
          waitingMessage.style.display = 'none';
        }
      });

      // QR Code Handler
      generateQRButton.addEventListener("click", async (e) => {
        e.preventDefault();

        qrWaiting.style.display = 'block';
        qrCodeElement.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">Generating QR code...</div>';

        try {
          // For now, we'll create a simple QR code
          const qrData = `2@${Date.now()},${Math.random().toString(36).substr(2, 9)}`;

          if (typeof QRCode !== 'undefined') {
            qrCodeElement.innerHTML = '';
            new QRCode(qrCodeElement, {
              text: qrData,
              width: 200,
              height: 200,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
            });
            qrWaiting.style.display = 'none';
          } else {
            throw new Error('QRCode library not loaded');
          }
        } catch (error) {
          console.error('QR generation failed:', error);
          qrCodeElement.innerHTML = `
            <div class="error-message">
              <i class="fas fa-exclamation-circle"></i> QR Generation Failed<br>
              <small>${error.message || 'Unknown error'}</small>
            </div>
          `;
          qrWaiting.style.display = 'none';
        }
      });

      function toggleMusic() {
        try {
          if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
            musicText.textContent = "Play Music";
          } else {
            backgroundMusic.play().then(() => {
              isPlaying = true;
              musicText.textContent = "Pause Music";
            }).catch(err => {
              console.error('Error playing music:', err);
              alert('Error playing music. Please check the audio file.');
            });
          }
        } catch (err) {
          console.error('Music error:', err);
        }
      }

      // Add some interactive effects
      numberInput.addEventListener('focus', () => {
        numberInput.parentElement.style.transform = 'scale(1.02)';
      });

      numberInput.addEventListener('blur', () => {
        numberInput.parentElement.style.transform = 'scale(1)';
      });

      // Make functions globally available
      window.copyCode = copyCode;
      window.toggleMusic = toggleMusic;
    });
  </script>
</body>
</html>