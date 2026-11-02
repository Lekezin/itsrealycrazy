# Verificação da revisão visual

Verificado em 01/11/2026.

- Build de produção e TypeScript aprovados.
- 39 cenários validados, com três verificações exclusivas de uma das plataformas ignoradas. A bateria funcional foi executada e as auditorias de temas foram reexecutadas após as correções de contraste.
- Todos os sete grupos abrem com fotografia, conteúdo, três álbuns, três músicas e áudio.
- As divisões permanecem fixas no hover; seis vizinhas recebem camada de escurecimento de opacidade 0,8.
- Sete paletas de fundo diferentes e composições específicas por artista.
- Axe WCAG 2 A/AA e WCAG 2.1 AA: nenhuma violação automatizada nas sete páginas, em desktop e mobile, na auditoria final. Isso não substitui uma avaliação manual com tecnologias assistivas.
- Quatorze verificações adicionais de largura: sete grupos em 320×568 e 768×1024, sem transbordamento horizontal nem erros de JavaScript. Revisão visual também em 390×844 e 1440×1000.
- 28 fotografias reais dos artistas com créditos e licenças, quatro por grupo, além das imagens de atmosfera.
- Áudio verificado com fade, pausa, mute, volume, troca e descarte ao voltar.
- Quiz, favoritos persistentes, galeria ampliável, histórico, links diretos e carrossel touch verificados.

As capturas da revisão e a matriz de responsividade estão em artifacts/v2/. Os testes usam Chromium desktop e emulação touch; Safari e aparelhos iOS/Android físicos não foram executados.

## Atualização das músicas

- Sete MP3s enviados pelo usuário copiados e comparados com os originais por SHA-256.
- Correspondência de artista e música, formato MP3 e duração de áudio válida verificados nos sete grupos.
- Volume inicial de 10%, controle limitado a 30%, fade-in de 1,5s e fade-out de 650ms.
- 24 testes de mídia e controles aprovados em desktop e emulação mobile: reprodução, pausa, mute, volume, troca, links diretos, preferência de som e erro de carregamento.
