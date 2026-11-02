import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, useReducedMotion } from 'motion/react';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookmarkSimpleIcon,
  GlobeHemisphereWestIcon,
  InfoIcon,
  SparkleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { groupsData } from './data/groups';
import type { Group } from './data/groups';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { usePersistedState } from './hooks/usePersistedState';
import { GroupDetail } from './components/GroupDetail';
import { HomeSelector } from './components/HomeSelector';
import { SoundPreference } from './components/AudioPlayer';
import { Modal } from './components/Modal';

function routeGroup() {
  return groupsData.find((group) => window.location.hash === `#/group/${group.id}`) ?? null;
}

export function App() {
  const [selected, setSelected] = useState<Group | null>(routeGroup);
  const [hovered, setHovered] = useState<string | null>(null);
  const [modal, setModal] = useState<'collection' | 'about' | null>(null);
  const [saved, setSaved] = usePersistedState<string[]>('kjourney:saved', []);
  const [visited, setVisited] = usePersistedState<string[]>('kjourney:visited', []);
  const [soundEnabled, setSoundEnabled] = usePersistedState('kjourney:sound', true);
  const [mobileIndex, setMobileIndex] = useState(0);
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastGroupRef = useRef<string | null>(null);
  const audio = useAmbientAudio();
  const reduced = useReducedMotion();
  const closeModal = useCallback(() => setModal(null), []);

  const markVisited = useCallback(
    (id: string) => setVisited((old) => (old.includes(id) ? old : [...old, id])),
    [setVisited],
  );
  const openGroup = useCallback(
    (group: Group) => {
      audio.start(group, soundEnabled);
      setSelected(group);
      setModal(null);
      setHovered(null);
      markVisited(group.id);
      lastGroupRef.current = group.id;
      history.pushState(null, '', `#/group/${group.id}`);
    },
    [audio.start, soundEnabled, markVisited],
  );

  const closeGroup = useCallback(() => {
    audio.stop();
    setSelected(null);
    setHovered(null);
    history.pushState(null, '', window.location.pathname + window.location.search);
    window.setTimeout(
      () =>
        cardsRef.current[groupsData.findIndex((group) => group.id === lastGroupRef.current)]?.focus(
          { preventScroll: true },
        ),
      reduced ? 0 : 500,
    );
  }, [audio.stop, reduced]);

  useEffect(() => {
    const initial = routeGroup();
    if (initial) {
      audio.start(initial, soundEnabled, false);
      markVisited(initial.id);
      lastGroupRef.current = initial.id;
    }
    const onRoute = () => {
      const group = routeGroup();
      audio.stop();
      setSelected(group);
      setModal(null);
      if (group) {
        audio.start(group, soundEnabled, false);
        markVisited(group.id);
        lastGroupRef.current = group.id;
      }
    };
    window.addEventListener('popstate', onRoute);
    return () => window.removeEventListener('popstate', onRoute);
    // Initial route setup and browser history navigation, never auto-play on page load.
  }, [audio.start, audio.stop, markVisited, soundEnabled]);

  useEffect(() => {
    document.title = selected
      ? `${selected.name} — K-Journey`
      : 'K-Journey — Escolha seu K-Pop Journey!';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selected && !modal) closeGroup();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, modal, closeGroup]);

  useEffect(() => {
    const viewport = carouselRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setMobileIndex(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { root: viewport, threshold: 0.6 },
    );
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, []);

  const toggleSave = (id: string) =>
    setSaved((old) => (old.includes(id) ? old.filter((item) => item !== id) : [...old, id]));
  const scrollCard = (index: number) => {
    if (matchMedia('(min-width: 1024px)').matches) return;
    const next = Math.min(groupsData.length - 1, Math.max(0, index));
    cardsRef.current[next]?.scrollIntoView({
      behavior: reduced ? 'instant' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className={`home-page ${selected ? 'is-covered' : ''}`} inert={selected !== null}>
          <header className="site-header">
            <a className="brand" href="#" aria-label="K-Journey, início">
              <span className="brand-symbol" aria-hidden="true">
                <SparkleIcon size={31} weight="fill" />
              </span>
              <span>
                K<span className="brand-slash">/</span>JOURNEY<small>YOUR NEXT OBSESSION</small>
              </span>
            </a>
            <nav className="header-nav" aria-label="Navegação principal">
              <button
                className={modal !== 'collection' ? 'active' : ''}
                onClick={() => setModal(null)}
              >
                Explorar <span className="nav-dot" />
              </button>
              <button
                className={modal === 'collection' ? 'active' : ''}
                onClick={() => setModal('collection')}
              >
                Minha coleção{' '}
                <span className="nav-count">{saved.length.toString().padStart(2, '0')}</span>
              </button>
            </nav>
            <div className="header-actions">
              <SoundPreference
                enabled={soundEnabled}
                onToggle={() => setSoundEnabled((old) => !old)}
              />
              <button
                className="icon-button about-button"
                onClick={() => setModal('about')}
                aria-label="Sobre o projeto"
              >
                <InfoIcon size={21} />
              </button>
            </div>
          </header>

          <HomeSelector
            hovered={hovered}
            setHovered={setHovered}
            visited={visited}
            cardsRef={cardsRef}
            carouselRef={carouselRef}
            mobileIndex={mobileIndex}
            scrollCard={scrollCard}
            openGroup={openGroup}
          />

          <footer className="home-footer">
            <div className="footer-caption">
              <span className="tiny-orbit" />
              <span>
                A MÚSICA CONECTA.
                <br />
                <strong>O SEU JOURNEY COMEÇA AQUI.</strong>
              </span>
            </div>
            <div className="footer-guide">
              <span className="mouse-outline" aria-hidden="true">
                <i />
              </span>
              <span className="desktop-guide">
                PASSE O MOUSE PARA EXPLORAR <span>·</span> CLIQUE PARA ENTRAR
              </span>
              <span className="mobile-guide">
                DESLIZE PARA EXPLORAR <ArrowRightIcon size={14} />
              </span>
            </div>
            <button onClick={() => setModal('about')} className="footer-credit">
              <GlobeHemisphereWestIcon size={15} /> FEITO DE CONEXÕES <ArrowUpRightIcon size={13} />
            </button>
          </footer>
          <div className="edge-label" aria-hidden="true">
            SEVEN UNIVERSES. YOUR JOURNEY.
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <GroupDetail
              key={selected.id}
              group={selected}
              audio={audio}
              saved={saved.includes(selected.id)}
              onSave={() => toggleSave(selected.id)}
              onClose={closeGroup}
              onNext={() =>
                openGroup(
                  groupsData[
                    (groupsData.findIndex((group) => group.id === selected.id) + 1) %
                      groupsData.length
                  ],
                )
              }
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modal && (
            <Modal
              title={
                modal === 'collection' ? 'Minha coleção' : 'Cada fandom começa com uma conexão.'
              }
              onClose={closeModal}
            >
              {modal === 'collection' ? (
                <>
                  <div className="collection-intro">
                    <span className="status-badge">
                      <i /> SEU CANTINHO NO K-POP
                    </span>
                    <p>
                      {saved.length
                        ? `${saved.length} ${saved.length === 1 ? 'universo salvo' : 'universos salvos'}. Volte sempre que a saudade bater.`
                        : 'Os universos que você salvar vão morar aqui.'}
                    </p>
                  </div>
                  {saved.length ? (
                    <div className="collection-grid">
                      {groupsData
                        .filter((group) => saved.includes(group.id))
                        .map((group) => (
                          <article key={group.id} className="collection-card">
                            <button className="collection-open" onClick={() => openGroup(group)}>
                              <img src={group.image} alt={group.name} />
                              <span>
                                <strong>{group.name}</strong>
                                <small>{group.fandom}</small>
                                <ArrowUpRightIcon />
                              </span>
                            </button>
                            <button
                              className="remove-saved icon-button glass"
                              aria-label={`Remover ${group.name} da coleção`}
                              onClick={() => toggleSave(group.id)}
                            >
                              <XIcon size={15} />
                            </button>
                          </article>
                        ))}
                    </div>
                  ) : (
                    <div className="collection-empty">
                      <BookmarkSimpleIcon size={44} weight="thin" />
                      <h3>Seu próximo favorito está lá fora.</h3>
                      <p>
                        Explore um grupo e toque em “Salvar na coleção” para deixar essa conexão por
                        perto.
                      </p>
                      <button className="primary-button" onClick={closeModal}>
                        Encontrar meu universo <ArrowRightIcon size={18} />
                      </button>
                    </div>
                  )}
                  <div className="collection-progress">
                    <span>
                      {visited.length} de {groupsData.length} universos explorados
                    </span>
                    <div>
                      {groupsData.map((group) => (
                        <i key={group.id} className={visited.includes(group.id) ? 'active' : ''} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="about-content">
                  <p>
                    K-Journey é uma experiência de descoberta feita para quem já tem um fandom e
                    para quem ainda vai encontrar o seu.
                  </p>
                  <div className="about-feature">
                    <SparkleIcon />
                    <p>
                      <strong>Sete universos, seu ritmo.</strong>Explore histórias, descubra
                      afinidades e guarde os grupos que combinam com você.
                    </p>
                  </div>
                  <p>
                    Projeto demonstrativo independente, sem vínculo com os artistas. As trilhas são
                    músicas escolhidas para cada artista, em volume ambiente; as perguntas de
                    afinidade são uma brincadeira. Os marcos são uma seleção histórica, não notícias
                    em tempo real.
                  </p>
                  <h3>Imagens e conteúdo</h3>
                  <p>
                    Fotografias dos artistas: Wikimedia Commons, com autor e licença acessíveis nos
                    links abaixo. As imagens do Unsplash ilustram a atmosfera dos shows.
                  </p>
                  <div className="source-links">
                    {groupsData.map((group) => (
                      <a key={group.id} href={group.imageCredit} target="_blank" rel="noreferrer">
                        {group.name} <ArrowUpRightIcon size={13} />
                      </a>
                    ))}
                    <a href="https://unsplash.com" target="_blank" rel="noreferrer">
                      Unsplash <ArrowUpRightIcon size={13} />
                    </a>
                  </div>
                  <h3>Por trás da experiência</h3>
                  <div className="source-links">
                    <a
                      href="https://github.com/codrops/ExpandingGridItemAnimation"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Codrops <ArrowUpRightIcon size={13} />
                    </a>
                    <a
                      href="https://github.com/motiondivision/motion"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Motion <ArrowUpRightIcon size={13} />
                    </a>
                    <a
                      href="https://github.com/goldfire/howler.js"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Howler.js <ArrowUpRightIcon size={13} />
                    </a>
                  </div>
                  <span className="about-footnote">
                    Feito para sentir a música um pouco mais perto.
                  </span>
                </div>
              )}
            </Modal>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  );
}
