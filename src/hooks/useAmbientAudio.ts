import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import type { Group } from '../data/groups';
import { AMBIENT_VOLUME, MAX_AMBIENT_VOLUME } from '../data/audio-tracks';

export function useAmbientAudio() {
  const soundRef = useRef<Howl | null>(null);
  const playingId = useRef<number | null>(null);
  const retiring = useRef(new Set<Howl>());
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(AMBIENT_VOLUME);
  const volumeRef = useRef(AMBIENT_VOLUME);
  const mutedRef = useRef(false);

  const stop = useCallback(() => {
    const sound = soundRef.current;
    const id = playingId.current;
    soundRef.current = null;
    playingId.current = null;
    setPlaying(false);
    setLoading(false);
    if (!sound) return;
    if (!sound.playing()) {
      sound.unload();
      return;
    }
    // Muting can cancel a Howler fade and leave the group volume stale.
    // Read the actual playing instance, and never start a zero-to-zero fade.
    const instanceVolume = id !== null ? sound.volume(id) : sound.volume();
    const currentVolume = typeof instanceVolume === 'number' ? instanceVolume : 0;
    if (currentVolume <= 0) {
      sound.unload();
      return;
    }
    if (id !== null) sound.volume(currentVolume, id);
    else sound.volume(currentVolume);
    retiring.current.add(sound);
    sound.once(
      'fade',
      () => {
        sound.stop();
        sound.unload();
        retiring.current.delete(sound);
      },
      id ?? undefined,
    );
    sound.fade(currentVolume, 0, 650, id ?? undefined);
  }, []);

  const start = useCallback(
    (group: Group, enabled: boolean, autoplay = true) => {
      stop();
      setError(false);
      setLoading(true);
      const sound = new Howl({
        src: [group.audio.src],
        format: [group.audio.format],
        loop: true,
        volume: 0,
        mute: !enabled,
        onplay: (id) => {
          if (soundRef.current !== sound) return;
          playingId.current = id;
          setLoading(false);
          setPlaying(true);
          setError(false);
          sound.fade(0, volumeRef.current, 1500);
        },
        onpause: () => {
          if (soundRef.current === sound) setPlaying(false);
        },
        onload: () => {
          if (soundRef.current === sound) setLoading(false);
        },
        onloaderror: () => {
          if (soundRef.current === sound) {
            setError(true);
            setLoading(false);
            setPlaying(false);
          }
        },
        onplayerror: () => {
          if (soundRef.current !== sound) return;
          setError(true);
          setLoading(false);
          setPlaying(false);
          sound.once('unlock', () => {
            if (soundRef.current === sound) sound.play();
          });
        },
      });
      soundRef.current = sound;
      setMuted(!enabled);
      mutedRef.current = !enabled;
      if (autoplay) sound.play(); // Direct group clicks retain user activation.
    },
    [stop],
  );

  const togglePlaying = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;
    if (sound.playing()) sound.pause();
    else {
      setError(false);
      sound.play();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    soundRef.current?.mute(next);
    setMuted(next);
  }, []);

  const changeVolume = useCallback((next: number) => {
    const value = Math.min(MAX_AMBIENT_VOLUME, Math.max(0, next));
    volumeRef.current = value;
    setVolume(value);
    soundRef.current?.volume(value);
  }, []);

  useEffect(
    () => () => {
      soundRef.current?.unload();
      retiring.current.forEach((sound) => sound.unload());
      retiring.current.clear();
    },
    [],
  );

  return {
    playing,
    muted,
    loading,
    error,
    volume,
    start,
    stop,
    togglePlaying,
    toggleMute,
    changeVolume,
  };
}

export type AmbientAudio = ReturnType<typeof useAmbientAudio>;
