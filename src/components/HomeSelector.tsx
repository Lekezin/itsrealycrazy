import type { CSSProperties, RefObject } from 'react';
import { motion } from 'motion/react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from '@phosphor-icons/react';
import { groupsData } from '../data/groups';
import type { Group } from '../data/groups';

type Props = {
  hovered: string | null;
  setHovered: (id: string | null) => void;
  visited: string[];
  cardsRef: RefObject<(HTMLButtonElement | null)[]>;
  carouselRef: RefObject<HTMLDivElement | null>;
  mobileIndex: number;
  scrollCard: (index: number) => void;
  openGroup: (group: Group) => void;
};

export function HomeSelector({
  hovered,
  setHovered,
  visited,
  cardsRef,
  carouselRef,
  mobileIndex,
  scrollCard,
  openGroup,
}: Props) {
  return (
    <main className="home-main">
      <div className="home-intro">
        <span className="intro-eyebrow">SETE UNIVERSOS. ENCONTRE O SEU.</span>
        <h1>
          Escolha seu <span>K-Pop Journey!</span>
        </h1>
        <p>
          <span className="desktop-prompt">Passe o mouse. Siga a sua vibe.</span>
          <span className="touch-prompt">Deslize. Encontre o seu universo.</span>
        </p>
      </div>
      <div
        className={`slanted-stage ${hovered ? 'has-focus' : ''}`}
        ref={carouselRef}
        aria-label="Escolha um dos sete grupos de K-pop"
        onMouseLeave={() => setHovered(null)}
      >
        {groupsData.map((group, index) => (
          <button
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
            data-index={index}
            key={group.id}
            className={`group-strip ${hovered === group.id ? 'is-focused' : ''} ${hovered && hovered !== group.id ? 'is-dimmed' : ''}`}
            style={
              {
                '--slice-index': index,
                '--slice-count': groupsData.length,
                '--strip-accent': group.accent,
                '--strip-tint': group.tint,
              } as CSSProperties
            }
            onMouseEnter={() => {
              if (matchMedia('(hover: hover) and (min-width: 1024px)').matches)
                setHovered(group.id);
            }}
            onFocus={() => {
              if (matchMedia('(min-width: 1024px)').matches) setHovered(group.id);
            }}
            onBlur={() => setHovered(null)}
            onClick={() => openGroup(group)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              const next =
                (index + (event.key === 'ArrowRight' ? 1 : groupsData.length - 1)) %
                groupsData.length;
              cardsRef.current[next]?.focus();
              scrollCard(next);
            }}
            aria-label={`Explorar ${group.name}, fandom ${group.fandom}`}
          >
            <motion.div className="strip-photo" layoutId={`journey-photo-${group.id}`}>
              <img
                src={group.image}
                alt={`Integrantes de ${group.name}`}
                style={{ objectPosition: group.position }}
                fetchPriority={index < 3 ? 'high' : 'auto'}
              />
            </motion.div>
            <div className="strip-gradient" />
            <div className="slice-dimmer" />
            <div className="strip-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {visited.includes(group.id) && <CheckIcon size={13} />}
            </div>
            <div className="strip-copy">
              <span className="strip-korean" lang="ko">
                {group.korean}
              </span>
              <h2>{group.name}</h2>
              <div className="strip-meta">
                <span>{group.fandom}</span>
              </div>
              <span className="strip-explore">
                Descobrir <ArrowUpRightIcon size={16} />
              </span>
            </div>
            <span className="strip-arrow">
              <ArrowUpRightIcon size={21} />
            </span>
          </button>
        ))}
      </div>
      <div className="mobile-carousel-controls">
        <button
          className="icon-button"
          aria-label="Grupo anterior"
          disabled={mobileIndex === 0}
          onClick={() => scrollCard(mobileIndex - 1)}
        >
          <ArrowLeftIcon />
        </button>
        <div>
          {groupsData.map((group, index) => (
            <button
              key={group.id}
              className={index === mobileIndex ? 'active' : ''}
              onClick={() => scrollCard(index)}
              aria-label={`Ir para ${group.name}`}
              aria-current={index === mobileIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <button
          className="icon-button"
          aria-label="Próximo grupo"
          disabled={mobileIndex === groupsData.length - 1}
          onClick={() => scrollCard(mobileIndex + 1)}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </main>
  );
}
