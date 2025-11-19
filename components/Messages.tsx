import React, { useState } from 'react';
import { ArrowLeft, Search, Edit, Camera, Phone, Video } from 'lucide-react';

const Messages: React.FC = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const chats = [
    { id: '1', user: 'creative_soul', msg: 'Loved your new reel! 🔥', time: '2m', active: true, avatar: 'C' },
    { id: '2', user: 'film_maker_x', msg: 'Collab soon?', time: '1h', active: false, avatar: 'F' },
    { id: '3', user: 'artistic_mind', msg: 'Sent a reel', time: '5h', active: true, avatar: 'A' },
    { id: '4', user: 'travel_bug', msg: 'Where was that taken?', time: '1d', active: false, avatar: 'T' },
    { id: '5', user: 'music_lover', msg: 'Liked a message', time: '2d', active: false, avatar: 'M' },
  ];

  if (activeChat) {
    const chatUser = chats.find(c => c.id === activeChat);
    return (
      <div className="w-full h-full flex flex-col bg-black animate-in slide-in-from-right">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveChat(null)} className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                  {chatUser?.avatar}
               </div>
               <div className="flex flex-col">
                 <span className="text-sm font-bold">{chatUser?.user}</span>
                 <span className="text-[10px] text-gray-400">Active now</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <Phone className="w-5 h-5" />
            <Video className="w-5 h-5" />
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
          <div className="flex justify-center text-xs text-gray-500 my-4">Today</div>
          
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[70%] text-sm">
              Hey! Saw your latest post. It's amazing! 🤩
            </div>
          </div>
          
          <div className="flex justify-end">
             <div className="bg-blue-600 rounded-2xl rounded-tr-none px-4 py-2 max-w-[70%] text-sm text-white">
              Thanks! I used the new Veo model to generate it.
            </div>
          </div>

          <div className="flex justify-start">
             <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[70%] text-sm">
               {chatUser?.msg}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-gray-800 bg-black flex items-center gap-3 mb-[60px]">
          <div className="bg-gray-800 p-2 rounded-full text-blue-400">
            <Camera className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Message..." 
            className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition"
          />
          <span className="text-sm font-bold text-blue-500 cursor-pointer">Send</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col pb-20 bg-black pt-12">
      {/* Messages List Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold">Messages</h1>
           <div className="bg-red-500 text-[10px] font-bold px-1.5 rounded-full">3</div>
        </div>
        <Edit className="w-6 h-6 text-white" />
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-gray-900 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none text-white"
          />
        </div>
      </div>

      {/* Active Users (Stories style) */}
      <div className="px-4 mb-6 flex gap-4 overflow-x-auto no-scrollbar">
        {chats.map((chat) => (
            <div key={chat.id} className="flex flex-col items-center space-y-1 min-w-[60px]">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold border-2 border-black">
                         {chat.avatar}
                    </div>
                    {chat.active && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>}
                </div>
                <span className="text-[10px] text-gray-400 truncate w-full text-center">{chat.user}</span>
            </div>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between px-4 mb-2">
             <h3 className="text-sm font-bold">Messages</h3>
             <span className="text-xs text-blue-400">Requests</span>
        </div>
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => setActiveChat(chat.id)}
            className="px-4 py-3 flex items-center justify-between hover:bg-gray-900/50 cursor-pointer active:bg-gray-900 transition"
          >
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold">
                 {chat.avatar}
               </div>
               <div>
                 <h4 className="text-sm font-medium">{chat.user}</h4>
                 <p className={`text-xs ${chat.active ? 'text-white font-semibold' : 'text-gray-500'}`}>
                    {chat.msg} • {chat.time}
                 </p>
               </div>
            </div>
            {chat.active && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;