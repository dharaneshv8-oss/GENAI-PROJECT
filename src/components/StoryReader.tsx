import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Download,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  GitBranch,
  Clock,
  FileText,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Story } from '../types';
import { downloadStoryTxt, downloadStoryMarkdown, copyStoryToClipboard } from '../utils/download';
import { narrator, SpeechState } from '../utils/speech';
import { IllustrationVisualizer } from './IllustrationVisualizer';

interface StoryReaderProps {
  story: Story;
  isSaved?: boolean;
  onToggleSave?: (story: Story) => void;
  onContinueInWeaver?: (story: Story) => void;
  onUpdateStory?: (updatedStory: Story) => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  isSaved = false,
  onToggleSave,
  onContinueInWeaver,
  onUpdateStory,
}) => {
  const [copied, setCopied] = useState(false);
  const [speechState, setSpeechState] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    hasSpeechSynthesis: true,
  });
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    narrator.subscribe(setSpeechState);
    return () => {
      narrator.stop();
    };
  }, []);

  const handleCopy = async () => {
    const success = await copyStoryToClipboard(story);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleNarrator = () => {
    if (speechState.isPlaying) {
      if (speechState.isPaused) {
        narrator.resume();
      } else {
        narrator.pause();
      }
    } else {
      const fullTextToRead = `${story.title}. A story in the genre of ${story.genre}. Beginning: ${story.beginning}. Middle: ${story.middle}. Ending: ${story.ending}. Theme: ${story.moralOrTheme}`;
      narrator.speak(fullTextToRead, story.language);
    }
  };

  const handleStopNarrator = () => {
    narrator.stop();
  };

  return (
    <article className="rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#160d33] via-[#120a28] to-[#0c071e] p-6 sm:p-9 shadow-2xl shadow-purple-950/60 relative overflow-hidden">
      {/* Subtle backdrop star glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 border-b border-purple-500/20 pb-6 mb-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {story.genre}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs text-indigo-300 bg-indigo-500/15 border border-indigo-500/20">
              {story.style}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] text-purple-300/80 bg-purple-950/60 border border-purple-500/20">
              {story.language}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-purple-300/70">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {story.readingTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              {story.wordCount} words
            </span>
          </div>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-violet-200 to-amber-100 mb-3 tracking-wide leading-tight">
          {story.title}
        </h1>

        <p className="text-sm sm:text-base text-purple-200/80 italic font-story leading-relaxed max-w-3xl">
          "{story.summary}"
        </p>

        {story.keyCharacters && story.keyCharacters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-purple-400 font-medium">Characters:</span>
            {story.keyCharacters.map((char, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs bg-purple-950/70 border border-purple-500/20 text-purple-200"
              >
                {char}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 mb-8 backdrop-blur-sm">
        {/* Left: Audio narration */}
        <div className="flex items-center gap-2">
          {speechState.hasSpeechSynthesis && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleNarrator}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all hover:scale-[1.02] cursor-pointer"
                title={speechState.isPlaying ? (speechState.isPaused ? 'Resume' : 'Pause') : 'Listen to story'}
              >
                {speechState.isPlaying && !speechState.isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-purple-300" />
                    <span>Pause Narrator</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                    <span>{speechState.isPaused ? 'Resume Narrator' : 'Read Aloud'}</span>
                  </>
                )}
              </button>

              {speechState.isPlaying && (
                <button
                  onClick={handleStopNarrator}
                  className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                  title="Stop narrator"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Font sizing */}
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
            className="px-2.5 py-1 rounded-xl text-xs bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/20 text-purple-300 cursor-pointer transition-colors"
          >
            {fontSize === 'normal' ? 'A+' : 'A-'} Font
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(story)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                  : 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border-purple-500/30'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Saved in Library</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                  <span>Save to Library</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => downloadStoryTxt(story)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 transition-all cursor-pointer hover:border-purple-400/50"
            title="Download TXT file"
          >
            <Download className="w-3.5 h-3.5 text-purple-300" />
            <span>Download TXT</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 transition-all cursor-pointer"
            title="Copy story text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-300" />
                <span>Copy</span>
              </>
            )}
          </button>

          {onContinueInWeaver && (
            <button
              onClick={() => onContinueInWeaver(story)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-900/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-violet-200" />
              <span>Continue Story</span>
            </button>
          )}
        </div>
      </div>

      {/* Story Illustration Section */}
      <div className="relative z-10 mb-8">
        <IllustrationVisualizer story={story} onUpdateStory={onUpdateStory} />
      </div>

      {/* Story Narrative Acts */}
      <div
        className={`relative z-10 space-y-8 text-purple-100/90 font-story leading-relaxed ${
          fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
        }`}
      >
        {/* Beginning */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-heading text-xs font-bold">
              I
            </span>
            <h2 className="font-heading text-sm font-semibold tracking-wider text-purple-400 uppercase">
              The Beginning
            </h2>
          </div>
          <div className="pl-8 border-l border-purple-500/20 whitespace-pre-line leading-loose text-purple-100/90">
            {story.beginning}
          </div>
        </section>

        {/* Middle */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-heading text-xs font-bold">
              II
            </span>
            <h2 className="font-heading text-sm font-semibold tracking-wider text-indigo-400 uppercase">
              The Turning Point
            </h2>
          </div>
          <div className="pl-8 border-l border-indigo-500/20 whitespace-pre-line leading-loose text-purple-100/90">
            {story.middle}
          </div>
        </section>

        {/* Ending */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center font-heading text-xs font-bold">
              III
            </span>
            <h2 className="font-heading text-sm font-semibold tracking-wider text-violet-400 uppercase">
              The Resolution
            </h2>
          </div>
          <div className="pl-8 border-l border-violet-500/20 whitespace-pre-line leading-loose text-purple-100/90">
            {story.ending}
          </div>
        </section>

        {/* Continuations, if any exist */}
        {story.continuations && story.continuations.length > 0 && (
          <div className="pt-6 border-t border-purple-500/20 space-y-6">
            <h3 className="font-heading text-lg font-semibold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Continued Chronicles ({story.continuations.length})
            </h3>

            {story.continuations.map((cont, idx) => (
              <div
                key={cont.id || idx}
                className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-indigo-500/20 pb-2">
                  <h4 className="font-heading text-base font-semibold text-indigo-200">
                    Chapter {idx + 2}: {cont.chapterTitle}
                  </h4>
                  <span className="text-xs text-indigo-300/70">{cont.wordCount} words</span>
                </div>
                <div className="whitespace-pre-line leading-loose text-indigo-100/90 font-story">
                  {cont.continuationText}
                </div>
                {cont.cliffhangerOrHook && (
                  <div className="pt-2 text-xs italic text-amber-300/90 font-sans flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{cont.cliffhangerOrHook}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Moral / Theme Card */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-purple-950/60 border border-purple-500/30 flex items-start gap-3.5 font-sans">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              Core Theme & Insight
            </h4>
            <p className="text-sm sm:text-base text-purple-100 italic font-story">
              "{story.moralOrTheme}"
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
