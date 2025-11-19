import React, { useState } from 'react';
import { Settings, Grid, PlayCircle, Bookmark, Lock, MapPin, Link as LinkIcon, TrendingUp, ChevronRight, DollarSign } from 'lucide-react';
import { useFeed } from '../context/FeedContext';
import SettingsModal from './SettingsModal';

const Profile: React.FC = () => {
  const { posts } = useFeed();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [showSettings, setShowSettings] = useState(false);

  const myPosts = posts; // In a real app, filter by current user

  return (
    <div className="w-full h-full bg-black overflow-y-auto pb-24 pt-12">
      {/* Header Actions */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/90 backdrop-blur z-30 border-b border-gray-800">
         <h1 className="text-lg font-bold flex items-center gap-1">
             you_creative_ai <span className="w-2 h-2 bg-red-500 rounded-full" title="Notification"></span>
         </h1>
         <div className="flex gap-4">
             <button onClick={() => setShowSettings(true)} aria-label="Settings">
                 <Settings className="w-6 h-6 text-white hover:rotate-90 transition duration-300" />
             </button>
         </div>
      </div>

      {/* Profile Info */}
      <div className="mt-8 px-4 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black p-1">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full rounded-full bg-gray-800" />
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black">
                    <span className="text-[10px] font-bold text-white block w-3 h-3 flex items-center justify-center">+</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-center">
                  <div>
                      <div className="font-bold text-lg">12</div>
                      <div className="text-xs text-gray-400">Posts</div>
                  </div>
                  <div>
                      <div className="font-bold text-lg">1.2M</div>
                      <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  <div>
                      <div className="font-bold text-lg">450</div>
                      <div className="text-xs text-gray-400">Following</div>
                  </div>
              </div>
          </div>

          {/* Bio */}
          <div className="space-y-1 mb-4">
              <h2 className="font-bold text-sm">AI Creator & Developer</h2>
              <p className="text-sm text-gray-300">Building the future with Gemini & Veo. 🌌</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" /> San Francisco, CA
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-400">
                  <LinkIcon className="w-3 h-3" /> tokgram.ai
              </div>
          </div>

          {/* Monetization / Dashboard Widget */}
          <div 
            className="bg-gradient-to-r from-gray-900 via-gray-900 to-green-950/30 rounded-lg p-3 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition border border-gray-800 group" 
            onClick={() => setShowSettings(true)}
          >
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-gray-800 rounded-full group-hover:bg-gray-700 transition">
                     <DollarSign className="w-4 h-4 text-green-400" />
                 </div>
                 <div>
                     <div className="text-sm font-bold text-white">Professional Dashboard</div>
                     <div className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                        <span>$1,240.50 earned</span>
                        <span className="text-gray-500">• 1.4k reach</span>
                     </div>
                 </div>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
              <button className="flex-1 bg-gray-800 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-700 transition">Edit Profile</button>
              <button className="flex-1 bg-gray-800 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-700 transition">Share Profile</button>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 sticky top-[60px] bg-black z-20">
          <button 
            onClick={() => setActiveTab('posts')} 
            className={`flex-1 py-3 flex justify-center ${activeTab === 'posts' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
            aria-label="Posts Tab"
          >
              <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('reels')} 
            className={`flex-1 py-3 flex justify-center ${activeTab === 'reels' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
            aria-label="Reels Tab"
          >
              <PlayCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('saved')} 
            className={`flex-1 py-3 flex justify-center ${activeTab === 'saved' ? 'border-b-2 border-white text-white' : 'text-gray-500'}`}
            aria-label="Saved Tab"
          >
              <Bookmark className="w-5 h-5" />
          </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-0.5">
          {activeTab === 'saved' ? (
              <div className="col-span-3 py-20 flex flex-col items-center text-gray-500">
                  <Lock className="w-12 h-12 mb-4 opacity-50" />
                  <h3 className="font-bold">Only you can see what you've saved</h3>
              </div>
          ) : (
              myPosts.map((post, idx) => (
                <div key={post.id + idx} className="aspect-square bg-gray-900 relative group">
                    {post.type === 'video' ? (
                        <video src={post.url} className="w-full h-full object-cover" />
                    ) : (
                        <img src={post.url} alt="" className="w-full h-full object-cover" />
                    )}
                    {post.type === 'video' && (
                         <div className="absolute top-2 right-2">
                             <PlayCircle className="w-4 h-4 text-white drop-shadow-md" />
                         </div>
                    )}
                </div>
              ))
          )}
      </div>

      {/* Settings/Privacy Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Profile;