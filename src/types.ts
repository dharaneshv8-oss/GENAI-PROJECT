export interface StoryContinuation {
  id: string;
  chapterTitle: string;
  continuationText: string;
  cliffhangerOrHook: string;
  newDevelopments?: string[];
  timestamp: string;
  wordCount: number;
}

export interface IllustrationConcept {
  artDirection: string;
  focalPoint: string;
  lighting: string;
  palette: string[];
  mood: string;
}

export interface Story {
  id: string;
  title: string;
  genre: string;
  summary: string;
  beginning: string;
  middle: string;
  ending: string;
  moralOrTheme: string;
  keyCharacters?: string[];
  illustrationPrompt: string;
  illustrationUrl?: string | null;
  illustrationConcept?: IllustrationConcept | null;
  isAiRendered?: boolean;
  createdAt: string;
  wordCount: number;
  readingTimeMinutes: number;
  lengthSetting: 'Short' | 'Medium' | 'Long';
  style: string;
  language: string;
  originalPrompt?: string;
  continuations?: StoryContinuation[];
  isFavorite?: boolean;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  tagline: string;
  appearance: string;
  personalityTraits: string[];
  background: string;
  motivation: string;
  secretOrFlaw: string;
  signatureQuote?: string;
  genre?: string;
  createdAt?: string;
}

export interface GenreDefinition {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  cardGradient: string;
  borderGlow: string;
  badgeBg: string;
  prompts: string[];
}
