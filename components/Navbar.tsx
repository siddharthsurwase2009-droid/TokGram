import React from 'react';
import { Home, Search, PlusSquare, User, Zap } from 'lucide-react';

interface NavbarProps {
  onOpenCreate: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCreate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-gray-800 z-40 px-6 py-3 flex justify-between items-center">
      <button className="flex flex-col items-center text-white">
        <Home className="w-6 h-6" />
        <span className="text-[10px] mt-1">Home</span>
      </button>
      
      <button className="flex flex-col items-center text-gray-500 hover:text-white transition">
        <Search className="w-6 h-6" />
        <span className="text-[10px] mt-1">Discover</span>
      </button>

      <button 
        onClick={onOpenCreate}
        className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-neon to-blue-500 rounded-xl shadow-lg shadow-neon/30 hover:scale-105 transition -mt-6 border-2 border-black"
      >
        <PlusSquare className="w-6 h-6 text-black" />
      </button>

      <button className="flex flex-col items-center text-gray-500 hover:text-white transition">
        <Zap className="w-6 h-6" />
        <span className="text-[10px] mt-1">Activity</span>
      </button>

      <button className="flex flex-col items-center text-gray-500 hover:text-white transition">
        <User className="w-6 h-6" />
        <span className="text-[10px] mt-1">Profile</span>
      </button>
    </div>
  );
};

export default Navbar;
