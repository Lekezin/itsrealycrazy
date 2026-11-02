import { useEffect, useRef, useState, useCallback } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookmarkSimpleIcon,
  CheckIcon,
  CheckCircleIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  MusicNotesIcon,
  SparkleIcon,
  UsersThreeIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { Group } from '../data/groups';
import type { AmbientAudio } from '../hooks/useAmbientAudio';
import { AudioPlayer } from './AudioPlayer';
import { Quiz } from './Quiz';
import { Modal } from './Modal';

type DetailProps = {
  group: Group;
  audio: AmbientAudio;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
  onNext: () => void;
};

function albumInk(hex: string) {
  const value = hex.replace('#', '');
  const brightness =
    parseInt(value.slice(0, 2), 16) * 0.299 +
    parseInt(value.slice(2, 4), 16) * 0.587 +
    parseInt(value.slice(4, 6), 16) * 0.114;
  return brightness > 135 ? '#201b22' : '#fff7fc';
}

export function GroupDetail({ group, audio, saved, onSave, onClose, onNext }: DetailProps) {
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [settled, setSettled] = useState(Boolean(reduced));
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const design = group.design;

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        setSettled(true);
        titleRef.current?.focus({ preventScroll: true });
      },
      reduced ? 0 : 650,
    );
    return () => clearTimeout(timer);
  }, [group.id, reduced]);

  const navigateSection = (id: string) => {
    setActiveTab(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <motion.div
      className={`detail-page ${settled ? 'is-settled' : ''}`}
      data-theme={group.id}
      data-surface={design.light ? 'light' : 'dark'}
      ref={scrollRef}
      style={
        {
          '--group-accent': design.accent,
          '--group-tint': group.tint,
          '--page-bg': design.background,
          '--ink': design.ink,
          '--button-ink': design.buttonInk,
        } as CSSProperties
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.35 }}
    >
      <div className="detail-background">
        <motion.div
          className="detail-backdrop"
          layoutId={`journey-photo-${group.id}`}
          transition={{ duration: reduced ? 0 : 0.65, ease: [0.25, 1, 0.5, 1] }}
        >
          <img src={group.image} alt="" style={{ objectPosition: group.position }} />
        </motion.div>
      </div>
      <div className="detail-shade" />
      <header className="detail-topbar">
        <button className="back-button glass" onClick={onClose}>
          <ArrowLeftIcon size={17} />
          <span>Todos os universos</span>
        </button>
        <span className="detail-wordmark">
          K<span>/</span>JOURNEY
        </span>
        <AudioPlayer audio={audio} group={group} />
      </header>
      <main className="detail-content">
        <section className="group-hero" id="overview" aria-labelledby="group-title">
          <motion.div
            className="group-intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.2 }}
          >
            <span className="world-edition">K-JOURNEY PRESENTS / {design.name}</span>
            <div className="group-meta">
              <span className="status-badge">
                <i /> CONHEÇA SEU UNIVERSO
              </span>
              <span>{group.label}</span>
            </div>
            <div className="group-name-row">
              <h1 id="group-title" ref={titleRef} tabIndex={-1}>
                {group.name}
              </h1>
              <span lang="ko">{group.korean}</span>
            </div>
            <h2>{group.tagline}</h2>
            <p className="world-note">{design.eyebrow}</p>
            <p className="group-bio">{group.bio}</p>
            <div className="hero-actions">
              <button
                className={`primary-button ${saved ? 'is-saved' : ''}`}
                onClick={onSave}
                aria-pressed={saved}
              >
                <BookmarkSimpleIcon size={18} weight={saved ? 'fill' : 'regular'} />
                {saved ? 'Na minha coleção' : 'Salvar na coleção'}
                {saved && <CheckIcon size={15} />}
              </button>
              <button
                className="share-button glass"
                onClick={share}
                aria-label="Copiar link deste grupo"
              >
                {copied ? <CheckIcon size={19} /> : <LinkIcon size={19} />}
              </button>
              <span className="share-feedback" role="status">
                {copied ? 'Link copiado!' : copyError ? 'Copie o endereço no navegador.' : ''}
              </span>
            </div>
            <div className="debut-line">
              <span>
                <MusicNotesIcon size={16} /> DEBUT
              </span>
              <strong>{group.debut}</strong>
            </div>
          </motion.div>
          <motion.div
            className="group-visual"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.3 }}
          >
            <span className="hero-artword" aria-hidden="true">
              {group.fandom}
            </span>
            <div className="artist-frame glass">
              <img
                src={group.image}
                alt={`${group.name}, fotografia do grupo`}
                fetchPriority="high"
              />
              <div className="artist-caption">
                <span>
                  <MapPinIcon size={14} /> SEUL, COREIA DO SUL
                </span>
                <span>
                  <UsersThreeIcon size={15} /> {group.members.length} integrantes
                </span>
              </div>
            </div>
            {group.gallery[1] && (
              <button
                className="hero-secondary photo-print"
                onClick={() => setLightbox(1)}
                aria-label={`Ampliar retrato: ${group.gallery[1].title}`}
              >
                <img src={group.gallery[1].src} alt={group.gallery[1].alt} />
                <span>{group.name} / THE ARCHIVE</span>
              </button>
            )}
            {group.gallery[2] && (
              <button
                className="hero-tertiary photo-print"
                onClick={() => setLightbox(2)}
                aria-label={`Ampliar retrato: ${group.gallery[2].title}`}
              >
                <img src={group.gallery[2].src} alt={group.gallery[2].alt} />
                <span>STAY IN THE MOMENT</span>
              </button>
            )}
            <span className="hero-stamp" aria-hidden="true">
              {group.year}
              <br />
              <small>{group.fandom}</small>
            </span>
            <div className="floating-greeting glass">
              <span>UM JEITO DE DIZER OLÁ</span>
              <p>{group.greeting}</p>
              <SparkleIcon size={23} />
            </div>
            <span className="photo-index">{design.name} / VOL. 01</span>
          </motion.div>
        </section>

        <div className="members-bar glass">
          <span>AS VOZES DESTE UNIVERSO</span>
          <div>
            {group.members.map((member) => (
              <span className="member-chip" key={member}>
                {member}
              </span>
            ))}
          </div>
        </div>

        <nav className="detail-tabs" aria-label="Seções do grupo">
          {[
            ['overview', 'Visão geral'],
            ['history', 'História & marcos'],
            ['discography', 'Discografia'],
            ['gallery', 'Galeria'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => navigateSection(id)}
              className={activeTab === id ? 'active' : ''}
              aria-current={activeTab === id ? 'location' : undefined}
            >
              {label}
              {activeTab === id && <motion.span layoutId="detail-tab-indicator" />}
            </button>
          ))}
          <span className="tabs-aside">
            <HeartIcon size={14} /> FEITO PARA {group.fandom.toUpperCase()}
          </span>
        </nav>

        <section className="world-opening" aria-label={`O universo de ${group.name}`}>
          <span className="section-label">BEM-VINDO AO SEU PRÓXIMO CAPÍTULO</span>
          <h2>{design.note}</h2>
          <p>{design.invitation}</p>
          <span className="opening-symbol" aria-hidden="true">
            {group.id === 'stray-kids' ? '//' : group.id === 'blackpink' ? 'BP' : '*'}
          </span>
        </section>

        <div className="detail-grid">
          <div className="story-column">
            <section className="history-section" id="history" aria-labelledby="history-title">
              <div className="section-label">
                <span>01 / HISTÓRIA & MARCOS</span>
                <span>EST. {group.year}</span>
              </div>
              <h2 id="history-title">Cada era, um novo capítulo.</h2>
              <div className="timeline">
                {group.milestones.map((milestone) => (
                  <article className="timeline-item" key={milestone.year}>
                    <span className="timeline-year">{milestone.year}</span>
                    <div>
                      <h3>{milestone.title}</h3>
                      <p>{milestone.description}</p>
                    </div>
                    <ArrowUpRightIcon size={17} aria-hidden="true" />
                  </article>
                ))}
              </div>
            </section>
            <section
              className="discography-section"
              id="discography"
              aria-labelledby="discography-title"
            >
              <div className="section-label">
                <span>02 / PARA DAR O PRIMEIRO PLAY</span>
                <MusicNotesIcon size={16} />
              </div>
              <h2 id="discography-title">Uma porta de entrada.</h2>
              <div className="album-grid">
                {group.albums.map((album, index) => (
                  <a
                    className="album"
                    key={album.name}
                    href={`https://open.spotify.com/search/${encodeURIComponent(`${group.name} ${album.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Buscar ${album.name} no Spotify (nova aba)`}
                  >
                    <div
                      className={`album-cover album-style-${index}`}
                      style={
                        {
                          '--album-color': album.color,
                          '--album-ink': albumInk(album.color),
                        } as CSSProperties
                      }
                    >
                      <span className="album-group">{group.name.toUpperCase()}</span>
                      <strong>{album.mark}</strong>
                      <span className="album-bottom">
                        {album.year}
                        <ArrowUpRightIcon size={18} />
                      </span>
                    </div>
                    <h3>{album.name}</h3>
                    <p>
                      {album.year} <span>·</span> {album.type}
                    </p>
                  </a>
                ))}
              </div>
              <p className="editorial-note">
                Artes editoriais ilustrativas. Abra um álbum para encontrar as faixas no Spotify.
              </p>
            </section>
            <section className="listening-section" aria-labelledby="listening-title">
              <div className="section-label">
                <span>APERTE O PLAY. ENCONTRE A SUA.</span>
                <MusicNotesIcon size={18} />
              </div>
              <h2 id="listening-title">Sua primeira playlist.</h2>
              <div className="song-list">
                {design.songs.map((song, index) => (
                  <a
                    key={song.name}
                    href={`https://open.spotify.com/search/${encodeURIComponent(`${group.name} ${song.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="song-index">0{index + 1}</span>
                    <div>
                      <h3>{song.name}</h3>
                      <p>{song.feeling}</p>
                    </div>
                    <ArrowUpRightIcon size={22} />
                  </a>
                ))}
              </div>
            </section>
          </div>
          <aside className="discovery-column">
            <Quiz key={group.id} group={group} />
            <section className="fandom-card glass" aria-labelledby="fandom-title">
              <div className="card-eyebrow">
                <span>
                  <HeartIcon size={16} /> VOCÊ PERTENCE AQUI
                </span>
              </div>
              <h3 id="fandom-title">Olá, {group.fandom}.</h3>
              <p>Mais do que ouvir. É fazer parte.</p>
              <div className="fandom-colors">
                {group.colors.map((color) => (
                  <span key={color.name}>
                    <i style={{ background: color.hex }} />
                    {color.name}
                  </span>
                ))}
              </div>
              <small>{group.colorNote}</small>
            </section>
            {group.gallery[2] && (
              <figure className="aside-photo">
                <button onClick={() => setLightbox(2)} aria-label="Ampliar foto do arquivo">
                  <img src={group.gallery[2].src} alt={group.gallery[2].alt} loading="lazy" />
                </button>
                <figcaption>
                  MEMÓRIAS EM OUTRA FREQUÊNCIA <span>{group.korean}</span>
                </figcaption>
              </figure>
            )}
          </aside>
        </div>

        <section className="photo-essay">
          <button
            className="essay-image"
            onClick={() => setLightbox(1)}
            aria-label="Ampliar imagem em destaque"
          >
            <img
              src={group.gallery[1]?.src ?? group.image}
              alt={group.gallery[1]?.alt ?? group.name}
              loading="lazy"
            />
          </button>
          <div>
            <span className="section-label">AQUI É O SEU LUGAR</span>
            <h2>
              {group.fandom}.<br />
              Uma conexão
              <br />
              que fica.
            </h2>
            <p>{design.invitation}</p>
            <span className="essay-signature">
              {group.name} / {group.korean}
            </span>
          </div>
        </section>

        <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="section-label">
            <span>03 / UM UNIVERSO EM IMAGENS</span>
            <div className="gallery-controls">
              <button
                className="icon-button glass"
                aria-label="Fotos anteriores"
                onClick={() =>
                  galleryRef.current?.scrollBy({
                    left: -400,
                    behavior: reduced ? 'instant' : 'smooth',
                  })
                }
              >
                <ArrowLeftIcon size={17} />
              </button>
              <button
                className="icon-button glass"
                aria-label="Próximas fotos"
                onClick={() =>
                  galleryRef.current?.scrollBy({
                    left: 400,
                    behavior: reduced ? 'instant' : 'smooth',
                  })
                }
              >
                <ArrowRightIcon size={17} />
              </button>
            </div>
          </div>
          <h2 id="gallery-title">Para guardar na memória.</h2>
          <div className="gallery-track" ref={galleryRef}>
            {group.gallery.map((photo, index) => (
              <button
                className="gallery-photo"
                key={photo.src}
                onClick={() => setLightbox(index)}
                aria-label={`Ampliar foto: ${photo.title}`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <span>
                  <span>
                    <small>
                      {photo.kind === 'atmosphere'
                        ? 'ATMOSFERA · UNSPLASH'
                        : 'O ARQUIVO · ' + group.name.toUpperCase()}
                    </small>
                    {photo.title}
                  </span>
                  <ArrowUpRightIcon size={22} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="facts-section glass">
          <div>
            <span className="section-label">MAIS PERTO DO SEU FANDOM</span>
            <h2>Sabia dessa?</h2>
          </div>
          <ul>
            {group.facts.map((fact) => (
              <li key={fact}>
                <CheckCircleIcon size={17} />
                <p>{fact}</p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="detail-footer">
          <div>
            <span className="detail-wordmark">
              K<span>/</span>JOURNEY
            </span>
            <p>Cada descoberta é só o começo.</p>
          </div>
          <div className="detail-sources">
            <a href={group.officialUrl} target="_blank" rel="noreferrer">
              Site oficial <ArrowUpRightIcon size={14} />
            </a>
            <a href={group.imageCredit} target="_blank" rel="noreferrer">
              Foto: {group.imageAuthor} <ArrowUpRightIcon size={14} />
            </a>
            <a href={group.imageLicenseUrl || group.imageCredit} target="_blank" rel="noreferrer">
              {group.imageLicense} · recorte e cor adaptados <ArrowUpRightIcon size={14} />
            </a>
          </div>
          <button className="next-universe" onClick={onNext}>
            Próximo universo <ArrowRightIcon size={20} />
          </button>
        </footer>
      </main>

      <AnimatePresence>
        {lightbox !== null && (
          <Modal title={group.gallery[lightbox].title} onClose={closeLightbox} className="lightbox">
            <img src={group.gallery[lightbox].src} alt={group.gallery[lightbox].alt} />
            <div className="lightbox-bottom">
              <div className="lightbox-credit">
                <a href={group.gallery[lightbox].source} target="_blank" rel="noreferrer">
                  Fonte e atribuição <ArrowUpRightIcon size={14} />
                </a>
                <small>
                  {group.gallery[lightbox].author}
                  {group.gallery[lightbox].license ? ` · ${group.gallery[lightbox].license}` : ''}
                </small>
              </div>
              <div>
                <button
                  className="icon-button"
                  aria-label="Foto anterior"
                  onClick={() =>
                    setLightbox((lightbox + group.gallery.length - 1) % group.gallery.length)
                  }
                >
                  <ArrowLeftIcon />
                </button>
                <span>
                  {lightbox + 1} / {group.gallery.length}
                </span>
                <button
                  className="icon-button"
                  aria-label="Próxima foto"
                  onClick={() => setLightbox((lightbox + 1) % group.gallery.length)}
                >
                  <ArrowRightIcon />
                </button>
                <button className="icon-button" aria-label="Fechar foto" onClick={closeLightbox}>
                  <XIcon />
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
