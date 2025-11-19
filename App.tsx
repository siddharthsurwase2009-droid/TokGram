import React, { useState } from 'react';
import { FeedProvider } from './context/FeedContext';
import Feed from './components/Feed';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreateModal from './components/CreateModal';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Discover from './components/Discover';
import { Heart, Search } from 'lucide-react';

export type ViewMode = 'feed' | 'reels';

const App: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // home, discover, reels, messages, notifications, profile
  
  // Home specific state (For switching between Following/For You inside Home tab)
  const [homeViewMode, setHomeViewMode] = useState<ViewMode>('feed');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Feed viewMode={homeViewMode} searchQuery="" />;
      case 'discover':
        return <Discover />;
      case 'reels':
        // Reels tab always shows reels view
        return <Feed viewMode="reels" searchQuery="" />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-center p-4 animate-in fade-in">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-800">
                    <Heart className="w-10 h-10 text-accent fill-accent animate-pulse" />
                </div>
                <h2 className="text-xl font-bold mb-2">Activity</h2>
                <p className="text-gray-500 text-sm">Notifications will appear here.</p>
            </div>
        );
      default:
        return <Feed viewMode={homeViewMode} searchQuery="" />;
    }
  };

  return (
    <FeedProvider>
      <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onOpenCreate={() => setIsCreateOpen(true)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 relative h-full overflow-hidden md:pl-[240px] flex flex-col">
          
          {/* Top Header - Only visible on Home Tab */}
          {activeTab === 'home' && (
            <header className="absolute top-0 left-0 right-0 z-30 pt-4 pb-2 px-4 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/80 to-transparent min-h-[60px] md:left-[240px]">
              {/* Search / Discover Button */}
              <button 
                onClick={() => setActiveTab('discover')}
                className="pointer-events-auto p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition shadow-lg"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Center Toggle */}
              <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-auto flex items-center space-x-6 bg-black/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-lg">
                <button 
                  onClick={() => setHomeViewMode('feed')}
                  className={`text-sm font-bold transition-all duration-300 ${homeViewMode === 'feed' ? 'text-white scale-105' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  Following
                </button>
                <div className="w-[1px] h-4 bg-white/20"></div>
                <button 
                  onClick={() => setHomeViewMode('reels')}
                  className={`text-sm font-bold transition-all duration-300 ${homeViewMode === 'reels' ? 'text-neon scale-105 shadow-neon drop-shadow-[0_0_5px_rgba(0,242,234,0.5)]' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  For You
                </button>
              </div>

              {/* Notifications Button */}
              <button 
                onClick={() => setActiveTab('notifications')}
                className="pointer-events-auto p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition shadow-lg relative"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-black"></span>
              </button>
            </header>
          )}

          {/* Content */}
          <main className="flex-1 w-full h-full relative">
            {renderContent()}
          </main>
        </div>

        {/* Modals */}
        {isCreateOpen && <CreateModal onClose={() => setIsCreateOpen(false)} />}

        {/* Mobile Navigation */}
        <Navbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onOpenCreate={() => setIsCreateOpen(true)} 
        />
      </div>
    </FeedProvider>
  );
};

export default App;