import React from 'react';
import { Home, Search, PlusSquare, User, Film, Heart, Menu, Download } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onOpenCreate }) => {
  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => onTabChange(id)}
      className={`flex items-center space-x-4 p-3 w-full rounded-xl transition-all duration-200 group ${
        activeTab === id ? 'font-bold text-black bg-gray-100' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
      }`}
    >
      <Icon className={`w-7 h-7 transition-transform group-hover:scale-110 ${activeTab === id ? 'fill-current' : ''}`} />
      <span className="text-base">{label}</span>
    </button>
  );

  return (
    <div className="hidden md:flex flex-col w-[240px] h-full fixed left-0 top-0 bg-white border-r border-gray-200 z-50 px-3 py-5">
      {/* Logo */}
      <div className="px-3 mb-8 pt-2 cursor-pointer" onClick={() => onTabChange('home')}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'cursive' }}>
          Tokstagram
        </h1>
      </div>

      {/* Nav Items */}
      <div className="flex-1 space-y-2">
        <NavItem id="home" icon={Home} label="Home" />
        <NavItem id="discover" icon={Search} label="Search" />
        <NavItem id="reels" icon={Film} label="Reels" />
        <NavItem id="notifications" icon={Heart} label="Notifications" />
        
        <div onClick={onOpenCreate} className="flex items-center space-x-4 p-3 w-full rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-black cursor-pointer group">
             <PlusSquare className="w-7 h-7 transition-transform group-hover:scale-110" />
             <span className="text-base">Create</span>
        </div>
        
        <NavItem id="profile" icon={User} label="Profile" />
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-4 border-t border-gray-200 space-y-1">
         <button onClick={() => alert("Downloading Tokstagram Desktop App...")} className="flex items-center space-x-4 p-3 w-full rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-all group">
            <Download className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="text-base">Get App</span>
         </button>
         <button className="flex items-center space-x-4 p-3 w-full rounded-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-all group">
            <Menu className="w-7 h-7 group-hover:rotate-90 transition-transform" />
            <span className="text-base">More</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;