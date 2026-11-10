import React, { useState } from 'react';
import { Sparkles, Palette, Eye, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { Story, IllustrationConcept } from '../types';

interface IllustrationVisualizerProps {
  story: Story;
  onUpdateStory?: (updatedStory: Story) => void;
}

export const IllustrationVisualizer: React.FC<IllustrationVisualizerProps> = ({
  story,
  onUpdateStory,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateIllustration = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/stories/illustrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle: story.title,
          sceneDescription: story.illustrationPrompt || story.summary,
          style: story.style,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to craft illustration');
      }

      if (onUpdateStory) {
        onUpdateStory({
          ...story,
          illustrationUrl: data.imageUrl || null,
          illustrationConcept: data.concept || story.illustrationConcept || null,
          isAiRendered: Boolean(data.isAiRendered && data.imageUrl),
        });
      }
    } catch (err: any) {
      console.error('Illustration generation failed:', err);
      setError(err.message || 'Could not generate illustration at this time.');
    } finally {
      setIsGenerating(false);
    }
  };

  const concept: IllustrationConcept | null = story.illustrationConcept || null;

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/30 to-indigo-950/20 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-purple-100">
              AI Story Illustration & Visual Concept
            </h3>
            <p className="text-xs text-purple-300/70">
              Visual art direction and concept design crafted for this tale
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateIllustration}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-medium transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Conjuring Imagery...</span>
            </>
          ) : story.illustrationUrl ? (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Art</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Generate AI Art Concept</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
          {error}
        </div>
      )}

      {/* Actual AI Rendered Image */}
      {story.illustrationUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-purple-500/30 group aspect-video max-h-96 w-full bg-black/40">
            <img
              src={story.illustrationUrl}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-xs text-purple-200 font-medium">{story.title}</p>
              <p className="text-[11px] text-purple-300/70 line-clamp-2">
                {story.illustrationPrompt}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Concept & Art Direction Card */
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-950/80 p-5">
            {/* Ambient decorative glowing nebula */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                    Artistic Scene Prompt
                  </span>
                  <p className="text-sm text-purple-100/90 italic mt-1 leading-relaxed font-story">
                    "{story.illustrationPrompt}"
                  </p>
                </div>
              </div>

              {concept && (
                <div className="pt-3 border-t border-purple-500/15 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-purple-400 font-medium flex items-center gap-1.5 mb-1">
                      <Eye className="w-3.5 h-3.5" /> Focal Composition
                    </span>
                    <p className="text-purple-200/80">{concept.focalPoint}</p>
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> Atmospheric Lighting
                    </span>
                    <p className="text-purple-200/80">{concept.lighting}</p>
                  </div>

                  {concept.palette && concept.palette.length > 0 && (
                    <div className="md:col-span-2 pt-2">
                      <span className="text-purple-400 font-medium flex items-center gap-1.5 mb-2">
                        <Palette className="w-3.5 h-3.5" /> Harmonized Color Palette
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {concept.palette.map((color, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/30 border border-purple-500/20"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-mono text-[10px] text-purple-200">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
