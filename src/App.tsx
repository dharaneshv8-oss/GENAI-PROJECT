import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StoryGenerator } from './components/StoryGenerator';
import { CharacterForge } from './components/CharacterForge';
import { StoryWeaver } from './components/StoryWeaver';
import { StoryLibrary } from './components/StoryLibrary';
import { StoryReader } from './components/StoryReader';
import { Story, Character } from './types';
import {
  loadStories,
  saveStories,
  loadCharacters,
  saveCharacters,
} from './utils/storage';
import {
  Sparkles,
  BookOpen,
  Feather,
  Heart,
  X,
  Compass,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stories, setStories] = useState<Story[]>(() => loadStories());
  const [characters, setCharacters] = useState<Character[]>(() => loadCharacters());

  const [generatorGenre, setGeneratorGenre] = useState<string>('Fantasy');
  const [generatorPrompt, setGeneratorPrompt] = useState<string>('');
  const [storyForWeaver, setStoryForWeaver] = useState<Story | null>(null);
  const [activeReadingStory, setActiveReadingStory] = useState<Story | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveStories(stories);
  }, [stories]);

  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveStory = (storyToSave: Story) => {
    setStories((prev) => {
      const exists = prev.some((s) => s.id === storyToSave.id);
      if (exists) {
        return prev.map((s) => (s.id === storyToSave.id ? storyToSave : s));
      }
      return [storyToSave, ...prev];
    });
    showToast(`"${storyToSave.title}" saved to your Library!`);
  };

  const handleDeleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    showToast('Story removed from your library.');
  };

  const handleUpdateStory = (updatedStory: Story) => {
    setStories((prev) =>
      prev.map((s) => (s.id === updatedStory.id ? updatedStory : s))
    );
    showToast('Story updated successfully!');
  };

  const isStorySaved = (storyId: string) => {
    return stories.some((s) => s.id === storyId);
  };

  const handleSaveCharacter = (newChar: Character) => {
    setCharacters((prev) => [newChar, ...prev]);
    showToast(`Character "${newChar.name}" forged!`);
  };

  const handleDeleteCharacter = (charId: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== charId));
    showToast('Character removed from roster.');
  };

  const handleUseCharacterInStory = (char: Character) => {
    setGeneratorGenre(char.genre || 'Fantasy');
    setGeneratorPrompt(`A tale featuring ${char.name}, ${char.title}. ${char.tagline}`);
    setActiveTab('generator');
    showToast(`Loaded ${char.name} into Story Studio!`);
  };

  const handleSelectGenreForNewStory = (genreId: string, prompt?: string) => {
    setGeneratorGenre(genreId);
    if (prompt) {
      setGeneratorPrompt(prompt);
    }
    setActiveTab('generator');
  };

  const handleContinueInWeaver = (story: Story) => {
    setStoryForWeaver(story);
    setActiveTab('weaver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewStory = () => {
    setGeneratorPrompt('');
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080413] text-[#f1f0f7] bg-magical-grid relative flex flex-col selection:bg-purple-600/40 selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedStoriesCount={stories.length}
        charactersCount={characters.length}
        onNewStoryClick={handleOpenNewStory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {activeTab === 'dashboard' && (
          <Dashboard
            stories={stories}
            characters={characters}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectGenreForNewStory={handleSelectGenreForNewStory}
            onReadStory={(story) => setActiveReadingStory(story)}
          />
        )}

        {activeTab === 'generator' && (
          <StoryGenerator
            initialGenre={generatorGenre}
            initialPrompt={generatorPrompt}
            savedCharacters={characters}
            onSaveStory={handleSaveStory}
            isStorySaved={isStorySaved}
            onContinueInWeaver={handleContinueInWeaver}
          />
        )}

        {activeTab === 'characters' && (
          <CharacterForge
            characters={characters}
            onSaveCharacter={handleSaveCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            onUseInStory={handleUseCharacterInStory}
          />
        )}

        {activeTab === 'weaver' && (
          <StoryWeaver
            initialStory={storyForWeaver}
            savedStories={stories}
            onUpdateStory={handleUpdateStory}
          />
        )}

        {activeTab === 'library' && (
          <StoryLibrary
            stories={stories}
            onDeleteStory={handleDeleteStory}
            onContinueInWeaver={handleContinueInWeaver}
            onUpdateStory={handleUpdateStory}
            onOpenCreateStory={handleOpenNewStory}
          />
        )}
      </main>

      {/* Standalone Story Reader Modal from Dashboard */}
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
              isSaved={isStorySaved(activeReadingStory.id)}
              onToggleSave={handleSaveStory}
              onContinueInWeaver={(st) => {
                setActiveReadingStory(null);
                handleContinueInWeaver(st);
              }}
              onUpdateStory={(updated) => {
                setActiveReadingStory(updated);
                handleUpdateStory(updated);
              }}
            />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-purple-400/40 text-white text-xs sm:text-sm font-medium shadow-2xl shadow-purple-950 backdrop-blur-md animate-magical-pulse">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-purple-500/15 bg-[#070311]/90 py-8 mt-16 text-center text-xs text-purple-300/60 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span className="font-heading font-semibold text-purple-200">
            AI Story Creator
          </span>
          <span>•</span>
          <span>Powered by Google Gemini AI</span>
        </div>
        <p className="text-[11px] text-purple-400/50 max-w-md mx-auto">
          Crafting unforgettable stories across Fantasy, Sci-Fi, Horror, Mystery, Adventure, Comedy, Friendship, and Inspiration.
        </p>
      </footer>
    </div>
  );
}
