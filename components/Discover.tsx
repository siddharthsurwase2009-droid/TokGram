import React, { useState } from 'react';
import { Search, TrendingUp, Hash, User } from 'lucide-react';
import { useFeed } from '../context/FeedContext';

const Discover: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { posts } = useFeed();

  // Generate some dummy trending items if posts are scarce
  const gridItems = [...posts, ...posts, ...posts].slice(0, 12); 

  return (
    <div className="w-full h-full bg-black overflow-y-auto pb-20 pt-12">
       {/* Sticky Search Header */}
       <div className="fixed top-0 left-0 right-0 z-30 p-4 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search ID, users, or tags..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all text-white placeholder-gray-500"
              />
          </div>
          
          {/* Quick Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-md text-xs font-bold text-white whitespace-nowrap hover:bg-gray-700">
                 <TrendingUp className="w-3 h-3" /> Trending
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-md text-xs font-bold text-white whitespace-nowrap hover:bg-gray-700">
                 <User className="w-3 h-3" /> Accounts
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-md text-xs font-bold text-white whitespace-nowrap hover:bg-gray-700">
                 <Hash className="w-3 h-3" /> Tags
              </button>
              <button className="px-3 py-1.5 bg-gray-800 rounded-md text-xs font-bold text-white whitespace-nowrap hover:bg-gray-700">
                 Audio
              </button>
          </div>
       </div>

       {/* Content Grid */}
       <div className="mt-28 px-1">
          {searchTerm ? (
              <div className="p-4 text-center text-gray-500 mt-10">
                  <p>Searching for "{searchTerm}"...</p>
                  <p className="text-xs mt-2">Try searching for specific User IDs like @creative_soul</p>
              </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
                {gridItems.map((post, index) => (
                    <div 
                        key={`${post.id}-${index}`} 
                        className={`relative bg-gray-900 overflow-hidden aspect-square group cursor-pointer ${index === 2 ? 'row-span-2 col-span-2 aspect-auto' : ''}`}
                    >
                        {post.type === 'image' ? (
                            <img src={post.url} alt="discover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            <video src={post.url} className="w-full h-full object-cover" muted />
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
                            <span className="text-xs font-bold text-white drop-shadow-md">@{post.author}</span>
                        </div>
                    </div>
                ))}
            </div>
          )}
       </div>
    </div>
  );
};

export default Discover;