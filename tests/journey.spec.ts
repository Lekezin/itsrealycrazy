import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const groups = [
  ['bts', 'BTS', 'ARMY', 'Dynamite', '/audio/bts-dynamite.mp3'],
  ['blackpink', 'Blackpink', 'BLINK', 'Shut Down', '/audio/blackpink-shut-down.mp3'],
  ['twice', 'TWICE', 'ONCE', 'FANCY', '/audio/twice-fancy.mp3'],
  ['red-velvet', 'Red Velvet', 'ReVeluv', 'Feel My Rhythm', '/audio/red-velvet-feel-my-rhythm.mp3'],
  ['mamamoo', 'MAMAMOO', 'MOOMOO', 'HIP', '/audio/mamamoo-hip.mp3'],
  ['gidle', '(G)I-DLE', 'NEVERLAND', 'Queencard', '/audio/gidle-queencard.mp3'],
  ['stray-kids', 'Stray Kids', 'STAY', 'MANIAC', '/audio/stray-kids-maniac.mp3'],
];
const open = async (page: Page, name = 'BTS', fandom = 'ARMY') => {
  const card = page.getByRole('button', {
    name: `Explorar ${name}, fandom ${fandom}`,
    exact: true,
  });
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page.locator('#group-title')).toHaveText(name);
};
const audioState = (page: Page) =>
  page.evaluate(() => {
    const howls =
      (
        window as unknown as {
          Howler?: {
            _howls: { playing(): boolean; volume(): number; duration(): number; _src: string }[];
          };
        }
      ).Howler?._howls ?? [];
    return {
      count: howls.length,
      playing: howls.filter((howl) => howl.playing()).length,
      volume: howls[0]?.volume() ?? 0,
      src: howls[0]?._src ?? '',
      duration: howls[0]?.duration() ?? 0,
    };
  });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

for (const [id, name, fandom, track, source] of groups) {
  test(`${name}: abre conteúdo, fotografia e áudio reais`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await open(page, name, fandom);
    await expect(page).toHaveURL(new RegExp(`#\/group\/${id}$`));
    await expect(page.getByRole('heading', { name: `Olá, ${fandom}.` })).toBeAttached();
    await expect.poll(async () => (await audioState(page)).playing).toBe(1);
    await expect(page.locator('.audio-track strong')).toHaveText(`${track} · ${name}`);
    expect((await audioState(page)).src).toBe(source);
    expect((await audioState(page)).duration).toBeGreaterThan(90);
    await expect(page.locator('.artist-frame img')).toBeVisible();
    expect(
      await page
        .locator('.artist-frame img')
        .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
    ).toBe(true);
    await expect(page.locator('.timeline-item')).toHaveCount(3);
    await expect(page.locator('.album')).toHaveCount(3);
    await expect(page.locator('.song-list a')).toHaveCount(3);
    await expect(page.locator('.detail-page')).toHaveAttribute('data-theme', id);
    await expect(page.locator('.gallery-photo')).toHaveCount(6);
    expect(
      await page
        .locator('.detail-page')
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('player reproduz, pausa, silencia e libera o áudio ao sair', async ({ page, isMobile }) => {
  await open(page);
  await expect.poll(async () => (await audioState(page)).volume).toBeCloseTo(0.1, 2);
  await expect(
    page.getByRole('slider', { name: 'Volume do ambiente', includeHidden: true }),
  ).toHaveAttribute('max', '0.3');
  await page.getByRole('button', { name: 'Pausar áudio', exact: true }).click();
  await expect.poll(async () => (await audioState(page)).playing).toBe(0);
  await page.getByRole('button', { name: 'Reproduzir áudio', exact: true }).click();
  await expect.poll(async () => (await audioState(page)).playing).toBe(1);
  await page.getByRole('button', { name: 'Silenciar áudio', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ativar som', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Ativar som', exact: true }).click();
  if (!isMobile) {
    await page.locator('.volume-control').hover();
    await page.getByRole('slider', { name: 'Volume do ambiente' }).focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('slider')).toHaveValue('0.01');
  }
  await page.getByRole('button', { name: 'Todos os universos' }).click();
  await expect(page.locator('.detail-page')).toHaveCount(0);
  await expect.poll(async () => (await audioState(page)).count).toBe(0);
});

test('divisões diagonais mantêm a geometria e escurecem apenas as vizinhas', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'O carrossel touch possui controles próprios.');
  const cards = page.locator('.group-strip');
  await expect(cards).toHaveCount(7);
  const target = page.getByRole('button', {
    name: 'Explorar Red Velvet, fandom ReVeluv',
    exact: true,
  });
  const before = await target.boundingBox();
  await target.hover();
  await expect(target).toHaveClass(/is-focused/);
  await expect(page.locator('.group-strip.is-dimmed')).toHaveCount(6);
  await expect(page.locator('.group-strip.is-dimmed .slice-dimmer').first()).toHaveCSS(
    'opacity',
    '0.8',
  );
  expect(await target.boundingBox()).toEqual(before);
  expect(await target.evaluate((element) => getComputedStyle(element).clipPath)).toContain(
    'polygon',
  );
  await page.mouse.move(15, 30);
  await expect(page.locator('.group-strip.is-dimmed')).toHaveCount(0);
});

test('as sete identidades preservam conteúdo e acessibilidade', async ({ page }) => {
  test.setTimeout(60000);
  const backgrounds = new Set<string>();
  const issues: { group: string; id: string; targets: unknown[] }[] = [];
  for (const [id] of groups) {
    await page.goto(`/#/group/${id}`);
    const world = page.locator(`.detail-page[data-theme="${id}"]`);
    await expect(world).toHaveAttribute('data-theme', id);
    await expect(world).toHaveClass(/is-settled/);
    backgrounds.add(await world.evaluate((element) => getComputedStyle(element).backgroundColor));
    await expect(page.locator('.photo-essay')).toBeAttached();
    const report = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    issues.push(
      ...report.violations.map((issue) => ({
        group: id,
        id: issue.id,
        targets: issue.nodes.map((node) => node.target),
      })),
    );
  }
  expect(backgrounds.size).toBe(7);
  expect(issues).toEqual([]);
});

test('retorno durante o fade inicial não mantém áudio nem dispara erro', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await open(page);
  await page.getByRole('button', { name: 'Todos os universos' }).click();
  await expect.poll(async () => (await audioState(page)).count).toBe(0);
  await open(page, 'TWICE', 'ONCE');
  await expect.poll(async () => (await audioState(page)).playing).toBe(1);
  await expect.poll(async () => (await audioState(page)).count).toBe(1);
  expect(errors).toEqual([]);
});

test('quiz fornece feedback, resultado e reinício', async ({ page }) => {
  await open(page);
  const quiz = page.locator('.quiz-card');
  await quiz.scrollIntoViewIfNeeded();
  await expect(quiz.getByRole('button', { name: 'Próxima pergunta' })).toBeDisabled();
  for (let step = 0; step < 3; step++) {
    await quiz.locator('.quiz-option').nth(1).click();
    await expect(quiz.locator('.quiz-option').nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(quiz.locator('.quiz-feedback')).not.toBeEmpty();
    await quiz
      .getByRole('button', { name: step === 2 ? 'Descobrir meu match' : 'Próxima pergunta' })
      .click();
  }
  await expect(quiz.getByRole('heading', { name: 'Sua vibe é j-hope.' })).toBeVisible();
  await quiz.getByRole('button', { name: 'Fazer de novo' }).click();
  await expect(
    quiz.getByRole('heading', { name: 'Qual integrante tem a sua vibe?' }),
  ).toBeVisible();
});

test('coleção vazia, salvar, persistir e remover', async ({ page }) => {
  await page.getByRole('button', { name: /Minha coleção/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Seu próximo favorito está lá fora.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Encontrar meu universo' }).click();
  await open(page);
  await page.getByRole('button', { name: 'Salvar na coleção', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Na minha coleção' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.reload();
  await expect(page.getByRole('button', { name: 'Na minha coleção' })).toBeVisible();
  await page.getByRole('button', { name: 'Todos os universos' }).click();
  await page.getByRole('button', { name: /Minha coleção/ }).click();
  await expect(page.locator('.collection-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Remover BTS da coleção' }).click();
  await expect(
    page.getByRole('heading', { name: 'Seu próximo favorito está lá fora.' }),
  ).toBeVisible();
});

test('galeria amplia, navega e fecha sem sair do grupo', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Ampliar foto: Além do palco' }).click();
  await expect(page.getByRole('dialog', { name: 'Além do palco' })).toBeVisible();
  await page.getByRole('button', { name: 'Próxima foto', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Em outra frequência' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('#group-title')).toHaveText('BTS');
});

test('links diretos não iniciam áudio, navegação do navegador funciona', async ({ page }) => {
  await page.goto('/#/group/gidle');
  await expect(page.locator('#group-title')).toHaveText('(G)I-DLE');
  await expect(page.getByRole('button', { name: 'Reproduzir áudio', exact: true })).toBeVisible();
  expect((await audioState(page)).playing).toBe(0);
  await page.getByRole('button', { name: 'Reproduzir áudio', exact: true }).click();
  await expect.poll(async () => (await audioState(page)).playing).toBe(1);
  await page.getByRole('button', { name: 'Todos os universos' }).click();
  await open(page, 'Blackpink', 'BLINK');
  await page.goBack();
  await expect(page.locator('.detail-page')).toHaveCount(0);
  await page.goForward();
  await expect(page.locator('#group-title')).toHaveText('Blackpink');
});

test('preferência de som é respeitada e persiste', async ({ page }) => {
  const preference = page.getByRole('button', {
    name: 'Ativar ou desativar o áudio ao explorar um grupo',
  });
  await preference.click();
  await expect(preference).toHaveAttribute('aria-pressed', 'false');
  await open(page);
  await expect(page.getByRole('button', { name: 'Ativar som', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Todos os universos' }).click();
  await preference.click();
  await open(page);
  await expect(page.getByRole('button', { name: 'Silenciar áudio', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
});

test('erro de áudio oferece tentativa novamente', async ({ page }) => {
  await page.route('**/audio/*.mp3', (route) => route.abort());
  await open(page);
  await expect(page.getByText('Não foi possível reproduzir', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reproduzir áudio', exact: true })).toBeEnabled();
});

test('teclado move entre faixas e retorna foco ao fechar', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Gestos e controles de carrossel são verificados no projeto mobile.');
  await page.getByRole('button', { name: 'Explorar BTS, fandom ARMY', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('button', { name: 'Explorar Blackpink, fandom BLINK', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#group-title')).toHaveText('Blackpink');
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Explorar Blackpink, fandom BLINK', exact: true }),
  ).toBeFocused();
});

test('movimento reduzido preserva a experiência', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await open(page);
  await expect(page.locator('.quiz-card')).toBeAttached();
  await page.getByRole('button', { name: 'Todos os universos' }).click();
  await expect(page.locator('.detail-page')).toHaveCount(0);
});

test('acessibilidade nas telas inicial e de detalhes', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Escolha seu K-Pop Journey!',
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await open(page);
  await page.waitForTimeout(700);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});

test('carrossel touch e navegação entre os sete grupos', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'O desktop usa seis faixas contíguas.');
  const stage = page.locator('.slanted-stage');
  await page.getByRole('button', { name: 'Próximo grupo', exact: true }).click();
  await expect
    .poll(async () => stage.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(100);
  await page.getByRole('button', { name: 'Ir para Stray Kids', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Ir para Stray Kids', exact: true }),
  ).toHaveAttribute('aria-current', 'true');
  await open(page, 'Stray Kids', 'STAY');
});
