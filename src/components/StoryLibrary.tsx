import React, { useState } from 'react';
import {
  Library,
  Search,
  BookOpen,
  Trash2,
  Download,
  Copy,
  Clock,
  FileText,
  Filter,
  Sparkles,
  GitBranch,
  X,
  Check,
} from 'lucide-react';
import { Story } from '../types';
import { downloadStoryTxt, copyStoryToClipboard } from '../utils/download';
import { StoryReader } from './StoryReader';

interface StoryLibraryProps {
  stories: Story[];
  onDeleteStory: (id: string) => void;
  onContinueInWeaver: (story: Story) => void;
  onUpdateStory: (updatedStory: Story) => void;
  onOpenCreateStory: () => void;
}

export const StoryLibrary: React.FC<StoryLibraryProps> = ({
  stories,
  onDeleteStory,
  onContinueInWeaver,
  onUpdateStory,
  onOpenCreateStory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('All');
  const [activeReadingStory, setActiveReadingStory] = useState<Story | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique genres present in stories
  const uniqueGenres = ['All', ...Array.from(new Set(stories.map((s) => s.genre)))];

  const filteredStories = stories.filter((story) => {
    const matchesGenre = selectedGenreFilter === 'All' || story.genre === selectedGenreFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesGenre;
    const matchesQuery =
      story.title.toLowerCase().includes(q) ||
      story.summary.toLowerCase().includes(q) ||
      story.beginning.toLowerCase().includes(q) ||
      story.middle.toLowerCase().includes(q) ||
      story.ending.toLowerCase().includes(q) ||
      (story.keyCharacters && story.keyCharacters.some((c) => c.toLowerCase().includes(q)));
    return matchesGenre && matchesQuery;
  });

  const handleCopy = async (story: Story) => {
    const success = await copyStoryToClipboard(story);
    if (success) {
      setCopiedId(story.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Search */}
      <div className="rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#150d30] via-[#100924] to-[#0a0618] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Library className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-purple-100">
                My Story Library
              </h2>
              <p className="text-xs sm:text-sm text-purple-300/70">
                {stories.length} tales saved in your chronicle collection
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCreateStory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create New Tale</span>
          </button>
        </div>

        {/* Search bar & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories by title, character, or keyword..."
              className="w-full bg-black/40 border border-purple-500/25 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 focus:outline-none focus:border-purple-400 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Genre Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-purple-400/80 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {uniqueGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenreFilter(genre)}
                className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedGenreFilter === genre
                    ? 'bg-purple-600/40 border-purple-400 text-white shadow-sm'
                    : 'bg-purple-950/40 border-purple-500/20 text-purple-300/70 hover:text-purple-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-purple-500/25 bg-purple-950/10">
          <BookOpen className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-purple-200">No stories match your search</h3>
          <p className="text-xs text-purple-400/60 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or generate an imaginative new story using the studio!
          </p>
          <button
            onClick={onOpenCreateStory}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Story</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="rounded-3xl border border-purple-500/20 bg-gradient-to-b from-[#160d33] via-[#110926] to-[#0a0618] p-6 shadow-lg shadow-purple-950/40 relative group hover:border-purple-400/40 hover:shadow-purple-900/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {story.genre}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-purple-400/70">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {story.readingTimeMinutes}m
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {story.wordCount}w
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-purple-100 mb-2 group-hover:text-purple-200 transition-colors leading-snug line-clamp-2">
                  {story.title}
                </h3>

                {/* Synopsis */}
                <p className="text-xs text-purple-300/80 italic font-story mb-4 line-clamp-3 leading-relaxed">
                  "{story.summary}"
                </p>

                {/* Continuations badge if any */}
                {story.continuations && story.continuations.length > 0 && (
                  <div className="mb-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-[11px] text-indigo-300">
                    <GitBranch className="w-3 h-3 text-indigo-400" />
                    <span>{story.continuations.length} Added Chapter{story.continuations.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-purple-500/15 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveReadingStory(story)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Story</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => downloadStoryTxt(story)}
                    className="p-1.5 rounded-lg text-purple-300/80 hover:text-purple-100 hover:bg-purple-900/40 transition-colors cursor-pointer"
                    title="Download TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopy(story)}
                    className="p-1.5 rounded-lg text-purple-300/80 hover:text-purple-100 hover:bg-purple-900/40 transition-colors cursor-pointer"
                    title="Copy story"
                  >
                    {copiedId === story.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(story.id)}
                    className="p-1.5 rounded-lg text-purple-400/60 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      {activeReadingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto">
            <button
              onClick={() => setActiveReadingStory(null)}
              className="absolute -top-3 -right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-200 hover:text-white hover:bg-purple-900 transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <StoryReader
              story={activeReadingStory}
              isSaved={true}
              onContinueInWeaver={(st) => {
                setActiveReadingStory(null);
                onContinueInWeaver(st);
              }}
              onUpdateStory={(updated) => {
                setActiveReadingStory(updated);
                onUpdateStory(updated);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#150d30] border border-rose-500/40 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Delete This Tale?</h3>
            <p className="text-xs text-purple-200/70">
              Are you sure you wish to remove this story from your library? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/25 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStory(deleteConfirmId);
                  setDeleteConfirmId(null);
                  if (activeReadingStory?.id === deleteConfirmId) {
                    setActiveReadingStory(null);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/40 cursor-pointer"
              >
                Yes, Delete Tale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
