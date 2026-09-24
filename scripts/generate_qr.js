const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const ip = getLocalIp();
const port = 8081;

const expoGoUrl = `exp://${ip}:${port}`;
const webUrl = `http://${ip}:${port}`;

async function main() {
  const currentArtifactDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\8bd91e81-e94a-4c3e-af63-529e537464a8';
  if (!fs.existsSync(currentArtifactDir)) {
    fs.mkdirSync(currentArtifactDir, { recursive: true });
  }

  const rootExpoQrPath = path.join(process.cwd(), 'expo_qr.png');
  const artifactExpoQrPath = path.join(currentArtifactDir, 'expo_qr.png');
  const artifactWebQrPath = path.join(currentArtifactDir, 'web_qr.png');

  const qrOptions = {
    width: 400,
    margin: 2,
    color: {
      dark: '#1E1B4B',
      light: '#FFFFFF'
    }
  };

  await QRCode.toFile(rootExpoQrPath, expoGoUrl, qrOptions);
  await QRCode.toFile(artifactExpoQrPath, expoGoUrl, qrOptions);
  await QRCode.toFile(artifactWebQrPath, webUrl, qrOptions);

  console.log('✅ QR Code đã được tạo thành công!');
  console.log('👉 Expo Go URL (Không cần tài khoản):', expoGoUrl);
  console.log('👉 Web Browser URL:', webUrl);
  console.log('📁 File QR lưu tại:', rootExpoQrPath);

  const expoTerminal = await QRCode.toString(expoGoUrl, { type: 'terminal', small: true });
  console.log('\n========================================');
  console.log('📱 QUÉT MÃ QR DƯỚI ĐÂY BẰNG EXPO GO / CAMERA (KHÔNG CẦN TÀI KHOẢN)');
  console.log('========================================\n');
  console.log(expoTerminal);
  console.log('========================================\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
