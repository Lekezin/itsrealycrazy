import photoCredits from './photo-credits.json';
import journeyPhotos from './journey-photos.json';
import { groupDesigns } from './group-designs';
import type { GroupDesign } from './group-designs';
import { audioTracks } from './audio-tracks';
import type { AudioTrack } from './audio-tracks';

export type QuizOption = { label: string; feedback: string; affinity: number };
export type QuizQuestion = { question: string; options: QuizOption[] };
export type Group = {
  id: string;
  design: GroupDesign;
  name: string;
  korean: string;
  fandom: string;
  debut: string;
  year: string;
  label: string;
  accent: string;
  tint: string;
  position: string;
  image: string;
  imageCredit: string;
  imageAuthor: string;
  imageLicense: string;
  imageLicenseUrl: string;
  photoPage: string;
  officialUrl: string;
  greeting: string;
  tagline: string;
  bio: string;
  members: string[];
  colors: { name: string; hex: string }[];
  colorNote: string;
  facts: string[];
  milestones: { year: string; title: string; description: string }[];
  albums: { name: string; year: string; type: string; color: string; mark: string }[];
  quiz: QuizQuestion[];
  matches: { member: string; trait: string; description: string }[];
  audio: AudioTrack;
  gallery: {
    src: string;
    alt: string;
    title: string;
    source: string;
    author?: string;
    license?: string;
    licenseUrl?: string;
    kind?: string;
  }[];
};

const questions: QuizQuestion[] = [
  {
    question: 'Quando a música começa, você…',
    options: [
      {
        label: 'Sente cada palavra da letra.',
        feedback: 'Você transforma sentimentos em conexão.',
        affinity: 0,
      },
      {
        label: 'Já está no meio da pista.',
        feedback: 'Sua energia faz qualquer lugar virar palco.',
        affinity: 1,
      },
      {
        label: 'Percebe cada detalhe da produção.',
        feedback: 'Seu olhar criativo encontra beleza nos detalhes.',
        affinity: 2,
      },
    ],
  },
  {
    question: 'No seu grupo de amigos, você é…',
    options: [
      {
        label: 'O porto seguro de todo mundo.',
        feedback: 'Acolher as pessoas é seu superpoder.',
        affinity: 0,
      },
      {
        label: 'Quem inventa a próxima aventura.',
        feedback: 'Com você, a rotina nunca dura muito.',
        affinity: 1,
      },
      {
        label: 'Quem enxerga tudo de um jeito diferente.',
        feedback: 'Sua autenticidade inspira quem está perto.',
        affinity: 2,
      },
    ],
  },
  {
    question: 'Sua playlist perfeita tem…',
    options: [
      {
        label: 'Canções para sentir de olhos fechados.',
        feedback: 'Você vive a música de dentro para fora.',
        affinity: 0,
      },
      {
        label: 'Refrões para cantar até perder a voz.',
        feedback: 'Sua trilha sonora pede o volume lá em cima.',
        affinity: 1,
      },
      {
        label: 'Sons que ninguém me mostrou ainda.',
        feedback: 'Descobrir novos universos é a sua vibe.',
        affinity: 2,
      },
    ],
  },
];

const base = (id: string) => {
  const photo = photoCredits.find((item) => item.id === id)!;
  const photos =
    (
      journeyPhotos as Record<
        string,
        {
          src: string;
          source: string;
          author: string;
          license: string;
          licenseUrl: string;
          title: string;
        }[]
      >
    )[id] ?? [];
  const primary = photos[0];
  return {
    id,
    design: groupDesigns[id],
    image: primary?.src ?? `/images/${id}.webp`,
    imageCredit: primary?.source ?? photo?.attribution ?? '',
    imageAuthor: primary?.author ?? photo?.author ?? '',
    imageLicense: primary?.license ?? photo?.license ?? '',
    imageLicenseUrl: primary?.licenseUrl ?? photo?.licenseUrl ?? '',
    photoPage: photo?.page ?? 'https://en.wikipedia.org/wiki/Stray_Kids',
    quiz: questions,
    audio: audioTracks[id],
    gallery: [
      ...photos.map((item, index) => ({
        ...item,
        alt: item.title.replace(/\.(png|jpg)$/i, ''),
        title:
          ['Além do palco', 'Em outra frequência', 'Momentos que ficam', 'Nosso universo'][index] ??
          'No arquivo',
        kind: 'artist',
      })),
      {
        src: '/images/stage.webp',
        alt: 'Público reunido em um festival de música; imagem de atmosfera, não do grupo',
        title: 'Sinta a energia',
        kind: 'atmosphere',
        source:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85',
      },
      {
        src: '/images/crowd.webp',
        alt: 'Público e luzes em um show; imagem de atmosfera, não do grupo',
        title: 'Uma só voz',
        kind: 'atmosphere',
        source:
          'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=85',
      },
    ],
  };
};

// Editorial demo data. Historical highlights; not a real-time artist news feed.
// Unsplash photos illustrate the concert atmosphere, never the artists themselves.
export const groupsData: Group[] = [
  {
    ...base('bts'),
    name: 'BTS',
    korean: '방탄소년단',
    fandom: 'ARMY',
    debut: '13 de junho de 2013',
    year: '2013',
    label: 'BIGHIT MUSIC',
    accent: '#c2afe8',
    tint: '#493d69',
    position: '52% 40%',
    officialUrl: 'https://bts.ibighit.com/eng/profile/',
    greeting: '“Dul, set! Bangtan!”',
    tagline: 'Sete vozes. Um universo inteiro.',
    bio: 'Do hip-hop de Seul a uma linguagem que atravessa fronteiras. RM, Jin, SUGA, j-hope, Jimin, V e Jung Kook fazem da música um lugar para crescer, se reconhecer e encontrar companhia.',
    members: ['RM', 'Jin', 'SUGA', 'j-hope', 'Jimin', 'V', 'Jung Kook'],
    colors: [{ name: 'Roxo do ARMY', hex: '#a693cb' }],
    colorNote:
      'Cor afetiva do fandom, associada à expressão “I purple you”; não apresentada como cor oficial.',
    facts: [
      'ARMY é o nome do fandom desde 2013.',
      'A série Love Yourself explora identidade, crescimento e amor-próprio.',
      'Os integrantes participam da composição e produção de suas músicas.',
    ],
    milestones: [
      {
        year: '2013',
        title: 'O primeiro capítulo',
        description: '2 Cool 4 Skool e “No More Dream” apresentam uma nova voz no hip-hop coreano.',
      },
      {
        year: '2018',
        title: 'Love Yourself',
        description: 'Love Yourself: Tear chega ao topo da Billboard 200.',
      },
      {
        year: '2020',
        title: 'Um brilho chamado Dynamite',
        description: '“Dynamite” estreia no primeiro lugar da Billboard Hot 100.',
      },
    ],
    albums: [
      {
        name: 'Love Yourself: Tear',
        year: '2018',
        type: 'Álbum de estúdio',
        color: '#363740',
        mark: 'LOVE\nYOURSELF',
      },
      {
        name: 'Map of the Soul: 7',
        year: '2020',
        type: 'Álbum de estúdio',
        color: '#637d9c',
        mark: '7',
      },
      { name: 'BE', year: '2020', type: 'Álbum de estúdio', color: '#c4beaf', mark: 'BE' },
    ],
    matches: [
      {
        member: 'RM',
        trait: 'Alma sensível',
        description:
          'Reflexão, empatia e palavras que ficam. Sua forma de sentir tem a energia do RM.',
      },
      {
        member: 'j-hope',
        trait: 'Energia que contagia',
        description: 'Você encontra luz em movimento e leva todo mundo junto, como j-hope.',
      },
      {
        member: 'V',
        trait: 'Olhar de artista',
        description: 'Sua curiosidade e seu jeito singular de ver o mundo lembram V.',
      },
    ],
  },
  {
    ...base('blackpink'),
    name: 'Blackpink',
    korean: '블랙핑크',
    fandom: 'BLINK',
    debut: '8 de agosto de 2016',
    year: '2016',
    label: 'YG ENTERTAINMENT',
    accent: '#f0abc3',
    tint: '#692e4a',
    position: '48% 35%',
    officialUrl: 'https://www.ygfamily.com/en/artists/blackpink/profile',
    greeting: '“BLACKPINK in your area.”',
    tagline: 'Atitude que não cabe em um só palco.',
    bio: 'Jisoo, Jennie, Rosé e Lisa unem personalidades distintas em um pop de presença inconfundível. Batidas intensas, visuais marcantes e refrões que viraram uma linguagem global.',
    members: ['Jisoo', 'Jennie', 'Rosé', 'Lisa'],
    colors: [
      { name: 'Preto', hex: '#242326' },
      { name: 'Rosa', hex: '#f1a6bf' },
    ],
    colorNote: 'Paleta visual associada ao nome e à identidade do grupo.',
    facts: [
      'BLINK une o começo de BLACK e o final de PINK.',
      'Square One reúne os singles de estreia “Whistle” e “Boombayah”.',
      'Em 2023, o grupo foi headliner do festival Coachella.',
    ],
    milestones: [
      {
        year: '2016',
        title: 'In your area',
        description: 'A estreia com Square One apresenta “Whistle” e “Boombayah”.',
      },
      {
        year: '2020',
        title: 'The Album',
        description: 'O primeiro álbum de estúdio reúne “Lovesick Girls” e “How You Like That”.',
      },
      {
        year: '2023',
        title: 'O mundo é o palco',
        description: 'O grupo lidera o Coachella durante a era Born Pink.',
      },
    ],
    albums: [
      { name: 'Square Up', year: '2018', type: 'Miniálbum', color: '#9d6179', mark: 'SQUARE\nUP' },
      {
        name: 'The Album',
        year: '2020',
        type: 'Álbum de estúdio',
        color: '#2b272e',
        mark: 'THE\nALBUM',
      },
      {
        name: 'Born Pink',
        year: '2022',
        type: 'Álbum de estúdio',
        color: '#bd98a5',
        mark: 'BORN\nPINK',
      },
    ],
    matches: [
      {
        member: 'Rosé',
        trait: 'Coração acústico',
        description:
          'Você encontra beleza no que é sincero. Uma conexão que lembra a sensibilidade de Rosé.',
      },
      {
        member: 'Lisa',
        trait: 'Presença magnética',
        description: 'Movimento, ousadia e energia: sua vibe combina com Lisa.',
      },
      {
        member: 'Jennie',
        trait: 'Estilo próprio',
        description: 'Você segue sua intuição e cria tendências sem pedir licença, como Jennie.',
      },
    ],
  },
  {
    ...base('twice'),
    name: 'TWICE',
    korean: '트와이스',
    fandom: 'ONCE',
    debut: '20 de outubro de 2015',
    year: '2015',
    label: 'JYP ENTERTAINMENT',
    accent: '#f6bb98',
    tint: '#775340',
    position: '49% 30%',
    officialUrl: 'https://twice.jype.com/profile',
    greeting: '“One in a million! Hello, we are TWICE!”',
    tagline: 'Seu dia, com nove vezes mais cor.',
    bio: 'Nove personalidades, uma conexão instantânea. TWICE combina melodias luminosas, coreografias memoráveis e um pop que cresceu junto com o ONCE, sem perder a alegria do primeiro encontro.',
    members: [
      'Nayeon',
      'Jeongyeon',
      'Momo',
      'Sana',
      'Jihyo',
      'Mina',
      'Dahyun',
      'Chaeyoung',
      'Tzuyu',
    ],
    colors: [
      { name: 'Apricot', hex: '#fcc89b' },
      { name: 'Neon Magenta', hex: '#ff5fa2' },
    ],
    colorNote: 'Cores oficiais anunciadas para o grupo.',
    facts: [
      'O grupo foi formado no programa Sixteen.',
      'ONCE expressa a ideia de receber amor uma vez e retribuir duas.',
      'As nove integrantes vêm da Coreia do Sul, Japão e Taiwan.',
    ],
    milestones: [
      {
        year: '2015',
        title: 'Like OOH-AHH',
        description: 'The Story Begins abre a história do grupo formado em Sixteen.',
      },
      {
        year: '2016',
        title: 'Cheer Up!',
        description: 'Page Two e “Cheer Up” consolidam o som luminoso do grupo.',
      },
      {
        year: '2021',
        title: 'Novos sabores',
        description: 'Formula of Love expande o universo musical do TWICE.',
      },
    ],
    albums: [
      {
        name: 'Feel Special',
        year: '2019',
        type: 'Miniálbum',
        color: '#b18b53',
        mark: 'FEEL\nSPECIAL',
      },
      {
        name: 'Eyes Wide Open',
        year: '2020',
        type: 'Álbum de estúdio',
        color: '#746156',
        mark: 'EYES\nWIDE OPEN',
      },
      {
        name: 'Formula of Love',
        year: '2021',
        type: 'Álbum de estúdio',
        color: '#b0ad94',
        mark: 'O+T\n=<3',
      },
    ],
    matches: [
      {
        member: 'Mina',
        trait: 'Calma que acolhe',
        description: 'Você tem uma presença tranquila e sensível, com a delicadeza de Mina.',
      },
      {
        member: 'Jihyo',
        trait: 'Coração do palco',
        description: 'Seu entusiasmo aproxima pessoas. Sua energia lembra Jihyo.',
      },
      {
        member: 'Chaeyoung',
        trait: 'Criatividade livre',
        description: 'Você pensa fora do esperado e deixa sua marca, como Chaeyoung.',
      },
    ],
  },
  {
    ...base('red-velvet'),
    name: 'Red Velvet',
    korean: '레드벨벳',
    fandom: 'ReVeluv',
    debut: '1 de agosto de 2014',
    year: '2014',
    label: 'SM ENTERTAINMENT',
    accent: '#f3a596',
    tint: '#733839',
    position: '49% 34%',
    officialUrl: 'https://www.smtown.com',
    greeting: '“Happiness! Hello, we are Red Velvet!”',
    tagline: 'Entre o inesperado e o irresistível.',
    bio: 'O lado Red é vibrante e inventivo. O lado Velvet é suave e sofisticado. Irene, Seulgi, Wendy, Joy e Yeri transitam entre esses dois universos com harmonias ricas e conceitos cheios de imaginação.',
    members: ['Irene', 'Seulgi', 'Wendy', 'Joy', 'Yeri'],
    colors: [{ name: 'Pastel Coral', hex: '#f3a596' }],
    colorNote: 'Cor oficial associada ao grupo e ao ReVeluv.',
    facts: [
      '“Red” e “Velvet” representam duas facetas musicais do grupo.',
      'Yeri passou a integrar o grupo em 2015, na era Ice Cream Cake.',
      'ReVeluv conecta o nome Red Velvet à palavra love.',
    ],
    milestones: [
      {
        year: '2014',
        title: 'Happiness',
        description: 'O primeiro single apresenta o lado colorido e cheio de energia do grupo.',
      },
      {
        year: '2017',
        title: 'Perfect Velvet',
        description: '“Peek-A-Boo” aprofunda o lado elegante e misterioso do quinteto.',
      },
      {
        year: '2019',
        title: 'Uma nova harmonia',
        description:
          '“Psycho”, de The ReVe Festival: Finale, encontra o equilíbrio entre os dois lados.',
      },
    ],
    albums: [
      {
        name: 'The Red',
        year: '2015',
        type: 'Álbum de estúdio',
        color: '#b05242',
        mark: 'THE\nRED',
      },
      {
        name: 'Perfect Velvet',
        year: '2017',
        type: 'Álbum de estúdio',
        color: '#414b48',
        mark: 'PERFECT\nVELVET',
      },
      {
        name: 'Feel My Rhythm',
        year: '2022',
        type: 'Miniálbum',
        color: '#aa9fba',
        mark: 'FEEL MY\nRHYTHM',
      },
    ],
    matches: [
      {
        member: 'Wendy',
        trait: 'Voz do coração',
        description: 'Cuidado e sensibilidade são seu jeito de se conectar, assim como Wendy.',
      },
      {
        member: 'Joy',
        trait: 'Alegria espontânea',
        description: 'Você ilumina as pequenas coisas e compartilha essa leveza, como Joy.',
      },
      {
        member: 'Seulgi',
        trait: 'Arte em movimento',
        description: 'Você une dedicação e criatividade em um estilo que lembra Seulgi.',
      },
    ],
  },
  {
    ...base('mamamoo'),
    name: 'MAMAMOO',
    korean: '마마무',
    fandom: 'MOOMOO',
    debut: '19 de junho de 2014',
    year: '2014',
    label: 'RBW · ESTREIA',
    accent: '#b9d399',
    tint: '#424d39',
    position: '55% 35%',
    officialUrl: 'https://www.rbbridge.com',
    greeting: '“I say MAMA, MAMA, MOO!”',
    tagline: 'Vozes livres. Presença de sobra.',
    bio: 'Solar, Moonbyul, Wheein e Hwasa fazem de cada palco um encontro entre potência vocal e liberdade. Jazz, soul, pop e muita personalidade em um grupo que canta e vive do seu próprio jeito.',
    members: ['Solar', 'Moonbyul', 'Wheein', 'Hwasa'],
    colors: [{ name: 'Verde MOOMOO', hex: '#b9d399' }],
    colorNote:
      'Paleta inspirada no lightstick em forma de rabanete; não apresentada como cor oficial.',
    facts: [
      'O lightstick do fandom tem formato de rabanete.',
      'O grupo estreou com “Mr. Ambiguous”, de influência retrô.',
      'As quatro integrantes também desenvolveram trabalhos solo.',
    ],
    milestones: [
      {
        year: '2014',
        title: 'Hello, MAMAMOO',
        description: '“Mr. Ambiguous” apresenta vocais poderosos e uma identidade retrô.',
      },
      {
        year: '2018',
        title: 'Quatro estações',
        description:
          'O projeto Four Seasons, Four Colors abre espaço para as diferentes cores do quarteto.',
      },
      {
        year: '2019',
        title: 'A própria realidade',
        description: 'Reality in BLACK reúne a força de “HIP” e a identidade livre do grupo.',
      },
    ],
    albums: [
      {
        name: 'Melting',
        year: '2016',
        type: 'Álbum de estúdio',
        color: '#bd985c',
        mark: 'MELT\nING',
      },
      {
        name: 'Reality in BLACK',
        year: '2019',
        type: 'Álbum de estúdio',
        color: '#3a3c47',
        mark: 'REALITY\nin BLACK',
      },
      { name: 'Travel', year: '2020', type: 'Miniálbum', color: '#9a785f', mark: 'TRAVEL' },
    ],
    matches: [
      {
        member: 'Wheein',
        trait: 'Sensibilidade soul',
        description: 'Você encontra conforto na arte e nas conexões sinceras, como Wheein.',
      },
      {
        member: 'Solar',
        trait: 'Potência solar',
        description: 'Seu entusiasmo transforma o ambiente e lembra a energia de Solar.',
      },
      {
        member: 'Hwasa',
        trait: 'Livre por natureza',
        description: 'Você valoriza autenticidade e segue o próprio ritmo, como Hwasa.',
      },
    ],
  },
  {
    ...base('gidle'),
    name: '(G)I-DLE',
    korean: '아이들',
    fandom: 'NEVERLAND',
    debut: '2 de maio de 2018',
    year: '2018',
    label: 'CUBE ENTERTAINMENT',
    accent: '#c3a8d5',
    tint: '#503a66',
    position: '53% 33%',
    officialUrl: 'https://i-dle.cubeent.co.jp/profile/',
    greeting: '“Just me, I-DLE!”',
    tagline: 'A história é delas. As regras também.',
    bio: 'Miyeon, Minnie, Soyeon, Yuqi e Shuhua exploram identidade e liberdade em um pop autoral. Da produção aos conceitos, o grupo transforma ideias próprias em músicas de personalidade forte.',
    members: ['Miyeon', 'Minnie', 'Soyeon', 'Yuqi', 'Shuhua'],
    colors: [
      { name: 'Neon Red', hex: '#e53546' },
      { name: 'Chic Violet', hex: '#784b97' },
    ],
    colorNote:
      'Cores oficiais anunciadas na era (G)I-DLE. O nome i-dle é usado desde 2025; mantivemos o nome da sua referência.',
    facts: [
      'O grupo passou a usar o nome i-dle em 2025.',
      'Soyeon tem participação central na composição e produção do grupo.',
      'NEVERLAND faz referência ao lugar em que a imaginação permanece viva.',
    ],
    milestones: [
      {
        year: '2018',
        title: 'LATATA',
        description: 'O miniálbum I Am apresenta o grupo com “LATATA”.',
      },
      {
        year: '2022',
        title: 'Sem rótulos',
        description: 'I Never Die e “TOMBOY” abrem uma fase de afirmação criativa.',
      },
      {
        year: '2023',
        title: 'I feel',
        description: '“Queencard” explora confiança e a liberdade de ser você.',
      },
    ],
    albums: [
      {
        name: 'I Never Die',
        year: '2022',
        type: 'Álbum de estúdio',
        color: '#a44951',
        mark: 'I NEVER\nDIE',
      },
      { name: 'I love', year: '2022', type: 'Miniálbum', color: '#a38b6d', mark: 'I LOVE' },
      { name: 'I feel', year: '2023', type: 'Miniálbum', color: '#b77b9b', mark: 'I FEEL' },
    ],
    matches: [
      {
        member: 'Miyeon',
        trait: 'Doçura e presença',
        description: 'Seu jeito acolhedor esconde uma força tranquila, como Miyeon.',
      },
      {
        member: 'Yuqi',
        trait: 'Energia sem filtro',
        description: 'Você é espontâneo, intenso e cheio de histórias, assim como Yuqi.',
      },
      {
        member: 'Soyeon',
        trait: 'Mente criadora',
        description: 'Suas ideias pedem espaço para acontecer. Sua vibe lembra Soyeon.',
      },
    ],
  },
  {
    ...base('stray-kids'),
    name: 'Stray Kids',
    korean: '스트레이 키즈',
    fandom: 'STAY',
    debut: '25 de março de 2018',
    year: '2018',
    label: 'JYP ENTERTAINMENT',
    accent: '#ff6669',
    tint: '#67262c',
    position: '51% 35%',
    officialUrl: 'https://straykids.jype.com/profile',
    greeting: '“Step out! We are Stray Kids!”',
    tagline: 'O som é deles. O caminho também.',
    bio: 'Bang Chan, Lee Know, Changbin, Hyunjin, HAN, Felix, Seungmin e I.N misturam hip-hop, eletrônica e mudanças de ritmo em um universo autoral. A energia do palco encontra o trabalho de produção da 3RACHA, formada por Bang Chan, Changbin e HAN.',
    members: ['Bang Chan', 'Lee Know', 'Changbin', 'Hyunjin', 'HAN', 'Felix', 'Seungmin', 'I.N'],
    colors: [
      { name: 'Vermelho', hex: '#d93841' },
      { name: 'Carvão', hex: '#242426' },
    ],
    colorNote:
      'Paleta editorial inspirada na força visual do grupo; não apresentada como cores oficiais do fandom.',
    facts: [
      '3RACHA é formada por Bang Chan, Changbin e HAN.',
      'O fandom se chama STAY.',
      'O showcase de estreia aconteceu em 25 de março de 2018; o EP I am NOT foi lançado no dia seguinte.',
    ],
    milestones: [
      {
        year: '2018',
        title: 'Step out',
        description:
          'I am NOT e “District 9” abrem o caminho do grupo, depois do projeto pré-debut Mixtape.',
      },
      {
        year: '2020',
        title: 'Um menu próprio',
        description: 'GO LIVE apresenta “God’s Menu” e consolida uma assinatura sonora intensa.',
      },
      {
        year: '2023',
        title: 'S-Class',
        description: '5-STAR amplia a escala do grupo com mudanças de ritmo e identidade autoral.',
      },
    ],
    albums: [
      {
        name: 'GO LIVE',
        year: '2020',
        type: 'Álbum de estúdio',
        color: '#8a3038',
        mark: 'GO\nLIVE',
      },
      {
        name: 'NOEASY',
        year: '2021',
        type: 'Álbum de estúdio',
        color: '#303b50',
        mark: 'NO\nEASY',
      },
      {
        name: '5-STAR',
        year: '2023',
        type: 'Álbum de estúdio',
        color: '#9b7551',
        mark: '★★★★★\n5-STAR',
      },
    ],
    matches: [
      {
        member: 'Bang Chan',
        trait: 'Conexão que acolhe',
        description:
          'Você valoriza cuidado, companhia e criatividade compartilhada. Sua afinidade lembra a energia de Bang Chan.',
      },
      {
        member: 'Felix',
        trait: 'Energia magnética',
        description: 'Sua presença aproxima pessoas e dá outra cor ao ambiente, como Felix.',
      },
      {
        member: 'HAN',
        trait: 'Mente em movimento',
        description:
          'Você conecta ideias com liberdade e encontra inspiração em todo lugar, como HAN.',
      },
    ],
  },
];
