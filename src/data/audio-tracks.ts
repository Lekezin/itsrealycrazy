export type AudioTrack = {
  src: string;
  title: string;
  format: 'mp3' | 'wav';
  credit: string;
};

// Music files supplied by the user, matched to the corresponding artist.
export const audioTracks: Record<string, AudioTrack> = {
  bts: {
    src: '/audio/bts-dynamite.mp3',
    title: 'Dynamite',
    format: 'mp3',
    credit: 'BTS · arquivo fornecido pelo usuário',
  },
  blackpink: {
    src: '/audio/blackpink-shut-down.mp3',
    title: 'Shut Down',
    format: 'mp3',
    credit: 'BLACKPINK · arquivo fornecido pelo usuário',
  },
  twice: {
    src: '/audio/twice-fancy.mp3',
    title: 'FANCY',
    format: 'mp3',
    credit: 'TWICE · arquivo fornecido pelo usuário',
  },
  'red-velvet': {
    src: '/audio/red-velvet-feel-my-rhythm.mp3',
    title: 'Feel My Rhythm',
    format: 'mp3',
    credit: 'Red Velvet · arquivo fornecido pelo usuário',
  },
  mamamoo: {
    src: '/audio/mamamoo-hip.mp3',
    title: 'HIP',
    format: 'mp3',
    credit: 'MAMAMOO · arquivo fornecido pelo usuário',
  },
  gidle: {
    src: '/audio/gidle-queencard.mp3',
    title: 'Queencard',
    format: 'mp3',
    credit: '(G)I-DLE · arquivo fornecido pelo usuário',
  },
  'stray-kids': {
    src: '/audio/stray-kids-maniac.mp3',
    title: 'MANIAC',
    format: 'mp3',
    credit: 'Stray Kids · arquivo fornecido pelo usuário',
  },
};

export const AMBIENT_VOLUME = 0.1;
export const MAX_AMBIENT_VOLUME = 0.3;
