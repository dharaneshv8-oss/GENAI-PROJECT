import { Story, Character } from '../types';

const STORIES_KEY = 'ai_story_creator_stories_v1';
const CHARACTERS_KEY = 'ai_story_creator_characters_v1';

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_sample_1',
    title: 'The Cartographer of Whispering Pines',
    genre: 'Fantasy',
    summary: 'In an ancient forest where the trees move to conceal forgotten shrines, an old mapmaker and an ambitious young apprentice discover a living compass pointing toward the realm of starlight.',
    beginning: 'The ink in Master Jonathan’s quill never froze, even when the biting frost painted ferns across the observatory windowpane. For forty winters, he had charted the shifting border of the Whispering Pines—a coniferous labyrinth notorious for rearranging its ridges while travelers slept. Beside him, young Lyra carefully balanced a vial of bioluminescent lichen oil, watching the brass dials of their brass drafting table tick with quiet clockwork rhythm.\n\n"The forest breathed three leagues north last night," Jonathan murmured, his calloused thumb tracing a contour line that hadn’t existed on yesterday’s parchment. "And look at the cardinal ring. It refuses to settle."',
    middle: 'Braving the twilight canopy, the pair followed the tremor of the compass deep into the hollow vales where the needles underfoot glowed faintly amber. Giant hemlocks parted before them not by wind, but by deliberate, ancient deference. It was there, suspended inside the ribcage of a fossilized sky-whale overgrown with silver moss, that they found it: the Starlight Loom. A spindle of pure lunar filament spun in silence, spooling the invisible threads that governed the geography of the mortal world.\n\nYet the loom was fraying. A shadow—cold and hungry for stillness—was clipping the strands, threatening to freeze the forest forever into a silent, lifeless tomb.',
    ending: 'Lyra did not reach for a blade, but for Jonathan’s enchanted compass. Kneeling before the spindle, she unclasped the casing, allowing the captured celestial magnetic needle to meld with the loom’s core. The forest exhaled. A wave of violet warmth rippled through the timber, dissolving the icy blight and weaving the night sky directly into the highest branches. Jonathan smiled, closing his empty sketchbook: for the first time in his life, he understood that some wonders are not meant to be mapped, but simply lived.',
    moralOrTheme: 'True wisdom is not in confining the world to parchment, but in keeping the wonder alive.',
    keyCharacters: ['Master Jonathan (Elderly Cartographer)', 'Lyra (Fearless Apprentice)'],
    illustrationPrompt: 'A breathtaking fantasy scene: an ancient observatory cabin tucked into a misty glowing violet forest. A young female cartographer and an elderly scholar inspect a glowing starlight loom with floating celestial threads, digital painting in Studio Ghibli meets Rembrandt style.',
    isAiRendered: false,
    illustrationConcept: {
      artDirection: 'Atmospheric fantasy landscape with chiaroscuro lighting',
      focalPoint: 'Glowing starlight loom surrounded by floating brass instruments and ancient pine roots',
      lighting: 'Ethereal cyan and violet luminescence contrasted by warm amber lantern glow',
      palette: ['#0f0b24', '#7c3aed', '#38bdf8', '#fbbf24', '#f43f5e'],
      mood: 'Enchanting, mystical, awe-inspiring',
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    wordCount: 420,
    readingTimeMinutes: 2,
    lengthSetting: 'Medium',
    style: 'Epic & Mythological',
    language: 'English',
    originalPrompt: 'An old cartographer and his apprentice who chart an enchanted forest that rearranges itself every night.',
    continuations: [],
    isFavorite: true,
  },
  {
    id: 'story_sample_2',
    title: 'The Solitary Frequency of Station 9',
    genre: 'Science Fiction',
    summary: 'A deep-space communications officer orbiting Saturn receives an anomalous transmission: the heartbeat of an ancient orbital leviathan singing in mathematical harmonies.',
    beginning: 'Orbiting Saturn’s moon Enceladus, Communication Outpost 9 was three hundred million kilometers from the nearest hot cup of coffee. Senior Technician Silas enjoyed the solitude. His days consisted of calibration pings, cataloging telemetry from sub-surface geysers, and keeping his small hydro-garden of mint and basil alive under hydroponic purple lamps.\n\nThen at 03:14 standard time, the deep-band audio receiver began humming a chord Silas had only ever heard in orchestral recordings of Bach.',
    middle: 'The audio stream didn’t originate from any vessel on the solar registry. It pulsed from within the icy fissures of Enceladus itself. Decoded, the wavelength matched the rhythmic diastolic expansion of an enormous biological organ. When Silas patched the audio into the external resonance speakers to dampen feedback, the moon’s ice crust began to phosphoresce in direct response. An ancient, dormant entity the size of a continent was stirring beneath the frozen ocean, waking to the realization that someone above was listening.',
    ending: 'Command protocol dictated Silas seal the outpost and initiate an emergency orbital burn back to Titan. Instead, Silas took off his headset, pulled his dusty acoustic guitar from beneath his bunk, and held it to the transmitter microphone. He struck a gentle G-major chord into the vacuum. Seconds later, through three kilometers of pure ice, the creature returned the harmony in a warm, low harmonic that vibrated Silas’s very marrow. In the cold infinity of space, humanity was no longer alone.',
    moralOrTheme: 'Empathy and music bridge chasms deeper than light-years.',
    keyCharacters: ['Silas (Solitary Deep-Space Communications Specialist)'],
    illustrationPrompt: 'Futuristic observation deck overlooking the illuminated ring system of Saturn and the glowing ice fissures of Enceladus. A lone astronaut sitting near green hydroponic plants with an acoustic guitar, cinematic sci-fi art.',
    isAiRendered: false,
    illustrationConcept: {
      artDirection: 'Moody high-contrast hard science fiction with cosmic scale',
      focalPoint: 'Astronaut silhouette at observation bay looking down at glowing bioluminescent ice moon',
      lighting: 'Saturnian ring light reflecting cold silver against warm orange cockpit gauges',
      palette: ['#030712', '#0284c7', '#38bdf8', '#f97316', '#e0e7ff'],
      mood: 'Poignant, majestic, contemplative',
    },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    wordCount: 395,
    readingTimeMinutes: 2,
    lengthSetting: 'Short',
    style: 'Poetic & Lyrical',
    language: 'English',
    originalPrompt: 'A lone space station technician orbiting Saturn hears music coming from the ice.',
    continuations: [],
    isFavorite: false,
  }
];

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char_sample_1',
    name: 'Kaelen Vance',
    title: 'The Reluctant Time-Weaver',
    tagline: 'Fixes temporal fractures with antique clock gears and bad jokes.',
    appearance: 'Tall with messy silver-streaked dark hair, soot-stained velvet coat, and brass monocle that ticks counter-clockwise.',
    personalityTraits: ['Dryly witty', 'Perceptively empathetic', 'Chronic procrastinator', 'Fiercely protective of history'],
    background: 'Exiled from the Imperial Chronometer Guild after refusing to erase a famine from the archives because "grief is part of the tapestry."',
    motivation: 'To find the Lost Second that was stolen during his sister’s wedding.',
    secretOrFlaw: 'Every time he reverses five minutes of history, he permanently loses one fond personal memory.',
    signatureQuote: '"Time isn’t a river, my friend. It’s a runaway wagon, and I’ve only got one brake."',
    genre: 'Fantasy',
  },
  {
    id: 'char_sample_2',
    name: 'Dr. Zephyrine Chen',
    title: 'Deep-Ocean Astrobiologist',
    tagline: 'Listens to the songs of hydrothermal abyssal beasts.',
    appearance: 'Compact, sharp-eyed with cybernetic acoustic ear implants that glow bioluminescent cyan, wearing insulated deep-sea pressure overalls.',
    personalityTraits: ['Fearless investigator', 'Intensely observant', 'Distrustful of surface politics', 'Patient as stone'],
    background: 'Spent eight years in the Mariana Abyss discovering methane-consuming coral that exhibits hive-mind intelligence.',
    motivation: 'To deliver first contact before mining conglomerates poison the trench.',
    secretOrFlaw: 'Suffers from severe agoraphobia—she feels exposed and vulnerable whenever she can see an open sky without a ceiling.',
    signatureQuote: '"The dark isn’t empty. It’s merely waiting for you to stop shouting."',
    genre: 'Science Fiction',
  }
];

export function loadStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    if (!raw) {
      saveStories(INITIAL_STORIES);
      return INITIAL_STORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STORIES;
  } catch (e) {
    console.error('Failed to load stories from localStorage', e);
    return INITIAL_STORIES;
  }
}

export function saveStories(stories: Story[]): void {
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  } catch (e) {
    console.error('Failed to save stories to localStorage', e);
  }
}

export function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(CHARACTERS_KEY);
    if (!raw) {
      saveCharacters(INITIAL_CHARACTERS);
      return INITIAL_CHARACTERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CHARACTERS;
  } catch (e) {
    console.error('Failed to load characters from localStorage', e);
    return INITIAL_CHARACTERS;
  }
}

export function saveCharacters(characters: Character[]): void {
  try {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
  } catch (e) {
    console.error('Failed to save characters to localStorage', e);
  }
}
