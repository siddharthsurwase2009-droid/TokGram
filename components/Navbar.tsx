import React from 'react';
import { Home, Film, PlusSquare, MessageCircle, User } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreate: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onOpenCreate }) => {
  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => onTabChange(id)}
      className={`flex flex-col items-center transition-colors ${activeTab === id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
    >
      <Icon className={`w-6 h-6 ${activeTab === id ? 'fill-current' : ''}`} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800 z-40 px-6 py-2 pb-4 flex justify-between items-center md:hidden">
      <NavItem id="home" icon={Home} label="Home" />
      <NavItem id="reels" icon={Film} label="Reels" />

      <button 
        onClick={onOpenCreate}
        className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-neon to-blue-500 rounded-xl shadow-[0_0_15px_rgba(0,242,234,0.4)] hover:scale-105 transition -mt-5 border-2 border-black group"
      >
        <PlusSquare className="w-6 h-6 text-black group-hover:scale-110 transition" />
      </button>

      <NavItem id="messages" icon={MessageCircle} label="Inbox" />
      <NavItem id="profile" icon={User} label="Profile" />
    </div>
  );
};

export default Navbar;