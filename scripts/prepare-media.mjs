import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';

await mkdir('public/audio', { recursive: true });
for (const file of await readdir('public/images')) {
  if (!/\.(jpg|png)$/.test(file)) continue;
  const destination = `public/images/${file.replace(/\.(jpg|png)$/, '.webp')}`;
  await sharp(`public/images/${file}`)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 87 })
    .toFile(destination);
  console.log(destination);
}

// Original, deterministic ambient compositions. No samples or commercial music.
const compositions = [
  { id: 'bts', root: 196, progression: [0, -5, -3, -7] },
  { id: 'blackpink', root: 220, progression: [0, -3, -5, -7] },
  { id: 'twice', root: 261.63, progression: [0, -5, -3, -5] },
  { id: 'red-velvet', root: 174.61, progression: [0, 3, -2, -5] },
  { id: 'mamamoo', root: 164.81, progression: [0, -5, 2, -3] },
  { id: 'gidle', root: 233.08, progression: [0, -3, -7, -5] },
  { id: 'stray-kids', root: 146.83, progression: [0, -2, -5, -3] },
];
const rate = 22050;
const duration = 24;
const total = rate * duration;
for (const { id, root, progression } of compositions) {
  const buffer = Buffer.alloc(44 + total * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + total * 2, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(total * 2, 40);
  const notes = [0, 7, 12, 16, 12, 7, 19, 16];
  for (let i = 0; i < total; i++) {
    const t = i / rate;
    const chord = Math.floor(t / 6) % 4;
    const base = root * 2 ** (progression[chord] / 12);
    const chordTime = t % 6;
    const padEnvelope = Math.min(1, chordTime / 0.8) * Math.min(1, (6 - chordTime) / 1.2);
    let pad = 0;
    for (const interval of [0, 7, 12, 16]) {
      const f = (base * 2 ** (interval / 12)) / 2;
      pad += Math.sin(2 * Math.PI * f * t + Math.sin(t * 0.4) * 0.06) * 0.035;
    }
    const step = Math.floor(t / 0.75);
    const noteTime = t % 0.75;
    const f = base * 2 ** (notes[step % notes.length] / 12);
    const bell =
      (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(2 * Math.PI * f * 2 * t)) *
      Math.exp(-noteTime * 4.5) *
      Math.min(1, noteTime / 0.012) *
      0.11;
    const bass = Math.sin(((2 * Math.PI * base) / 4) * t) * padEnvelope * 0.045;
    const edge = Math.min(1, t / 0.3, (duration - t) / 0.5);
    const sample = (pad * padEnvelope + bell + bass) * edge;
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, sample * 32767)), 44 + i * 2);
  }
  await writeFile(`public/audio/${id}.wav`, buffer);
  console.log(`Original composition: ${id}`);
}
