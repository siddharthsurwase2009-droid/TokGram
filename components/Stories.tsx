import React from 'react';
import { Plus } from 'lucide-react';

const Stories: React.FC = () => {
  const stories = [
    { id: 'user', name: 'Your Story', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', isUser: true },
    { id: '1', name: 'alex_dev', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: '2', name: 'sarah_art', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: '3', name: 'mike_vids', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    { id: '4', name: 'jess_travel', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jess' },
    { id: '5', name: 'dave_code', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-4 bg-white border-b border-gray-200">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[72px] cursor-pointer group">
          <div className={`relative p-[3px] rounded-full transition-transform transform group-hover:scale-105 ${story.isUser ? '' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden relative bg-gray-100">
              <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
               {story.isUser && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                     <div className="bg-blue-500 rounded-full p-1 absolute bottom-0 right-0 border-2 border-white">
                        <Plus className="w-3 h-3 text-white" />
                     </div>
                </div>
              )}
            </div>
          </div>
          <span className="text-[11px] text-gray-700 w-full text-center truncate px-1">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;