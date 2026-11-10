import React from 'react';
import {
  Sparkles,
  BookOpen,
  Wand2,
  Users,
  GitBranch,
  Library,
  Feather,
  Plus,
} from 'lucide-react';

export type TabType = 'dashboard' | 'generator' | 'characters' | 'weaver' | 'library';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedStoriesCount: number;
  charactersCount: number;
  onNewStoryClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  savedStoriesCount,
  charactersCount,
  onNewStoryClick,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-purple-500/20 bg-[#090514]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 group-hover:scale-105 transition-transform border border-purple-400/30">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-base sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-violet-200 to-amber-100 tracking-wider">
                  AI Story Creator
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Gemini
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-purple-400/70 hidden sm:block">
                Interactive Storytelling Studio
              </span>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-[#140b2e]/60 border border-purple-500/20">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-purple-600/35 text-white shadow-sm border border-purple-400/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('generator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'generator'
                  ? 'bg-purple-600/35 text-white shadow-sm border border-purple-400/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/40'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Story Studio</span>
            </button>

            <button
              onClick={() => onTabChange('characters')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'characters'
                  ? 'bg-purple-600/35 text-white shadow-sm border border-purple-400/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/40'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Character Forge</span>
              {charactersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-fuchsia-500/25 text-fuchsia-300">
                  {charactersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('weaver')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'weaver'
                  ? 'bg-purple-600/35 text-white shadow-sm border border-purple-400/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/40'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Continue Story</span>
            </button>

            <button
              onClick={() => onTabChange('library')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'library'
                  ? 'bg-purple-600/35 text-white shadow-sm border border-purple-400/30'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-950/40'
              }`}
            >
              <Library className="w-3.5 h-3.5 text-purple-400" />
              <span>My Library</span>
              {savedStoriesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/25 text-purple-300">
                  {savedStoriesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Create CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNewStoryClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-purple-200" />
              <span className="hidden sm:inline">New Story</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-purple-500/15 overflow-x-auto gap-1">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1 ${
              activeTab === 'dashboard' ? 'bg-purple-600/30 text-white' : 'text-purple-300/70'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onTabChange('generator')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1 ${
              activeTab === 'generator' ? 'bg-purple-600/30 text-white' : 'text-purple-300/70'
            }`}
          >
            <Wand2 className="w-3 h-3" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => onTabChange('characters')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1 ${
              activeTab === 'characters' ? 'bg-purple-600/30 text-white' : 'text-purple-300/70'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Heroes</span>
          </button>

          <button
            onClick={() => onTabChange('weaver')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1 ${
              activeTab === 'weaver' ? 'bg-purple-600/30 text-white' : 'text-purple-300/70'
            }`}
          >
            <GitBranch className="w-3 h-3" />
            <span>Continue</span>
          </button>

          <button
            onClick={() => onTabChange('library')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1 ${
              activeTab === 'library' ? 'bg-purple-600/30 text-white' : 'text-purple-300/70'
            }`}
          >
            <Library className="w-3 h-3" />
            <span>Library ({savedStoriesCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
