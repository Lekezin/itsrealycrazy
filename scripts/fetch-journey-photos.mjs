import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import sharp from 'sharp';

// Curated Commons photographs, with attribution stored alongside every image.
const titles = {
  bts: [
    'BTS for Samsung Galaxy, 2022.jpg',
    'BTS LG G7 ThinQ mobile advertisement (cropped).jpg',
    'BTS in the commercial film for Mara Hot Chicken, 2016.jpg',
  ],
  blackpink: [
    'BLACKPINK PUBG Mobile Sept 2020 ad (derived).jpg',
    '20190518 Blackpink Amsterdam concert 26.jpg',
    'Blackpink PUBG 210321.jpg',
  ],
  twice: [
    'Twice - Dickies Arena, 2022 (cropped).jpg',
    'Twice Gaon Chart Kpop Awards 2019 1.png',
    'Twice This Is For World Tour in Vancouver, post-finale send off, January 9, 2026.jpg',
  ],
  'red-velvet': [
    'Red Velvet SBS RADIO 2022.jpg',
    '20230530 Red Velvet Amsterdam concert 001.jpg',
    'Red Velvet Music Bank Mini Fan Meeting June 2024.jpg',
  ],
  mamamoo: ['Mamamoo My con 2023.jpg', 'Mamamoo in 2023.jpg', 'Mamamoo in 2023.png'],
  gidle: [
    '20241130 (G)I-dle MMA 2024 Red Carpet.jpg',
    '20230911 (G)I-dle Amsterdam concert 105.jpg',
    '(G)I-DLE Airport Departure 2024.png',
  ],
  'stray-kids': [
    'Stray Kids at the 40th Golden Disc Awards, January 10, 2026 (1).png',
    'Bang Chan of Stray Kids, October 15, 2025 (2).png',
    'Lee Know of Stray Kids, September 2, 2025 (1).png',
    'I.N of Stray Kids at Incheon Airport, May 3, 2024.png',
  ],
};
const originals = JSON.parse(await readFile('src/data/photo-credits.json', 'utf8'));
let result = {};
try {
  result = JSON.parse(await readFile('src/data/journey-photos.json', 'utf8'));
} catch {
  /* First run. */
}
await mkdir('public/images/journeys', { recursive: true });
const plain = (value) => value?.value?.replace(/<[^>]*>/g, '').trim() ?? '';
for (const [id, files] of Object.entries(titles)) {
  result[id] ??= [];
  for (let index = 0; index < files.length; index++) {
    if (result[id].some((photo) => photo.title === files[index])) continue;
    await new Promise((resolve) => setTimeout(resolve, 700));
    const title = `File:${files[index]}`;
    const metadata = await (
      await fetch(
        'https://commons.wikimedia.org/w/api.php?' +
          new URLSearchParams({
            action: 'query',
            format: 'json',
            prop: 'imageinfo',
            iiprop: 'url|extmetadata',
            iiurlwidth: '1280',
            titles: title,
          }),
      )
    ).json();
    const info = Object.values(metadata.query?.pages ?? {})[0]?.imageinfo?.[0];
    if (!info) throw new Error(`Commons file not found: ${title}`);
    const originalUrl = info.url.split('?')[0];
    const cachedThumb =
      originalUrl.replace('/commons/', '/commons/thumb/') +
      '/1280px-' +
      originalUrl.split('/').at(-1);
    const source = (info.thumburl || cachedThumb).split('?')[0];
    const src = `/images/journeys/${id}-${index + 1}.webp`;
    let exists = false;
    try {
      await access(`public${src}`);
      exists = true;
    } catch {
      /* Download below. */
    }
    if (!exists) {
      let response;
      for (let attempt = 0; attempt < 4; attempt++) {
        response = await fetch(attempt === 1 ? cachedThumb : attempt === 2 ? info.url : source);
        if (response.ok) break;
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
      }
      if (!response.ok) throw new Error(`${title}: ${response.status}`);
      await sharp(Buffer.from(await response.arrayBuffer()))
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 88 })
        .toFile(`public${src}`);
    }
    result[id].push({
      src,
      source: info.descriptionurl,
      author: plain(info.extmetadata.Artist),
      license: plain(info.extmetadata.LicenseShortName),
      licenseUrl: plain(info.extmetadata.LicenseUrl),
      title: files[index],
      originalUrl: source,
    });
    console.log(`${id}: ${index + 1}`);
    await writeFile('src/data/journey-photos.json', JSON.stringify(result, null, 2));
  }
  const original = originals.find((photo) => photo.id === id);
  if (original && !result[id].some((photo) => photo.src === `/images/${id}.webp`))
    result[id].push({
      src: `/images/${id}.webp`,
      source: original.attribution,
      author: original.author,
      license: original.license,
      licenseUrl: original.licenseUrl,
      title: `${id} · arquivo`,
      originalUrl: original.source,
    });
}
const velvet = result['red-velvet'];
const archive = velvet.findIndex((photo) => photo.src === '/images/red-velvet.webp');
if (archive > 0) velvet.unshift(velvet.splice(archive, 1)[0]);
await writeFile('src/data/journey-photos.json', JSON.stringify(result, null, 2));
