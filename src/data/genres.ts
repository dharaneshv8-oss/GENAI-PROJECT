import { GenreDefinition } from '../types';

export const GENRES: GenreDefinition[] = [
  {
    id: 'Fantasy',
    name: 'Fantasy',
    icon: 'Wand2',
    tagline: 'Ancient spells, mythical beasts & enchanted realms',
    description: 'Immerse readers in worlds of forgotten magic, sentient relics, and breathtaking kingdoms.',
    cardGradient: 'from-purple-900/40 via-indigo-900/30 to-violet-950/50',
    borderGlow: 'hover:border-purple-500/50 hover:shadow-purple-500/20',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    prompts: [
      'A clockwork dragon that feeds on forgotten childhood memories awakens in an underground library.',
      'An apprentice herbalist discovers a seed that sprouts miniature floating islands.',
      'A silent guild of mapmakers whose drawn borders physically reshape the continent overnight.'
    ]
  },
  {
    id: 'Science Fiction',
    name: 'Science Fiction',
    icon: 'Rocket',
    tagline: 'Deep space anomalies, cyber cities & AI consciousness',
    description: 'Explore the fringes of known science, neon colonies, quantum gateways, and the cosmic unknown.',
    cardGradient: 'from-cyan-950/40 via-blue-900/30 to-indigo-950/50',
    borderGlow: 'hover:border-cyan-500/50 hover:shadow-cyan-500/20',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    prompts: [
      'A lone solar lighthouse keeper detects a transmission composed entirely of classical cello frequencies from an uncharted nebula.',
      'An abandoned atmospheric terrarium drifting near Saturn begins developing its own sentient ecosystem.',
      'A detective in a city of uploaded minds is hired to investigate the theft of a real human tear.'
    ]
  },
  {
    id: 'Horror',
    name: 'Horror',
    icon: 'Ghost',
    tagline: 'Spine-chilling dread, uncanny whispers & haunted shadows',
    description: 'Build quiet psychological suspense, eldritch mysteries, and midnight encounters with the unseen.',
    cardGradient: 'from-red-950/40 via-stone-900/30 to-purple-950/50',
    borderGlow: 'hover:border-rose-500/50 hover:shadow-rose-500/20',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    prompts: [
      'An antique grandfather clock delivered to a remote lighthouse only ticks when someone is in the room with it.',
      'A night train passenger discovers the reflection in the window is three seconds ahead of reality.',
      'An underwater research station receives a knock on the viewing glass at 8,000 meters deep.'
    ]
  },
  {
    id: 'Mystery',
    name: 'Mystery',
    icon: 'Search',
    tagline: 'Intricate clues, locked rooms & masked motives',
    description: 'Unravel baffling enigmas, hidden wills, coded cipher journals, and clever deductions.',
    cardGradient: 'from-amber-950/30 via-slate-900/40 to-indigo-950/50',
    borderGlow: 'hover:border-amber-500/50 hover:shadow-amber-500/20',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    prompts: [
      'During a blackout at the Grand Astronomical Observatory, a priceless meteorite disappears without tripping laser sensors.',
      'A retired archivist receives a handwritten letter postmarked 40 years into the future with yesterday’s handwriting.',
      'A chess grandmaster collapses during a tournament; the winning move left on the board is a coded distress coordinates.'
    ]
  },
  {
    id: 'Adventure',
    name: 'Adventure',
    icon: 'Compass',
    tagline: 'Expeditions into the wild, lost temples & daring quests',
    description: 'Heart-pounding treks across stormy straits, forgotten ravines, sunken galleons, and mountain peaks.',
    cardGradient: 'from-emerald-950/40 via-teal-900/30 to-indigo-950/50',
    borderGlow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    prompts: [
      'Two cartographers race against a monsoon to reach a sunken temple that surfaces once every fifty years.',
      'A hot-air balloon expedition is swept off course into a canyon shrouded in perennial luminous fog.',
      'Searching for a fabled underground river beneath the dunes of an ancient salt desert.'
    ]
  },
  {
    id: 'Comedy',
    name: 'Comedy',
    icon: 'Laugh',
    tagline: 'Witty banter, absurd mishaps & lighthearted chaos',
    description: 'Spill tea, trigger outrageous chain reactions, and spark laughter with delightfully quirky dilemmas.',
    cardGradient: 'from-yellow-950/30 via-orange-950/30 to-purple-950/40',
    borderGlow: 'hover:border-yellow-500/50 hover:shadow-yellow-500/20',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    prompts: [
      'A medieval potion brewer accidentally invents modern sparkling soda and panics as the royal court thinks it is sorcery.',
      'An alien ambassador visits Earth but mistakenly assumes the household golden retriever is the supreme planet ruler.',
      'Two rival pastry chefs attempt to bake the tallest wedding cake in history, sparking a kitchen arms race.'
    ]
  },
  {
    id: 'Romance-free friendship stories',
    name: 'Romance-free friendship stories',
    icon: 'Users',
    tagline: 'Unbreakable camaraderie, mutual trust & lifelong bonds',
    description: 'Celebrate wholesome bonds of loyalty, shared dreams, witty partnership, and standing by each other through storm and calm.',
    cardGradient: 'from-sky-950/40 via-indigo-900/30 to-purple-950/50',
    borderGlow: 'hover:border-sky-500/50 hover:shadow-sky-500/20',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    prompts: [
      'Two childhood friends who grew up in different rival neighborhoods open a small neighborhood bookshop together.',
      'An experienced retired blacksmith and an energetic young apprentice team up to build an impossible glider for the solstice festival.',
      'Three mismatched crew members on a space cargo tugboat rally together to save their cranky rescue cat from a station quarantine.'
    ]
  },
  {
    id: 'Inspirational',
    name: 'Inspirational',
    icon: 'Sparkles',
    tagline: 'Overcoming adversity, inner strength & renewed hope',
    description: 'Uplifting chronicles of resilient spirits, second chances, quiet courage, and touching triumphs.',
    cardGradient: 'from-amber-950/40 via-fuchsia-950/30 to-violet-950/50',
    borderGlow: 'hover:border-amber-400/50 hover:shadow-amber-400/20',
    badgeBg: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
    prompts: [
      'A retired violinist who lost hearing in one ear teaches a timid street youth how to play music through the vibrations in wood.',
      'A solitary gardener transforms a neglected rooftop concrete slab into an oasis of rare blooming night flowers for a children’s hospital.',
      'An elderly marathon runner attempts one final summit climb to honor a promise made to their late sibling.'
    ]
  }
];

export const WRITING_STYLES = [
  { id: 'Epic & Mythological', label: 'Epic & Mythological', desc: 'Grand scale, legendary prose, majestic descriptions' },
  { id: 'Whimsical & Fairy-tale', label: 'Whimsical & Fairy-tale', desc: 'Playful wonder, enchanted touches, gentle lyricism' },
  { id: 'Dark & Suspenseful', label: 'Dark & Suspenseful', desc: 'Nerve-tightening tension, atmospheric shadows, foreboding' },
  { id: 'Humorous & Witty', label: 'Humorous & Witty', desc: 'Sharp dialogue, playful irony, spirited comedic timing' },
  { id: 'Poetic & Lyrical', label: 'Poetic & Lyrical', desc: 'Sensory metaphors, rhythmic cadences, emotive beauty' },
  { id: 'Fast-paced & Action-packed', label: 'Fast-paced & Action-packed', desc: 'Urgent stakes, kinetic movement, sharp beats' },
  { id: 'Realistic & Grounded', label: 'Realistic & Grounded', desc: 'Subtle psychology, authentic detail, human resonance' }
];

export const LANGUAGES = [
  { code: 'English', label: 'English 🇬🇧' },
  { code: 'Spanish', label: 'Español 🇪🇸' },
  { code: 'French', label: 'Français 🇫🇷' },
  { code: 'German', label: 'Deutsch 🇩🇪' },
  { code: 'Italian', label: 'Italiano 🇮🇹' },
  { code: 'Portuguese', label: 'Português 🇵🇹' },
  { code: 'Japanese', label: '日本語 🇯🇵' },
  { code: 'Hindi', label: 'हिन्दी 🇮🇳' },
  { code: 'Chinese (Simplified)', label: '中文 (简体) 🇨🇳' },
  { code: 'Korean', label: '한국어 🇰🇷' },
  { code: 'Arabic', label: 'العربية 🇸🇦' }
];

export const CHARACTER_ARCHETYPES = [
  'Reluctant Hero with a Secret Past',
  'Eccentric Scholar / Inventor',
  'Cunning Rogue with a Moral Code',
  'Fiercely Loyal Best Friend',
  'Mysterious Wanderer / Guide',
  'Idealistic Rookie Dreamer',
  'Grumpy Veteran with a Golden Heart',
  'Sentient Robot or Magical Creature'
];

export const CONTINUATION_DIRECTIONS = [
  { id: 'twist', label: '💥 Unexpected Plot Twist', desc: 'Shatter expectations with a revelatory secret or betrayal' },
  { id: 'escalate', label: '⚡ Escalate Danger & Stakes', desc: 'Raise the immediate peril to fever pitch' },
  { id: 'mystery', label: '🔍 Deepen the Mystery', desc: 'Uncover an ancient cipher, cryptic relic, or suspicious clue' },
  { id: 'triumph', label: '✨ Heroic Stand & Breakthrough', desc: 'The protagonists rally courage and turn the tide' },
  { id: 'camaraderie', label: '🤝 Moment of Deep Camaraderie', desc: 'An intimate, heartfelt exchange that strengthens bonds' },
  { id: 'comedy', label: '🎭 Comedic Mishap / Absurd Detour', desc: 'An unforeseen blunder shifts the mood delightfully' }
];
