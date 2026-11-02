import {
  HeadphonesIcon,
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { motion } from 'motion/react';
import type { AmbientAudio } from '../hooks/useAmbientAudio';
import type { Group } from '../data/groups';
import { MAX_AMBIENT_VOLUME } from '../data/audio-tracks';

export function AudioPlayer({ audio, group }: { audio: AmbientAudio; group: Group }) {
  return (
    <motion.div
      className="audio-player glass"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      aria-label="Player de áudio ambiente"
    >
      <div
        className={`equalizer ${audio.playing && !audio.muted ? 'is-playing' : ''}`}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="audio-track">
        <strong>
          {audio.error
            ? 'Toque para tentar novamente'
            : audio.loading
              ? 'Preparando o ambiente…'
              : `${group.audio.title} · ${group.name}`}
        </strong>
        <span>{audio.error ? 'Não foi possível reproduzir' : 'VOLUME AMBIENTE'}</span>
      </div>
      {audio.error && <WarningCircleIcon size={16} aria-hidden="true" />}
      <button
        className="icon-button"
        onClick={audio.togglePlaying}
        aria-label={audio.playing ? 'Pausar áudio' : 'Reproduzir áudio'}
        title={audio.playing ? 'Pausar' : 'Reproduzir'}
      >
        {audio.playing ? (
          <PauseIcon size={17} weight="fill" />
        ) : (
          <PlayIcon size={17} weight="fill" />
        )}
      </button>
      <div className="volume-control">
        <button
          className="icon-button"
          onClick={audio.toggleMute}
          aria-label={audio.muted ? 'Ativar som' : 'Silenciar áudio'}
          aria-pressed={audio.muted}
        >
          {audio.muted ? <SpeakerSlashIcon size={18} /> : <SpeakerHighIcon size={18} />}
        </button>
        <label className="volume-slider">
          <span className="sr-only">Volume do ambiente</span>
          <input
            type="range"
            min="0"
            max={MAX_AMBIENT_VOLUME}
            step="0.01"
            value={audio.volume}
            onChange={(event) => audio.changeVolume(Number(event.target.value))}
          />
        </label>
      </div>
      <span className="sr-only" role="status">
        {audio.playing ? 'Áudio tocando' : 'Áudio pausado'}
        {audio.muted ? ', som silenciado' : ''}
      </span>
    </motion.div>
  );
}

export function SoundPreference({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      className={`sound-preference ${enabled ? 'enabled' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label="Ativar ou desativar o áudio ao explorar um grupo"
      title="Ativar ou desativar o áudio ao explorar um grupo"
    >
      {enabled ? <HeadphonesIcon size={18} /> : <SpeakerSlashIcon size={18} />}
      <span>{enabled ? 'Som ao entrar' : 'Som desligado'}</span>
      <i aria-hidden="true" />
    </button>
  );
}
