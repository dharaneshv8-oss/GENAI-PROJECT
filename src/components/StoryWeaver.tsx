import React, { useState } from 'react';
import {
  GitBranch,
  Sparkles,
  BookOpen,
  Send,
  Loader2,
  AlertCircle,
  Check,
  Download,
  Copy,
  PlusCircle,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Story, StoryContinuation } from '../types';
import { CONTINUATION_DIRECTIONS } from '../data/genres';
import { downloadStoryTxt, copyStoryToClipboard } from '../utils/download';

interface StoryWeaverProps {
  initialStory?: Story | null;
  savedStories: Story[];
  onUpdateStory: (updatedStory: Story) => void;
}

export const StoryWeaver: React.FC<StoryWeaverProps> = ({
  initialStory,
  savedStories,
  onUpdateStory,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>(
    initialStory ? initialStory.id : savedStories[0]?.id || ''
  );
  const [pastedStory, setPastedStory] = useState<string>(
    initialStory
      ? `${initialStory.beginning}\n\n${initialStory.middle}\n\n${initialStory.ending}`
      : ''
  );
  const [storyTitle, setStoryTitle] = useState<string>(initialStory?.title || 'My Ongoing Tale');
  const [direction, setDirection] = useState<string>(CONTINUATION_DIRECTIONS[0].label);
  const [customDirection, setCustomDirection] = useState<string>('');
  const [isWeaving, setIsWeaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latestContinuation, setLatestContinuation] = useState<StoryContinuation | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // If user picks a story from the dropdown
  const handleSelectSavedStory = (id: string) => {
    setSelectedStoryId(id);
    const found = savedStories.find((s) => s.id === id);
    if (found) {
      let fullText = `${found.beginning}\n\n${found.middle}\n\n${found.ending}`;
      if (found.continuations && found.continuations.length > 0) {
        found.continuations.forEach((c) => {
          fullText += `\n\nChapter: ${c.chapterTitle}\n${c.continuationText}`;
        });
      }
      setPastedStory(fullText);
      setStoryTitle(found.title);
    }
  };

  const handleWeaveContinuation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pastedStory.trim()) {
      setError('Please provide or paste an existing story to continue.');
      return;
    }

    setIsWeaving(true);
    setError(null);

    const chosenDirection = customDirection.trim() ? customDirection.trim() : direction;

    try {
      const response = await fetch('/api/stories/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingStory: pastedStory,
          title: storyTitle,
          continuationDirection: chosenDirection,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to weave continuation.');
      }

      const continuationObj: StoryContinuation = {
        id: `cont_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        chapterTitle: data.chapterTitle,
        continuationText: data.continuationText,
        cliffhangerOrHook: data.cliffhangerOrHook,
        newDevelopments: data.newDevelopments || [],
        timestamp: data.timestamp || new Date().toISOString(),
        wordCount: data.wordCount || 400,
      };

      setLatestContinuation(continuationObj);

      // If this corresponds to an existing saved story, append to it
      const matched = savedStories.find((s) => s.id === selectedStoryId);
      if (matched) {
        const updated: Story = {
          ...matched,
          continuations: [...(matched.continuations || []), continuationObj],
          wordCount: matched.wordCount + continuationObj.wordCount,
          readingTimeMinutes: Math.ceil((matched.wordCount + continuationObj.wordCount) / 180),
        };
        onUpdateStory(updated);
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#38bdf8', '#fbbf24'],
      });
    } catch (err: any) {
      console.error('Continuation failed:', err);
      setError(err.message || 'Unable to continue story at this time.');
    } finally {
      setIsWeaving(false);
    }
  };

  const handleCopyChapter = () => {
    if (latestContinuation) {
      navigator.clipboard.writeText(
        `Chapter: ${latestContinuation.chapterTitle}\n\n${latestContinuation.continuationText}\n\nUpcoming: ${latestContinuation.cliffhangerOrHook}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="rounded-3xl border border-indigo-500/25 bg-gradient-to-b from-[#150d30] via-[#100a26] to-[#0a0618] p-6 sm:p-8 shadow-xl shadow-indigo-950/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
            <GitBranch className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-purple-100">
              Continue My Story (Story Weaver)
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/70">
              Paste an existing tale or select from your library to generate consistent, gripping next chapters
            </p>
          </div>
        </div>

        <form onSubmit={handleWeaveContinuation} className="space-y-6">
          {/* Quick Select from Saved Library */}
          {savedStories.length > 0 && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-2">
                Quick Select from Library
              </label>
              <div className="flex flex-wrap gap-2">
                {savedStories.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSavedStory(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedStoryId === s.id
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm'
                        : 'bg-black/40 border-purple-500/20 text-purple-300/70 hover:text-purple-200'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Story Title & Textarea */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-1">
                  Story Title
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="w-full bg-black/40 border border-purple-500/25 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 focus:outline-none focus:border-indigo-400"
                  placeholder="Title of your tale"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-1">
                Existing Story / Previous Chapters
              </label>
              <textarea
                rows={6}
                value={pastedStory}
                onChange={(e) => setPastedStory(e.target.value)}
                placeholder="Paste the beginning, middle, or ending of your story here. Gemini will analyze the tone, characters, setting, and plot momentum..."
                className="w-full rounded-2xl bg-black/40 border border-purple-500/25 p-4 text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 focus:outline-none focus:border-indigo-400 font-story leading-relaxed"
              />
            </div>
          </div>

          {/* Continuation Direction Cards */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-2.5">
              Choose Continuation Direction
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CONTINUATION_DIRECTIONS.map((dir) => {
                const isSelected = direction === dir.label;
                return (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => {
                      setDirection(dir.label);
                      setCustomDirection('');
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-black/30 border-purple-500/15 hover:border-purple-500/35 text-purple-200/80 hover:bg-black/50'
                    }`}
                  >
                    <span className="text-xs font-bold block">{dir.label}</span>
                    <span className="text-[11px] text-purple-300/60 mt-1 block leading-snug">
                      {dir.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Direction Option */}
            <div className="mt-3">
              <input
                type="text"
                value={customDirection}
                onChange={(e) => setCustomDirection(e.target.value)}
                placeholder="Or specify custom direction (e.g. A storm forces them into a sunken cavern)"
                className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-2 text-xs text-purple-100 placeholder:text-purple-400/40 focus:outline-none focus:border-indigo-400"
              />
            </div>
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
              disabled={isWeaving}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-950/50 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isWeaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Weaving Next Chapter with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Continuation Chapter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Continuation Result */}
      {latestContinuation && (
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-[#140b2d] via-[#100724] to-[#090516] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                Fresh Continuation Chapter
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-indigo-100 mt-1">
                {latestContinuation.chapterTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyChapter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/30 text-xs text-purple-200 cursor-pointer transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Chapter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Narrative Text */}
          <div className="whitespace-pre-line text-sm sm:text-base text-purple-100/90 font-story leading-relaxed pl-4 border-l-2 border-indigo-500/40">
            {latestContinuation.continuationText}
          </div>

          {/* Cliffhanger or upcoming hook */}
          {latestContinuation.cliffhangerOrHook && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-amber-200/95 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block mb-0.5">Upcoming Hook:</span>
                <p className="italic">{latestContinuation.cliffhangerOrHook}</p>
              </div>
            </div>
          )}

          {latestContinuation.newDevelopments && latestContinuation.newDevelopments.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] text-purple-400 font-medium">New Developments:</span>
              {latestContinuation.newDevelopments.map((dev, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs bg-indigo-950/80 border border-indigo-500/25 text-indigo-200"
                >
                  {dev}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
