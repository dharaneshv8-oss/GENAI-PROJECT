import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  ShieldAlert,
  Target,
  Quote,
  Feather,
  Plus,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../types';
import { GENRES, CHARACTER_ARCHETYPES } from '../data/genres';

interface CharacterForgeProps {
  characters: Character[];
  onSaveCharacter: (character: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onUseInStory: (character: Character) => void;
}

export const CharacterForge: React.FC<CharacterForgeProps> = ({
  characters,
  onSaveCharacter,
  onDeleteCharacter,
  onUseInStory,
}) => {
  const [selectedGenre, setSelectedGenre] = useState('Fantasy');
  const [selectedArchetype, setSelectedArchetype] = useState(CHARACTER_ARCHETYPES[0]);
  const [customSetting, setCustomSetting] = useState('');
  const [count, setCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/characters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: selectedGenre,
          archetype: selectedArchetype,
          setting: customSetting,
          count,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate characters.');
      }

      if (Array.isArray(data.characters)) {
        data.characters.forEach((char: any) => {
          const newChar: Character = {
            ...char,
            id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            genre: selectedGenre,
            createdAt: new Date().toISOString(),
          };
          onSaveCharacter(newChar);
        });

        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#38bdf8', '#fbbf24'],
        });
      }
    } catch (err: any) {
      console.error('Character generation failed:', err);
      setError(err.message || 'Failed to forge characters.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Generator Card */}
      <div className="rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#150d30] via-[#100924] to-[#0a0618] p-6 sm:p-8 shadow-xl shadow-purple-950/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30">
            <Users className="w-6 h-6 text-fuchsia-300" />
          </div>
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-purple-100">
              AI Character Forge
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/70">
              Craft multi-dimensional protagonists, cunning villains, and unforgettable companions
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Genre */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-2">
                Character Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-black/40 border border-purple-500/25 rounded-xl px-3.5 py-2.5 text-xs text-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {GENRES.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#120a28] text-purple-200">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Archetype */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-2">
                Archetype / Trope
              </label>
              <select
                value={selectedArchetype}
                onChange={(e) => setSelectedArchetype(e.target.value)}
                className="w-full bg-black/40 border border-purple-500/25 rounded-xl px-3.5 py-2.5 text-xs text-purple-200 focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                {CHARACTER_ARCHETYPES.map((arch) => (
                  <option key={arch} value={arch} className="bg-[#120a28] text-purple-200">
                    {arch}
                  </option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-2">
                Quantity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      count === num
                        ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                        : 'bg-black/40 border-purple-500/20 text-purple-300/70 hover:text-purple-200'
                    }`}
                  >
                    {num} {num === 1 ? 'Hero' : 'Heroes'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Setting Context */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-2">
              World / Setting Context (Optional)
            </label>
            <input
              type="text"
              value={customSetting}
              onChange={(e) => setCustomSetting(e.target.value)}
              placeholder="e.g. Victorian clockpunk academy, or an interstellar freighter transporting cryo-sleepers"
              className="w-full rounded-2xl bg-black/40 border border-purple-500/25 px-4 py-3 text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 focus:outline-none focus:border-purple-400 font-sans"
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-fuchsia-950/50 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Forging Characters with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Forge Original Character</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Character Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-heading text-lg font-semibold text-purple-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Character Roster ({characters.length})
          </h3>
          <span className="text-xs text-purple-300/70">
            Use any character directly in your next story
          </span>
        </div>

        {characters.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-purple-500/25 bg-purple-950/10">
            <Users className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
            <p className="text-sm text-purple-300 font-medium">Your character roster is empty</p>
            <p className="text-xs text-purple-400/60 mt-1 max-w-sm mx-auto">
              Use the forge above to generate protagonists, mentors, and rivals complete with backstories and traits.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {characters.map((char) => (
              <div
                key={char.id}
                className="rounded-3xl border border-purple-500/20 bg-gradient-to-b from-[#160d33] via-[#110926] to-[#0a0618] p-6 shadow-lg shadow-purple-950/40 relative group hover:border-purple-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Initials badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-white font-heading font-bold text-lg shadow-md shadow-purple-900/40">
                        {char.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-heading text-base font-bold text-purple-100 leading-tight">
                          {char.name}
                        </h4>
                        <span className="text-xs text-purple-300/80 font-medium">{char.title}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteCharacter(char.id)}
                      className="p-1.5 rounded-lg text-purple-400/60 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete character"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-purple-200/90 italic font-story mb-4 pb-3 border-b border-purple-500/15">
                    "{char.tagline}"
                  </p>

                  {/* Personality Traits Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {char.personalityTraits.map((trait, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-purple-950/80 border border-purple-500/25 text-purple-300"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 text-xs text-purple-200/80 mb-5">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold block mb-0.5 flex items-center gap-1">
                        <Feather className="w-3 h-3" /> Appearance & Style
                      </span>
                      <p className="leading-relaxed">{char.appearance}</p>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold block mb-0.5 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Motivation
                      </span>
                      <p className="leading-relaxed">{char.motivation}</p>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-rose-400/90 font-semibold block mb-0.5 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Secret or Flaw
                      </span>
                      <p className="leading-relaxed">{char.secretOrFlaw}</p>
                    </div>

                    {char.signatureQuote && (
                      <div className="pt-2 text-xs text-amber-200/90 italic flex items-start gap-1.5">
                        <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{char.signatureQuote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-purple-400/60">{char.genre || 'Original'}</span>
                  <button
                    onClick={() => onUseInStory(char)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Send className="w-3 h-3 text-purple-300" />
                    <span>Use in Story Creator</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
