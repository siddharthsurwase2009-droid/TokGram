import React, { useState, useRef } from 'react';
import { Settings, Grid, PlayCircle, Bookmark, Lock, MapPin, Link as LinkIcon, TrendingUp, ChevronRight, DollarSign, X, Camera, Check } from 'lucide-react';
import { useFeed } from '../context/FeedContext';
import SettingsModal from './SettingsModal';
import { fileToBase64 } from '../utils/helpers';

const Profile: React.FC = () => {
  const { posts } = useFeed();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [showSettings, setShowSettings] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState({
    username: 'you_creative_ai',
    displayName: 'AI Creator & Developer',
    bio: 'Building the future with Gemini & Veo. 🌌',
    location: 'San Francisco, CA',
    link: 'tokgram.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myPosts = posts; // In a real app, filter by current user

  const handleEditClick = () => {
      setEditForm(profile);
      setIsEditing(true);
  };

  const handleSaveProfile = () => {
      setProfile(editForm);
      setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
             const base64 = await fileToBase64(e.target.files[0]);
             setEditForm(prev => ({ ...prev, avatar: `data:${e.target.files![0].type};base64,${base64}` }));
          } catch (err) {
              console.error("Error uploading image", err);
          }
      }
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto pb-24 pt-12 relative">
      {/* Header Actions */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-white/90 backdrop-blur z-30 border-b border-gray-200 md:left-[240px]">
         <h1 className="text-lg font-bold flex items-center gap-1 text-black">
             {profile.username} <span className="w-2 h-2 bg-red-500 rounded-full" title="Notification"></span>
         </h1>
         <div className="flex gap-4">
             <button onClick={() => setShowSettings(true)} aria-label="Settings">
                 <Settings className="w-6 h-6 text-black hover:rotate-90 transition duration-300" />
             </button>
         </div>
      </div>

      {/* Profile Info */}
      <div className="mt-8 px-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white p-1">
                        <img src={profile.avatar} alt="avatar" className="w-full h-full rounded-full bg-gray-200 object-cover" />
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                    <span className="text-[10px] font-bold text-white block w-3 h-3 flex items-center justify-center">+</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-center text-black">
                  <div>
                      <div className="font-bold text-lg">12</div>
                      <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div>
                      <div className="font-bold text-lg">1.2M</div>
                      <div className="text-xs text-gray-500">Followers</div>
                  </div>
                  <div>
                      <div className="font-bold text-lg">450</div>
                      <div className="text-xs text-gray-500">Following</div>
                  </div>
              </div>
          </div>

          {/* Bio */}
          <div className="space-y-1 mb-4">
              <h2 className="font-bold text-sm text-black">{profile.displayName}</h2>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{profile.bio}</p>
              {profile.location && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" /> {profile.location}
                  </div>
              )}
              {profile.link && (
                  <div className="flex items-center gap-2 text-xs text-blue-500">
                      <LinkIcon className="w-3 h-3" /> {profile.link}
                  </div>
              )}
          </div>

          {/* Monetization / Dashboard Widget */}
          <div 
            className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition border border-gray-200 group" 
            onClick={() => setShowSettings(true)}
          >
             <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-full shadow-sm">
                     <DollarSign className="w-4 h-4 text-green-600" />
                 </div>
                 <div>
                     <div className="text-sm font-bold text-black">Professional Dashboard</div>
                     <div className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                        <span>$1,240.50 earned</span>
                        <span className="text-gray-500">• 1.4k reach</span>
                     </div>
                 </div>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
              <button onClick={handleEditClick} className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-bold text-black hover:bg-gray-200 transition">Edit Profile</button>
              <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-bold text-black hover:bg-gray-200 transition">Share Profile</button>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 sticky top-[60px] bg-white z-20">
          <button 
            onClick={() => setActiveTab('posts')} 
            className={`flex-1 py-3 flex justify-center ${activeTab === 'posts' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            aria-label="Posts Tab"
          >
              <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('reels')} 
            className={`flex-1 py-3 flex justify-center ${activeTab === 'reels' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
            aria-label="Reels Tab"
          >
              <PlayCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('saved')} 
            className={`flex-1 py-3 flex justify-center ${activeTab === 'saved' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
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
                <div key={post.id + idx} className="aspect-square bg-gray-100 relative group border border-white">
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

      {/* Edit Profile Modal */}
      {isEditing && (
          <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col animate-in slide-in-from-bottom-10">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0">
                  <button onClick={() => setIsEditing(false)} className="text-black">
                      <X className="w-6 h-6" />
                  </button>
                  <h2 className="font-bold text-lg text-black">Edit Profile</h2>
                  <button onClick={handleSaveProfile} className="text-blue-500">
                      <Check className="w-6 h-6" />
                  </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 max-w-md mx-auto w-full">
                  {/* Avatar Edit */}
                  <div className="flex flex-col items-center mb-8">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100">
                              <img src={editForm.avatar} alt="avatar preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                              <Camera className="w-8 h-8 text-gray-600 drop-shadow-lg opacity-80 group-hover:scale-110 transition" />
                          </div>
                      </div>
                      <span className="text-blue-500 text-sm font-bold mt-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          Change profile photo
                      </span>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                        accept="image/*" 
                      />
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                      <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-bold uppercase">Name</label>
                          <input 
                              type="text" 
                              value={editForm.displayName} 
                              onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                              className="w-full bg-white border-b border-gray-300 py-2 text-black focus:border-black focus:outline-none transition-colors"
                              placeholder="Display Name"
                          />
                      </div>
                      
                      <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-bold uppercase">Username</label>
                          <input 
                              type="text" 
                              value={editForm.username} 
                              onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                              className="w-full bg-white border-b border-gray-300 py-2 text-black focus:border-black focus:outline-none transition-colors"
                              placeholder="Username"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-bold uppercase">Bio</label>
                          <textarea 
                              value={editForm.bio} 
                              onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                              className="w-full bg-white border-b border-gray-300 py-2 text-black focus:border-black focus:outline-none transition-colors resize-none h-20"
                              placeholder="Write something about yourself..."
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-bold uppercase">Location</label>
                          <input 
                              type="text" 
                              value={editForm.location} 
                              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                              className="w-full bg-white border-b border-gray-300 py-2 text-black focus:border-black focus:outline-none transition-colors"
                              placeholder="City, Country"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs text-gray-500 font-bold uppercase">Website</label>
                          <input 
                              type="text" 
                              value={editForm.link} 
                              onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                              className="w-full bg-white border-b border-gray-300 py-2 text-black focus:border-black focus:outline-none transition-colors"
                              placeholder="yoursite.com"
                          />
                      </div>
                  </div>

                   {/* Veo/Gemini plug for fun */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500 text-center">
                      Information updated here will be reflected across your Tokstagram AI presence.
                  </div>
              </div>
          </div>
      )}

      {/* Settings/Privacy Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Profile;