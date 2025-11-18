import React, { useState } from 'react';
import { FeedProvider } from './context/FeedContext';
import Feed from './components/Feed';
import Navbar from './components/Navbar';
import CreateModal from './components/CreateModal';

export type ViewMode = 'feed' | 'reels';

const App: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('feed');

  return (
    <FeedProvider>
      <div className="fixed inset-0 bg-black text-white flex flex-col font-sans overflow-hidden">
        {/* Top Header */}
        <header className="absolute top-0 left-0 right-0 z-30 pt-4 pb-2 flex justify-center items-center pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center space-x-6 pointer-events-auto bg-black/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg">
            <button 
              onClick={() => setViewMode('feed')}
              className={`text-sm font-bold transition-all duration-300 ${viewMode === 'feed' ? 'text-white scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Following
            </button>
            <div className="w-[1px] h-4 bg-white/20"></div>
            <button 
              onClick={() => setViewMode('reels')}
              className={`text-sm font-bold transition-all duration-300 ${viewMode === 'reels' ? 'text-neon scale-105 shadow-neon drop-shadow-[0_0_5px_rgba(0,242,234,0.5)]' : 'text-gray-400 hover:text-gray-200'}`}
            >
              For You
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full h-full relative">
          <Feed viewMode={viewMode} />
        </main>

        {/* Modals */}
        {isCreateOpen && <CreateModal onClose={() => setIsCreateOpen(false)} />}

        {/* Navigation */}
        <div className="absolute bottom-0 w-full z-40">
           <Navbar onOpenCreate={() => setIsCreateOpen(true)} />
        </div>
      </div>
    </FeedProvider>
  );
};

export default App;