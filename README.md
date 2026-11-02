# K-Journey — Escolha seu K-Pop Journey!

Aplicação interativa em português com **BTS, Blackpink, TWICE, Red Velvet, MAMAMOO, (G)I-DLE e Stray Kids**. React + TypeScript + Vite, animações com Motion e áudio com Howler.js. Sem backend, conta, chave de API ou configuração de ambiente.

## Rodar

Requer Node.js 22.12+ ou 24 LTS e npm.

```sh
npm ci
npm run dev
```

Abra **http://localhost:5173**. O servidor também aceita acesso pela rede local para testar no celular. Para a versão de produção:

```sh
npm run build
npm run preview
```

`dist/` contém o site pronto para hospedagem estática. Abra por um servidor HTTP; `file://` não suporta a aplicação modular. Os links internos usam hash (`/#/group/bts`), sem necessidade de rewrite no servidor.

## Estrutura

```text
E:/DELA/
├── .gitignore / .prettierrc.json
├── index.html
├── package.json / package-lock.json
├── vite.config.ts
├── tsconfig.json
├── playwright.config.ts
├── README.md / CREDITS.md / VERIFICACAO.md
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # Faixas, navegação, modais e coleção
│   ├── styles.css                 # Componentes de base e estados acessíveis
│   ├── redesign.css               # Entrada com sete divisões e nova paleta neutra
│   ├── group-themes.css           # Sete identidades, layouts e breakpoints
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── HomeSelector.tsx       # Sete polígonos fixos e carrossel touch
│   │   ├── GroupDetail.tsx        # Hero, história, álbuns, galeria e fandom
│   │   ├── AudioPlayer.tsx        # Play/pause, mute, volume e equalizador
│   │   ├── Quiz.tsx               # Três perguntas, feedback e resultado
│   │   └── Modal.tsx              # Diálogo com foco e Escape
│   ├── hooks/
│   │   ├── useAmbientAudio.ts     # Howler, fade, tratamento de erro e descarte
│   │   └── usePersistedState.ts   # Persistência em localStorage
│   └── data/
│       ├── audio-tracks.ts        # Música por artista e volume ambiente de 10%
│       ├── groups.ts              # Array tipado groupsData com os sete grupos
│       ├── group-designs.ts       # Cores, direção de arte e playlists por grupo
│       ├── journey-photos.json    # 28 fotos selecionadas com autores e licenças
│       └── photo-credits.json     # Origem, autores e licenças das fotografias
├── public/
│   ├── favicon.svg
│   ├── images/                   # WebP usados pelo app e originais JPG/PNG
│   └── audio/                    # 7 músicas MP3 + instrumentais WAV de exemplo
├── scripts/
│   ├── fetch-assets.mjs           # Download opcional e atribuição das fotos
│   └── prepare-media.mjs          # WebP e síntese das trilhas originais
├── tests/
│   └── journey.spec.ts            # Testes de integração desktop/mobile
└── artifacts/                    # Capturas e relatório de verificação
```

## Comportamento

- **Desktop, a partir de 1024px:** sete divisões diagonais contíguas, recortadas com `clip-path: polygon(...)`, cobrem a tela. A geometria permanece fixa no hover; a imagem selecionada ganha foco e zoom sutil, enquanto seis camadas de escurecimento chegam a opacidade 0,8. A transição usa transform e opacity em 450ms.
- **Abertura:** a foto usa `layoutId` compartilhado para expandir até o fundo da página. A interface flutua sobre vidro com blur de 24px, saturação de 180%, bordas e sombras internas.
- **Áudio:** o clique inicia Howler com fade-in de 1,5s até volume 0,10 (10%). Retorno inicia fade-out de 650ms e descarrega o som. Há pausa, mute, equalizador e ajuste de volume no desktop, limitado a 30%. Abrir um link direto prepara o áudio, mas aguarda Play para tocar.
- **Mobile e tablet:** carrossel nativo com scroll-snap, gestos touch, indicadores e botões. O conteúdo interno vira uma coluna em telas pequenas. `100dvh` acomoda as barras dos navegadores móveis.
- **Detalhes:** estreia, integrantes, saudação conhecida do grupo, biografia editorial, três marcos, três álbuns com links ao Spotify, galeria ampliável, curiosidades, fandom e paleta contextualizada.
- **Quiz:** três perguntas de afinidade, com feedback imediato e um integrante como resultado. É uma brincadeira editorial, sem avaliação psicológica. É possível reiniciar.
- **Coleção:** favoritos, progresso de exploração e preferência de áudio persistem no navegador. Funciona também com armazenamento indisponível, mantendo o estado durante a sessão.
- **Acessibilidade:** HTML semântico, nomes de controles, indicadores `aria-pressed`, foco visível, setas entre faixas, Enter para abrir, Escape para voltar, foco restaurado e modal com contenção de Tab. Respeita `prefers-reduced-motion`.

## Sete identidades visuais

A entrada não usa mais verde como cor geral. Cada grupo tem uma página editorial própria, além dos dados específicos:

| Grupo      | Direção de arte                                                           |
| ---------- | ------------------------------------------------------------------------- |
| BTS        | Papel lilás, tipografia serifada e fotografias como polaroids.            |
| Blackpink  | Editorial de moda em preto/rosa, títulos fortes e quadros retos.          |
| TWICE      | Pêssego e rosa, colagens, recortes arredondados e elementos de papelaria. |
| Red Velvet | Vinho e creme, retrato em arco e tipografia clássica.                     |
| MAMAMOO    | Tons de papel e oliva, fotografia analógica e estética de disco.          |
| (G)I-DLE   | Pôster gráfico em violeta/vermelho, cantos retos e blocos contrastantes.  |
| Stray Kids | Carvão/vermelho, tipografia industrial e recortes diagonais.              |

São paletas editoriais, não uma declaração de cores oficiais. As páginas têm quatro fotografias reais próprias, além das duas imagens de atmosfera, distribuídas no hero, nas colagens, no arquivo lateral, no ensaio e na galeria. Há também três músicas para começar a ouvir cada grupo, com links de busca ao Spotify.

## Mídia e dados

As fotografias dos artistas são reais, obtidas no Wikimedia Commons e distribuídas localmente em WebP para evitar hotlinks frágeis. Os créditos completos estão em [CREDITS.md](./CREDITS.md), no modal “Sobre” e nos links de atribuição de cada grupo. A galeria usa também fotografias reais de shows do **Unsplash**, claramente identificadas como imagens de atmosfera. As URLs originais estão em `groupsData.gallery[].source`.

As músicas ativas são os sete arquivos MP3 fornecidos pelo usuário: **Dynamite — BTS; Shut Down — Blackpink; FANCY — TWICE; Feel My Rhythm — Red Velvet; HIP — MAMAMOO; Queencard — (G)I-DLE; MANIAC — Stray Kids**. As cópias locais estão em `public/audio/` e o mapeamento está em `src/data/audio-tracks.ts`. O volume inicial é 10%, com fade-in de 1,5s e fade-out de 650ms. O controle permite ajustar até 30%. Os instrumentais WAV da demonstração anterior permanecem como exemplos; o script `media:prepare` não altera os MP3.

As artes dos álbuns são composições tipográficas ilustrativas e estão identificadas como editoriais. Os nomes e anos correspondem a lançamentos reais. As páginas oficiais de referência estão em `officialUrl`. O conteúdo é uma seleção histórica, sem prometer acompanhamento de notícias. (G)I-DLE preserva o nome solicitado; a mudança para **i-dle** em 2025 está explicada na página.

As saudações conhecidas são apresentadas como saudações; não inventamos lemas oficiais. As cores distinguem anúncios oficiais de paletas afetivas ou associadas à identidade visual.

## Referências técnicas

- [Codrops — ExpandingGridItemAnimation](https://github.com/codrops/ExpandingGridItemAnimation): inspiração conceitual para expansão do fundo de uma faixa e revelação do conteúdo; implementação original em React, sem copiar o demo.
- [Motion, anteriormente framer/motion](https://github.com/motiondivision/motion) e [layout animations](https://motion.dev/docs/react-layout-animations): biblioteca utilizada para FLIP, elementos compartilhados, transições de página e presença.
- [Howler.js](https://github.com/goldfire/howler.js): dependência usada diretamente para reprodução, fades, volume, mute e descarte.
- O endereço fornecido `https://github.com/codrops/DiagonalLayout` retornou **404** na consulta de 01/11/2026. A geometria foi implementada conforme a especificação: skew de 12 graus com compensação inversa.
- O endereço fornecido `https://github.com/hype4academy/glassmorphism-generator` também retornou **404**. O efeito de vidro foi implementado com as propriedades CSS solicitadas, incluindo fallback para navegadores sem `backdrop-filter`.

## Performance

Animações de layout usam projeção por `transform` do Motion; estados contínuos do equalizador usam CSS com isolamento de pintura. Imagens WebP locais, galeria com carregamento adiado, chunks separados para áudio e animação e ausência de handlers de scroll a cada frame. Nenhum loop de animação usa `setState` por frame. Os filtros das faixas são rasterizados ao mudar de estado, enquanto a opacidade é interpolada; o vidro é ativado após a expansão do fundo. A tela inicial desaparece quando está coberta. Movimento reduzido desliga as animações contínuas.

**60fps é a meta de engenharia**, não uma garantia em todo dispositivo. A taxa real depende de GPU, resolução, navegador e custo do backdrop-filter. As capturas e a amostragem de frames da máquina de teste ficam em `artifacts/`.

O Chromium headless desta máquina usa SwiftShader e informa `gpu_compositing: disabled_software`. As amostras estáveis chegaram a aproximadamente 16,7ms por frame, mas transições ainda apresentaram frames mais longos nesse renderizador. Valide a fluidez no dispositivo final com aceleração por hardware ativa.

As fontes DM Sans e Barlow Condensed são carregadas pelo Google Fonts, com fallback local para sans-serif se a conexão estiver indisponível. Fotos e áudio já estão incluídos e não precisam de internet para carregar.

## Verificar

```sh
npx playwright install chromium
npm run build
npm test
```

Os testes rodam sobre o build de produção, com Chromium em desktop e emulação touch de iPhone. Cobrem os sete grupos, mídia, fade/pausa/mute/descarte, troca rápida de grupos, quiz, persistência da coleção, galeria, histórico, link direto, erro de áudio, teclado, movimento reduzido e auditoria Axe WCAG A/AA. `npx playwright show-report` abre o relatório.

Para regenerar a mídia local a partir dos originais incluídos:

```sh
node scripts/prepare-media.mjs
```

O download das fotos é opcional (`node scripts/fetch-assets.mjs`). Ele consulta as imagens que estiverem nos artigos no momento da execução e atualiza também os créditos; revise o resultado antes de substituir os arquivos publicados.
