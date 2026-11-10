import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Wand2,
  Users,
  Clock,
  Compass,
  ArrowRight,
  Flame,
  FileText,
  Dice5,
  Ghost,
  Laugh,
  Rocket,
  Search,
  Check,
  Download,
} from 'lucide-react';
import { Story, Character } from '../types';
import { GENRES } from '../data/genres';
import { downloadStoryTxt } from '../utils/download';

interface DashboardProps {
  stories: Story[];
  characters: Character[];
  onNavigateTab: (tab: 'generator' | 'characters' | 'weaver' | 'library') => void;
  onSelectGenreForNewStory: (genreId: string, prompt?: string) => void;
  onReadStory: (story: Story) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stories,
  characters,
  onNavigateTab,
  onSelectGenreForNewStory,
  onReadStory,
}) => {
  const [randomPromptToast, setRandomPromptToast] = useState<string | null>(null);

  // Compute stats
  const totalWords = stories.reduce((acc, s) => acc + (s.wordCount || 0), 0);
  const totalReadTime = stories.reduce((acc, s) => acc + (s.readingTimeMinutes || 0), 0);
  const recentStories = [...stories]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleSurpriseMe = () => {
    const randomGenre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const randomPrompt =
      randomGenre.prompts[Math.floor(Math.random() * randomGenre.prompts.length)];
    setRandomPromptToast(randomPrompt);
    onSelectGenreForNewStory(randomGenre.id, randomPrompt);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-[#1b103e] via-[#130b2c] to-[#090515] p-7 sm:p-10 shadow-2xl shadow-purple-950/50">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-purple-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-600/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Powered by Google Gemini AI 3.8 Flash</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-violet-200 to-amber-100 tracking-wide leading-tight">
            Bring Your Imagination to Life With Words & Magic.
          </h1>

          <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-story max-w-2xl">
            Welcome to the AI Story Creator. Weave gripping original three-act tales, forge multi-layered heroes, design vivid illustrations, and continue adventures across endless branches.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('generator')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-purple-900/50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-purple-200" />
              <span>Create New Story</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-purple-950/70 hover:bg-purple-900/70 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-medium transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Dice5 className="w-4 h-4 text-amber-300" />
              <span>Surprise Prompt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#140c2e]/80 border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-purple-400 text-xs mb-1 font-medium">
            <BookOpen className="w-4 h-4" />
            <span>Stories Penned</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-white">
            {stories.length}
          </p>
          <span className="text-[11px] text-purple-300/60">In your library</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#140c2e]/80 border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyan-400 text-xs mb-1 font-medium">
            <FileText className="w-4 h-4" />
            <span>Total Words</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-white">
            {totalWords.toLocaleString()}
          </p>
          <span className="text-[11px] text-cyan-300/60">Penned by Gemini</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#140c2e]/80 border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-fuchsia-400 text-xs mb-1 font-medium">
            <Users className="w-4 h-4" />
            <span>Characters Forged</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-white">
            {characters.length}
          </p>
          <span className="text-[11px] text-fuchsia-300/60">Ready for adventures</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#140c2e]/80 border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-amber-400 text-xs mb-1 font-medium">
            <Clock className="w-4 h-4" />
            <span>Reading Time</span>
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-white">
            {totalReadTime} <span className="text-sm font-normal text-amber-300/70">min</span>
          </p>
          <span className="text-[11px] text-amber-300/60">Total immersive lore</span>
        </div>
      </div>

      {/* Genre Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-purple-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              Explore Story Genres
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/70">
              Select any of the 8 signature categories to jump directly into the generator
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GENRES.map((genre) => (
            <div
              key={genre.id}
              className={`rounded-2xl border border-purple-500/20 bg-gradient-to-b ${genre.cardGradient} p-5 transition-all hover:scale-[1.02] hover:border-purple-400/50 shadow-md group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${genre.badgeBg}`}
                  >
                    {genre.name}
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-white mb-1.5 group-hover:text-purple-200 transition-colors">
                  {genre.name}
                </h3>

                <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                  {genre.description}
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-purple-500/15">
                  <button
                    onClick={() => onSelectGenreForNewStory(genre.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-100 text-xs font-medium transition-all cursor-pointer"
                  >
                    <span>Write {genre.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Created / Saved Stories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-purple-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Recently Penned Stories
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/70">
              Continue reading or download your latest chronicles
            </p>
          </div>

          {stories.length > 3 && (
            <button
              onClick={() => onNavigateTab('library')}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>View All ({stories.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentStories.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-purple-500/25 bg-purple-950/20">
            <p className="text-sm text-purple-300">No stories created yet.</p>
            <button
              onClick={() => onNavigateTab('generator')}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/40 text-purple-200 text-xs font-medium cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Create your first story</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentStories.map((story) => (
              <div
                key={story.id}
                className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#160d33] via-[#110926] to-[#090516] p-5 shadow-lg flex flex-col justify-between group hover:border-purple-400/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {story.genre}
                    </span>
                    <span className="text-[11px] text-purple-400/70">
                      {story.readingTimeMinutes}m read
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-purple-100 mb-2 line-clamp-1 group-hover:text-purple-200">
                    {story.title}
                  </h3>

                  <p className="text-xs text-purple-300/80 italic font-story mb-4 line-clamp-3">
                    "{story.summary}"
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onReadStory(story)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-medium cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read</span>
                  </button>

                  <button
                    onClick={() => downloadStoryTxt(story)}
                    className="p-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-purple-900/40 cursor-pointer"
                    title="Download TXT"
                  >
                    <Download className="w-4 h-4" />
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
