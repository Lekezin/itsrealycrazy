import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';

const origin = process.env.JOURNEY_URL || 'http://localhost:5173';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch();
const systemSession = await browser.newBrowserCDPSession();
const { gpu } = await systemSession.send('SystemInfo.getInfo');
const errors = [];
const viewports = [
  [1920, 1080],
  [1440, 960],
  [1280, 720],
  [1024, 768],
  [1023, 768],
  [768, 1024],
  [390, 844],
  [360, 640],
  [320, 568],
  [844, 390],
];
const results = [];
for (const [width, height] of viewports) {
  const mobile = width < 1024;
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push({ width, height, message: error.message }));
  const failedRequests = [];
  page.on('response', (response) => {
    if (response.url().startsWith(origin) && response.status() >= 400)
      failedRequests.push(response.url());
  });
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
  const home = await page.evaluate(() => {
    const rect = document.querySelector('.slanted-stage').getBoundingClientRect();
    const heading = document.querySelector('h1').getBoundingClientRect();
    return {
      viewportOverflow: document.documentElement.scrollWidth > innerWidth,
      titleFits: heading.right <= innerWidth,
      cardHeight: Math.round(rect.height),
      brokenImages: [...document.images].filter((image) => !image.complete || !image.naturalWidth)
        .length,
    };
  });
  if (width === 1440 || width === 390 || width === 320 || width === 844)
    await page.screenshot({ path: `artifacts/home-${width}x${height}.png` });
  if (width === 1440) {
    await page
      .getByRole('button', { name: 'Explorar Blackpink, fandom BLINK', exact: true })
      .hover();
    await page.waitForTimeout(650);
    await page.screenshot({ path: 'artifacts/hover-desktop.png' });
    await page.mouse.move(0, 0);
  }
  await page.getByRole('button', { name: 'Explorar BTS, fandom ARMY', exact: true }).click();
  await page.waitForTimeout(800);
  const detail = await page.locator('.detail-page').evaluate((element) => ({
    overflow: element.scrollWidth > element.clientWidth,
    scrollHeight: element.scrollHeight,
    titleWidth: document.querySelector('#group-title').getBoundingClientRect().width,
    brokenImages: [...element.querySelectorAll('img')].filter(
      (image) => image.complete && !image.naturalWidth,
    ).length,
  }));
  if (width === 1440 || width === 390) {
    await page.screenshot({ path: `artifacts/detail-${width}x${height}.png` });
    await page.evaluate(() => {
      document.querySelector('.home-page').style.display = 'none';
      Object.assign(document.querySelector('#root').style, { height: 'auto', overflow: 'visible' });
      Object.assign(document.querySelector('.detail-page').style, {
        position: 'relative',
        inset: 'auto',
        height: 'auto',
        overflow: 'visible',
      });
      document
        .querySelectorAll('img[loading="lazy"]')
        .forEach((image) => (image.loading = 'eager'));
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `artifacts/detail-full-${width}x${height}.png`, fullPage: true });
  }
  results.push({ width, height, home, detail, failedRequests });
  await context.close();
}

// One isolated browser page, no concurrent test workers. This is a headless frame
// scheduling sample on the development machine, not a cross-device FPS guarantee.
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
await page.goto(origin);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.evaluate(() => {
  window.journeyFrameSample = { intervals: [], longTasks: [] };
  new PerformanceObserver((list) =>
    window.journeyFrameSample.longTasks.push(
      ...list.getEntries().map((entry) => Math.round(entry.duration)),
    ),
  ).observe({ type: 'longtask', buffered: false });
  let last = performance.now();
  const loop = (now) => {
    window.journeyFrameSample.intervals.push(now - last);
    last = now;
    window.journeyRaf = requestAnimationFrame(loop);
  };
  window.journeyRaf = requestAnimationFrame(loop);
});
for (const name of ['BTS, fandom ARMY', 'TWICE, fandom ONCE', '(G)I-DLE, fandom NEVERLAND']) {
  await page.getByRole('button', { name: `Explorar ${name}`, exact: true }).hover();
  await page.waitForTimeout(600);
}
await page
  .getByRole('button', { name: 'Explorar (G)I-DLE, fandom NEVERLAND', exact: true })
  .click();
await page.waitForTimeout(900);
const frameSample = await page.evaluate(() => {
  cancelAnimationFrame(window.journeyRaf);
  const { intervals, longTasks } = window.journeyFrameSample;
  const sorted = intervals.slice(1).sort((a, b) => a - b);
  return {
    sampleFrames: sorted.length,
    medianFrameMs: +sorted[Math.floor(sorted.length / 2)].toFixed(2),
    p95FrameMs: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2),
    framesOver34ms: sorted.filter((value) => value > 34).length,
    longTasksOver50ms: longTasks,
    context:
      'Chromium headless, 1440x960, hardware and refresh-rate specific; not a real-device guarantee.',
  };
});
frameSample.gpuCompositing = gpu.featureStatus.gpu_compositing;
frameSample.renderer = gpu.devices[0]?.deviceString;
await browser.close();
const report = { date: '2026-11-01', results, frameSample, errors };
await writeFile('artifacts/visual-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (
  errors.length ||
  results.some(
    (result) =>
      result.home.viewportOverflow ||
      !result.home.titleFits ||
      result.detail.overflow ||
      result.failedRequests.length,
  )
)
  process.exitCode = 1;
