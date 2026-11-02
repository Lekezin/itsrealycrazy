import { mkdir, writeFile } from 'node:fs/promises';

// Preserve the original Commons links and their license/author pages.
const pages = {
  bts: 'BTS',
  blackpink: 'Blackpink',
  twice: 'Twice',
  'red-velvet': 'Red_Velvet_(group)',
  mamamoo: 'Mamamoo',
  gidle: 'I-dle',
};
await mkdir('public/images', { recursive: true });
const credits = [];
for (const [id, title] of Object.entries(pages)) {
  const page = `https://en.wikipedia.org/wiki/${title}`;
  const html = await (await fetch(page)).text();
  const match = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (!match) throw new Error(`Missing photo: ${id}`);
  const source = match[1].replaceAll('&amp;', '&').split('?')[0];
  const response = await fetch(source);
  if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`);
  const extension = source.includes('.png') ? 'png' : 'jpg';
  await writeFile(`public/images/${id}.${extension}`, Buffer.from(await response.arrayBuffer()));
  const file = decodeURIComponent(
    source
      .split('/')
      .at(-1)
      .replace(/^1280px-/, ''),
  );
  const metadataUrl =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'imageinfo',
      iiprop: 'extmetadata',
      titles: `File:${file}`,
    });
  const metadata = await (await fetch(metadataUrl)).json();
  const info = Object.values(metadata.query.pages)[0].imageinfo[0].extmetadata;
  const plain = (value) => value?.value?.replace(/<[^>]*>/g, '').trim() ?? '';
  credits.push({
    id,
    page,
    source,
    file: `/images/${id}.${extension}`,
    attribution: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`,
    author: plain(info.Artist),
    license: plain(info.LicenseShortName),
    licenseUrl: plain(info.LicenseUrl),
  });
  console.log(`Downloaded ${id}`);
}
await writeFile('src/data/photo-credits.json', JSON.stringify(credits, null, 2));

const atmosphere = [
  ['concert', 'photo-1492684223066-81342ee5ff30'],
  ['stage', 'photo-1501386761578-eac5c94b800a'],
  ['crowd', 'photo-1459749411175-04bf5292ceea'],
];
for (const [name, photo] of atmosphere) {
  const source = `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=85`;
  const response = await fetch(source);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  await writeFile(`public/images/${name}.jpg`, Buffer.from(await response.arrayBuffer()));
  console.log(`Downloaded ${name}`);
}
