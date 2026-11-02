export type GroupDesign = {
  name: string;
  eyebrow: string;
  note: string;
  invitation: string;
  background: string;
  ink: string;
  accent: string;
  buttonInk: string;
  light: boolean;
  songs: { name: string; feeling: string }[];
};

export const groupDesigns: Record<string, GroupDesign> = {
  bts: {
    name: 'The Purple Archive',
    eyebrow: 'UM LUGAR PARA SER VOCÊ',
    note: 'Algumas músicas viram memória. Outras viram casa.',
    invitation:
      'Entre capítulos sobre juventude, encontros e amor-próprio, sempre cabe mais uma história. Inclusive a sua.',
    background: '#eee9f3',
    ink: '#30243d',
    accent: '#694593',
    buttonInk: '#ffffff',
    light: true,
    songs: [
      { name: 'Spring Day', feeling: 'Para quando a saudade encontra uma melodia.' },
      { name: 'Black Swan', feeling: 'Arte, movimento e um lado mais profundo.' },
      { name: 'Dynamite', feeling: 'Um pouco de brilho para mudar o dia.' },
    ],
  },
  blackpink: {
    name: 'In Your Area',
    eyebrow: 'PRESENÇA. ESTILO. ATITUDE.',
    note: 'Quatro personalidades. Nenhum espaço para passar despercebida.',
    invitation:
      'Um encontro de moda, batidas e personalidade. O seu lugar na primeira fila começa aqui.',
    background: '#100e12',
    ink: '#f8edf2',
    accent: '#ef9dc3',
    buttonInk: '#23141c',
    light: false,
    songs: [
      { name: 'How You Like That', feeling: 'Uma entrada com presença de sobra.' },
      { name: 'Lovesick Girls', feeling: 'Para cantar cada palavra junto.' },
      { name: 'Shut Down', feeling: 'Cordas clássicas, atitude contemporânea.' },
    ],
  },
  twice: {
    name: 'One in a Million',
    eyebrow: 'SEU NOVO HAPPY PLACE',
    note: 'Nove jeitos de fazer um dia comum ficar especial.',
    invitation:
      'Pode chegar com a sua playlist, sua coreografia favorita ou só a vontade de sorrir. Aqui, sentir-se especial faz parte.',
    background: '#fff2eb',
    ink: '#672d37',
    accent: '#b73e58',
    buttonInk: '#ffffff',
    light: true,
    songs: [
      { name: 'Feel Special', feeling: 'Um abraço em forma de refrão.' },
      { name: 'What is Love?', feeling: 'Curiosidade, cinema e um pop irresistível.' },
      { name: 'Fancy', feeling: 'O lado colorido de se apaixonar.' },
    ],
  },
  'red-velvet': {
    name: 'The Velvet Room',
    eyebrow: 'DOIS LADOS. INFINITAS NUANCES.',
    note: 'Um pouco de mistério. Uma dose de imaginação.',
    invitation:
      'Entre a energia Red e a delicadeza Velvet, a graça está em descobrir o que vem depois. Fique mais um pouco.',
    background: '#f5eedf',
    ink: '#502332',
    accent: '#8c2842',
    buttonInk: '#ffffff',
    light: true,
    songs: [
      { name: 'Psycho', feeling: 'Harmonias que encontram beleza no contraste.' },
      { name: 'Red Flavor', feeling: 'O verão mais vibrante do lado Red.' },
      { name: 'Feel My Rhythm', feeling: 'Um encontro entre pop e imaginação clássica.' },
    ],
  },
  mamamoo: {
    name: 'The Soul Sessions',
    eyebrow: 'FEITO DE VOZ. FEITO DE VERDADE.',
    note: 'Tem coisa que só se entende ouvindo ao vivo.',
    invitation:
      'Puxe uma cadeira, sinta os vocais e fique à vontade. Este universo tem calor de palco e liberdade de sobra.',
    background: '#eee7d6',
    ink: '#383323',
    accent: '#77612e',
    buttonInk: '#ffffff',
    light: true,
    songs: [
      { name: 'Décalcomanie', feeling: 'Vocais em camadas, intensidade em cada verso.' },
      { name: 'Starry Night', feeling: 'Uma viagem para ouvir sem pressa.' },
      { name: 'HIP', feeling: 'Para andar no seu próprio ritmo.' },
    ],
  },
  gidle: {
    name: 'Write Your Own Rules',
    eyebrow: 'A IDENTIDADE É DELAS.',
    note: 'Autoria não é detalhe. É o ponto de partida.',
    invitation:
      'Ideias próprias, conceitos que provocam e liberdade para mudar. Aqui, a próxima versão de você é bem-vinda.',
    background: '#1a1521',
    ink: '#f6efff',
    accent: '#d0b6fa',
    buttonInk: '#271a38',
    light: false,
    songs: [
      { name: 'TOMBOY', feeling: 'Guitarras, atitude e nenhum rótulo.' },
      { name: 'Nxde', feeling: 'Um conceito que convida a olhar de novo.' },
      { name: 'Queencard', feeling: 'Confiança para ocupar o próprio espaço.' },
    ],
  },
  'stray-kids': {
    name: 'Make Some Noise',
    eyebrow: 'SEM MOLDE. SEM FREIO.',
    note: 'Oito vozes. Um som que segue as próprias regras.',
    invitation:
      'Batidas que surpreendem, produção autoral e energia para atravessar a tela. STAY, encontre a sua frequência.',
    background: '#171719',
    ink: '#f8f4ed',
    accent: '#ff6669',
    buttonInk: '#201416',
    light: false,
    songs: [
      { name: 'God’s Menu', feeling: 'A assinatura sonora do grupo, sem economizar energia.' },
      { name: 'MANIAC', feeling: 'O diferente encontra o seu lugar.' },
      { name: 'S-Class', feeling: 'Mudanças de ritmo e presença de palco.' },
    ],
  },
};
