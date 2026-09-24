import React, { useMemo } from 'react';
import QRCode from 'qrcode';
import Svg, { Path, Rect } from 'react-native-svg';

interface FastQRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

/**
 * High-performance synchronous Vector SVG QR Code Renderer
 * Calculates the QR matrix synchronously in <1ms and renders directly via react-native-svg.
 * Eliminates all Base64 conversions, async lag, and image loading spinners.
 */
export const FastQRCode: React.FC<FastQRCodeProps> = ({
  value,
  size = 200,
  color = '#0F172A',
  backgroundColor = '#FFFFFF',
}) => {
  const { path, totalSize } = useMemo(() => {
    try {
      const qr = QRCode.create(value || 'N/A', { errorCorrectionLevel: 'M' });
      const matrixSize = qr.modules.size;
      const margin = 2;
      const total = matrixSize + 2 * margin;
      let pathData = '';

      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          if (qr.modules.get(r, c)) {
            pathData += `M${c + margin},${r + margin}h1v1h-1z `;
          }
        }
      }

      return { path: pathData, totalSize: total };
    } catch (err) {
      console.warn('[FastQRCode] Error generating QR matrix:', err);
      return { path: '', totalSize: 25 };
    }
  }, [value]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${totalSize} ${totalSize}`}>
      <Rect width={totalSize} height={totalSize} fill={backgroundColor} rx={1} />
      <Path d={path} fill={color} />
    </Svg>
  );
};
