import jpeg from 'jpeg-js';

const SAMPLE_SIZE = 16;
const MATCH_THRESHOLD = 76;

function base64ToBytes(base64: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i += 4) {
    const enc1 = chars.indexOf(clean.charAt(i));
    const enc2 = chars.indexOf(clean.charAt(i + 1));
    const enc3 = chars.indexOf(clean.charAt(i + 2));
    const enc4 = chars.indexOf(clean.charAt(i + 3));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    bytes.push(chr1);
    if (enc3 !== 64 && enc3 !== -1) bytes.push(chr2);
    if (enc4 !== 64 && enc4 !== -1) bytes.push(chr3);
  }

  return Uint8Array.from(bytes);
}

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function createFaceFingerprint(base64: string) {
  const decoded = jpeg.decode(base64ToBytes(base64), { useTArray: true });
  const values: number[] = [];

  for (let y = 0; y < SAMPLE_SIZE; y += 1) {
    for (let x = 0; x < SAMPLE_SIZE; x += 1) {
      const cropX = decoded.width * 0.2;
      const cropY = decoded.height * 0.12;
      const cropWidth = decoded.width * 0.6;
      const cropHeight = decoded.height * 0.72;
      const px = Math.floor(cropX + (x + 0.5) * (cropWidth / SAMPLE_SIZE));
      const py = Math.floor(cropY + (y + 0.5) * (cropHeight / SAMPLE_SIZE));
      const offset = (py * decoded.width + px) * 4;
      values.push(
        luminance(decoded.data[offset], decoded.data[offset + 1], decoded.data[offset + 2]),
      );
    }
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.map((value) => (value > average ? '1' : '0')).join('');
}

export function faceFingerprintsMatch(saved: string | undefined, current: string) {
  if (!saved || saved.length !== current.length) return false;
  let distance = 0;

  for (let i = 0; i < saved.length; i += 1) {
    if (saved[i] !== current[i]) distance += 1;
  }

  return distance <= MATCH_THRESHOLD;
}
