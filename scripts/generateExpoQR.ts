import QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

const url = 'exp://172.26.26.185:8081';

async function main() {
  // 1. Generate Terminal String QR
  const qrString = await QRCode.toString(url, { type: 'terminal', small: true });
  console.log('\n--- TERMINAL QR CODE ---');
  console.log(qrString);
  console.log('------------------------\n');

  // 2. Generate PNG to project directory
  const pngPath = path.join(process.cwd(), 'expo_qr.png');
  await QRCode.toFile(pngPath, url, {
    width: 350,
    margin: 2,
    color: {
      dark: '#1e1b4b',
      light: '#ffffff',
    },
  });
  console.log('Saved PNG QR to:', pngPath);

  // 3. Save to artifact directory
  const artifactPath = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\93da65ae-77ea-47bd-95df-822d5f1eccec\\expo_qr.png';
  await QRCode.toFile(artifactPath, url, {
    width: 350,
    margin: 2,
    color: {
      dark: '#1e1b4b',
      light: '#ffffff',
    },
  });
  console.log('Saved PNG QR to artifacts:', artifactPath);
}

main().catch(console.error);
