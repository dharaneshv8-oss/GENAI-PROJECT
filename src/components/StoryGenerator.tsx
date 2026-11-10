import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Dice5,
  SlidersHorizontal,
  Users,
  Globe,
  Feather,
  Clock,
  Loader2,
  AlertCircle,
  Plus,
  X,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Story, Character } from '../types';
import { GENRES, WRITING_STYLES, LANGUAGES } from '../data/genres';
import { StoryReader } from './StoryReader';

interface StoryGeneratorProps {
  initialGenre?: string;
  initialPrompt?: string;
  savedCharacters: Character[];
  onSaveStory: (story: Story) => void;
  isStorySaved: (storyId: string) => boolean;
  onContinueInWeaver: (story: Story) => void;
}

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({
  initialGenre = 'Fantasy',
  initialPrompt = '',
  savedCharacters,
  onSaveStory,
  isStorySaved,
  onContinueInWeaver,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [length, setLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [style, setStyle] = useState('Epic & Mythological');
  const [language, setLanguage] = useState('English');
  const [characters, setCharacters] = useState<string[]>([]);
  const [newCharInput, setNewCharInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);

  const loadingPhrases = [
    'Summoning starlight and ancient ink...',
    'Introducing heroes and establishing the world...',
    'Weaving tension and mounting conflicts...',
    'Sculpting the climactic resolution...',
    'Illustrating the scene concept...',
  ];

  const handleAddCharacter = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !characters.includes(trimmed)) {
      setCharacters([...characters, trimmed]);
      setNewCharInput('');
    }
  };

  const handleRemoveCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const handleSurprisePrompt = () => {
    const currentGenreObj = GENRES.find((g) => g.id === selectedGenre) || GENRES[0];
    const randomPrompt =
      currentGenreObj.prompts[Math.floor(Math.random() * currentGenreObj.prompts.length)];
    setPrompt(randomPrompt);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setError('Please provide a story idea or spark of imagination.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingPhrases.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          genre: selectedGenre,
          length,
          characters,
          language,
          style,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to craft story. Please try again.');
      }

      const newStory: Story = {
        ...data,
        originalPrompt: prompt,
        continuations: [],
      };

      setGeneratedStory(newStory);
      // Auto-save generated story to user's collection
      onSaveStory(newStory);

      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#8b5cf6', '#38bdf8', '#fbbf24', '#f43f5e'],
      });
    } catch (err: any) {
      console.error('Story generation failed:', err);
      setError(err.message || 'An unexpected error occurred while writing your story.');
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Creation Form Card */}
      <div className="rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#150d30] via-[#100924] to-[#0a0618] p-6 sm:p-8 shadow-xl shadow-purple-950/40 relative">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Wand2 className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-purple-100">
                AI Story Studio
              </h2>
              <p className="text-xs sm:text-sm text-purple-300/70">
                Craft complete three-act narratives powered by Google Gemini AI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSurprisePrompt}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
            title="Roll a random story idea"
          >
            <Dice5 className="w-4 h-4 text-amber-300" />
            <span>Random Idea</span>
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Genre Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Select Story Genre
              </label>
              <span className="text-[11px] text-purple-400/80">8 specialized genres</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {GENRES.map((g) => {
                const isSelected = selectedGenre === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGenre(g.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-600/25 border-purple-400 shadow-md shadow-purple-600/20 text-white'
                        : 'bg-purple-950/30 border-purple-500/15 hover:border-purple-500/35 text-purple-200/80 hover:bg-purple-950/50'
                    }`}
                  >
                    <span className="text-xs font-semibold block leading-tight">{g.name}</span>
                    <span className="text-[10px] text-purple-400/70 mt-1 line-clamp-1">
                      {g.tagline.split(',')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Story Prompt Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                Your Story Idea or Spark
              </label>
              <button
                type="button"
                onClick={handleSurprisePrompt}
                className="text-xs text-amber-300/90 hover:text-amber-200 flex items-center gap-1 cursor-pointer sm:hidden"
              >
                <Dice5 className="w-3.5 h-3.5" /> Random Idea
              </button>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A solitary clockmaker in a rain-soaked metropolis discovers that one of his mechanical birds has begun recording conversations from the future..."
              className="w-full rounded-2xl bg-black/40 border border-purple-500/25 p-4 text-sm text-purple-100 placeholder:text-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all font-sans"
            />

            {/* Quick Inspiration chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-purple-400/70 mr-1">Inspirations:</span>
              {(GENRES.find((g) => g.id === selectedGenre) || GENRES[0]).prompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/20 text-[11px] text-purple-300/80 hover:text-purple-100 transition-all text-left truncate max-w-xs cursor-pointer"
                  title={p}
                >
                  "{p.slice(0, 45)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Story Customization Controls */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                Story Customization
              </span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
              >
                {showAdvanced ? 'Hide Options' : 'More Options'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Length */}
              <div>
                <label className="text-[11px] text-purple-300/80 block mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" /> Story Length
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-purple-500/20 text-xs">
                  {(['Short', 'Medium', 'Long'] as const).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setLength(len)}
                      className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                        length === len
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-purple-300/70 hover:text-purple-200'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>

              {/* Writing Style */}
              <div>
                <label className="text-[11px] text-purple-300/80 block mb-1.5 flex items-center gap-1">
                  <Feather className="w-3 h-3 text-purple-400" /> Writing Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  {WRITING_STYLES.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#120a28] text-purple-200">
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="text-[11px] text-purple-300/80 block mb-1.5 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-purple-400" /> Story Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#120a28] text-purple-200">
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Character Names & Tags */}
            <div className="pt-2 border-t border-purple-500/15">
              <label className="text-[11px] text-purple-300/80 block mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" /> Character Names & Key Figures
              </label>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                {characters.map((char, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-purple-600/25 border border-purple-500/35 text-purple-200"
                  >
                    <span>{char}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacter(idx)}
                      className="text-purple-400 hover:text-purple-200 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newCharInput}
                    onChange={(e) => setNewCharInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCharacter(newCharInput);
                      }
                    }}
                    placeholder="Add character (e.g. Silas or Lyra the Cartographer)"
                    className="bg-black/30 border border-purple-500/20 rounded-xl px-2.5 py-1 text-xs text-purple-200 placeholder:text-purple-400/40 focus:outline-none focus:border-purple-400 w-56"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCharacter(newCharInput)}
                    className="p-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick load from saved characters */}
              {savedCharacters.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-purple-400/60">From Character Forge:</span>
                  {savedCharacters.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleAddCharacter(`${sc.name} (${sc.title})`)}
                      className="px-2 py-0.5 rounded-md bg-purple-950/80 hover:bg-purple-900 border border-purple-500/20 text-purple-300 hover:text-purple-100 transition-colors cursor-pointer"
                    >
                      + {sc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to Generate Story</p>
                <p className="mt-0.5 text-rose-300/90">{error}</p>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-purple-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Weaving Narrative with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Complete Story</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Loading Overlay / Animation */}
        {isGenerating && (
          <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-purple-500/30 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 animate-pulse">
              <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
            </div>
            <p className="text-sm font-medium text-purple-200">
              {loadingPhrases[loadingStep]}
            </p>
            <div className="w-48 h-1.5 bg-purple-950 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / loadingPhrases.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Generated Story Display */}
      {generatedStory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Freshly Penned Tale
            </span>
          </div>

          <StoryReader
            story={generatedStory}
            isSaved={isStorySaved(generatedStory.id)}
            onToggleSave={onSaveStory}
            onContinueInWeaver={onContinueInWeaver}
            onUpdateStory={(updated) => setGeneratedStory(updated)}
          />
        </div>
      )}
    </div>
  );
};
