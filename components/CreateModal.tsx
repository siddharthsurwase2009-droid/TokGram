import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, CloudUpload, Camera, Radio, Image as ImageIcon, Film, Save, Trash2, FileText, ChevronLeft, Music, Play, Plus } from 'lucide-react';
import { useFeed } from '../context/FeedContext';
import { MediaType } from '../types';
import { fileToBase64 } from '../utils/helpers';

interface CreateModalProps {
  onClose: () => void;
}

type CreateMode = 'POST' | 'REEL' | 'STORY' | 'LIVE';

interface Draft {
    id: string;
    mode: CreateMode;
    caption: string;
    mediaData: string;
    mediaType: string;
    date: number;
    music?: { name: string; url?: string };
}

const PREDEFINED_MUSIC = [
    { id: '1', name: 'Viral Hits 2024', artist: 'Trending' },
    { id: '2', name: 'Chill Lo-Fi', artist: 'Beats' },
    { id: '3', name: 'Upbeat Summer', artist: 'Pop' },
    { id: '4', name: 'Dramatic Intro', artist: 'Cinematic' },
    { id: '5', name: 'Electronic Vibe', artist: 'Dance' },
    { id: '6', name: 'Piano Dreams', artist: 'Classical' },
];

const CreateModal: React.FC<CreateModalProps> = ({ onClose }) => {
  const { addPost, addStory } = useFeed();
  const [mode, setMode] = useState<CreateMode>('POST');
  
  // Upload State
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>(''); // Track mime type explicitly
  
  // Music State (Reels only)
  const [selectedMusic, setSelectedMusic] = useState<{name: string, url?: string} | null>(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  
  // Drafts State
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  // Live Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Load drafts from local storage on mount
  useEffect(() => {
      const saved = localStorage.getItem('tokstagram_drafts');
      if (saved) {
          try {
              setDrafts(JSON.parse(saved));
          } catch (e) {
              console.error("Failed to load drafts", e);
          }
      }
  }, []);

  // Cleanup effect for preview URLs (only if they are object URLs) and Camera stream
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [previewUrl, stream]);

  // Handle Camera for Live Mode
  useEffect(() => {
    const startCamera = async () => {
      if (mode === 'LIVE') {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Could not access camera. Please check permissions.");
        }
      } else {
        // Stop camera if switching away from LIVE
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    };

    startCamera();
  }, [mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 500 * 1024 * 1024) {
          alert("File too large. Max 500MB.");
          return;
      }
      
      // Validate file type based on mode
      if (mode === 'REEL' && !file.type.startsWith('video/')) {
          alert("Reels must be video files.");
          return;
      }

      setSelectedFile(file);
      setMediaType(file.type);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (!file.type.startsWith('audio/')) {
              alert("Please select an audio file.");
              return;
          }
          const url = URL.createObjectURL(file);
          setSelectedMusic({ name: file.name.replace(/\.[^/.]+$/, ""), url });
          setShowMusicPicker(false);
      }
  };

  const handleSaveDraft = async () => {
      if (!previewUrl) return;

      const id = Date.now().toString();
      let dataUrl = previewUrl;

      // If we have a selected file (blob url), convert to base64 for storage
      if (selectedFile) {
          try {
              const base64 = await fileToBase64(selectedFile);
              dataUrl = `data:${selectedFile.type};base64,${base64}`;
          } catch (e) {
              alert("Failed to process file for draft.");
              return;
          }
      }

      const newDraft: Draft = {
          id,
          mode,
          caption,
          mediaData: dataUrl,
          mediaType: mediaType || (mode === 'REEL' ? 'video/mp4' : 'image/jpeg'),
          date: Date.now(),
          music: selectedMusic || undefined
      };

      const updatedDrafts = [newDraft, ...drafts];
      setDrafts(updatedDrafts);
      localStorage.setItem('tokstagram_drafts', JSON.stringify(updatedDrafts));
      
      // Reset form
      setPreviewUrl(null);
      setSelectedFile(null);
      setCaption('');
      setMediaType('');
      setSelectedMusic(null);
      setShowDrafts(true);
  };

  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm("Delete this draft?")) {
          const updated = drafts.filter(d => d.id !== id);
          setDrafts(updated);
          localStorage.setItem('tokstagram_drafts', JSON.stringify(updated));
      }
  };

  const handleLoadDraft = (draft: Draft) => {
      setMode(draft.mode);
      setCaption(draft.caption);
      setPreviewUrl(draft.mediaData);
      setMediaType(draft.mediaType);
      setSelectedMusic(draft.music || null);
      setSelectedFile(null); // Drafts don't restore the File object, just the data
      setShowDrafts(false);
  };

  const handlePost = async () => {
    if (mode === 'LIVE') {
        setIsLive(!isLive);
        if (!isLive) {
            alert("You are now LIVE! (Simulated)");
        } else {
            alert("Ended Live Video.");
            onClose();
        }
        return;
    }

    if (!previewUrl) {
        alert("Please select a file first");
        return;
    }

    setIsPosting(true);
    try {
      const isVideo = mediaType.startsWith('video');
      const commonId = Date.now().toString();
      const finalCaption = selectedMusic ? `${caption} 🎵 ${selectedMusic.name}` : caption;

      if (mode === 'STORY') {
        addStory({
            id: commonId,
            username: 'you',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            mediaUrl: previewUrl,
            type: isVideo ? 'video' : 'image',
            isUser: true
        });
        alert("Added to Story!");
      } else {
        // Post or Reel
        addPost({
            id: commonId,
            type: isVideo ? 'video' : 'image',
            url: previewUrl,
            author: 'you',
            likes: 0,
            caption: finalCaption || (mode === 'REEL' ? '#reel' : 'Uploaded from gallery'),
            aspectRatio: mode === 'REEL' ? '9:16' : '1:1',
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    } finally {
      setIsPosting(false);
    }
  };

  const getAcceptType = () => {
      if (mode === 'REEL') return "video/mp4,video/quicktime";
      return "image/*,video/mp4,video/quicktime";
  };

  const getTitle = () => {
      if (showMusicPicker) return 'Select Music';
      if (showDrafts) return 'Drafts';
      switch(mode) {
          case 'POST': return 'New Post';
          case 'REEL': return 'New Reel';
          case 'STORY': return 'Add to Story';
          case 'LIVE': return 'Live';
          default: return 'Create';
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white w-full sm:w-[500px] ${mode === 'LIVE' && !showDrafts ? 'h-[90vh]' : 'max-h-[90vh] min-h-[600px]'} overflow-hidden rounded-t-2xl sm:rounded-2xl flex flex-col border border-gray-200 relative shadow-2xl transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 z-10 bg-white">
            <div className="flex items-center gap-2">
                {(showDrafts || showMusicPicker) && (
                    <button onClick={() => {
                        if (showMusicPicker) setShowMusicPicker(false);
                        else setShowDrafts(false);
                    }} className="p-1 hover:bg-gray-100 rounded-full">
                        <ChevronLeft className="w-6 h-6 text-black" />
                    </button>
                )}
                <h2 className="text-lg font-bold text-black">{getTitle()}</h2>
            </div>
            <div className="flex items-center gap-2">
                {!showDrafts && !showMusicPicker && drafts.length > 0 && !previewUrl && (
                    <button 
                        onClick={() => setShowDrafts(true)}
                        className="text-xs font-bold text-gray-500 hover:text-black px-3 py-1.5 bg-gray-100 rounded-full flex items-center gap-1"
                    >
                        <FileText className="w-3 h-3" /> Drafts ({drafts.length})
                    </button>
                )}
                <button onClick={onClose} className="text-gray-500 hover:text-black">
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-gray-50 flex flex-col overflow-hidden">
            {showDrafts ? (
                <div className="flex-1 overflow-y-auto p-4">
                    {drafts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <FileText className="w-12 h-12 mb-2 opacity-50" />
                            <p>No drafts saved</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {drafts.map((draft) => (
                                <div 
                                    key={draft.id} 
                                    onClick={() => handleLoadDraft(draft)}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-black cursor-pointer group border border-gray-200"
                                >
                                    {draft.mediaType.startsWith('video') ? (
                                        <video src={draft.mediaData} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                                    ) : (
                                        <img src={draft.mediaData} alt="draft" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                                    )}
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-2">
                                        <p className="text-[10px] text-white font-medium truncate">{draft.caption || 'Untitled'}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[9px] text-gray-300 uppercase">{draft.mode}</span>
                                            <button 
                                                onClick={(e) => handleDeleteDraft(draft.id, e)}
                                                className="p-1 bg-white/20 hover:bg-red-500/80 rounded-full text-white transition"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : showMusicPicker ? (
                <div className="flex-1 overflow-y-auto p-4 bg-white animate-in slide-in-from-right">
                    <div className="space-y-4">
                        <div 
                            onClick={() => musicInputRef.current?.click()}
                            className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black">
                                <CloudUpload className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-black">Upload Your Audio</h4>
                                <p className="text-xs text-gray-500">MP3 or WAV from device</p>
                            </div>
                            <input 
                                type="file" 
                                ref={musicInputRef}
                                className="hidden"
                                accept="audio/*"
                                onChange={handleMusicUpload}
                            />
                        </div>

                        <h3 className="text-xs font-bold text-gray-500 uppercase mt-4">Trending Sounds</h3>
                        <div className="space-y-2">
                            {PREDEFINED_MUSIC.map((track) => (
                                <div 
                                    key={track.id}
                                    onClick={() => {
                                        setSelectedMusic({ name: `${track.name} - ${track.artist}` });
                                        setShowMusicPicker(false);
                                    }}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 cursor-pointer group border border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white">
                                            <Music className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-black group-hover:text-blue-600 transition">{track.name}</h4>
                                            <p className="text-xs text-gray-500">{track.artist}</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition">
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : mode === 'LIVE' ? (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 px-2 py-1 rounded text-white text-xs font-bold animate-pulse">
                        LIVE
                    </div>
                    
                    <div className="absolute bottom-20 flex flex-col items-center w-full px-8">
                        <button 
                            onClick={handlePost}
                            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${isLive ? 'border-red-500 bg-white' : 'border-white bg-red-600 hover:scale-110'}`}
                        >
                            <div className={`transition-all ${isLive ? 'w-8 h-8 bg-red-600 rounded-sm' : 'w-0 h-0'}`}></div>
                            {!isLive && <span className="font-bold text-white text-[10px] uppercase tracking-wider">Go Live</span>}
                        </button>
                        <p className="text-white mt-4 text-sm font-medium shadow-black drop-shadow-md">
                            {isLive ? 'Broadcasting...' : 'Tap to start live video'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="p-6 flex flex-col h-full overflow-y-auto">
                     {/* File Upload Area */}
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition min-h-[300px] relative bg-white group shrink-0"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            mediaType.startsWith('video') ? (
                                <video src={previewUrl} className={`w-full h-full object-contain rounded-lg shadow-sm ${mode === 'REEL' ? 'max-h-[400px]' : 'max-h-[300px]'}`} controls />
                            ) : (
                                <img src={previewUrl} alt="preview" className="w-full h-full object-contain rounded-lg shadow-sm max-h-[400px]" />
                            )
                        ) : (
                            <div className="flex flex-col items-center text-center p-8">
                                <div className="bg-gray-100 p-5 rounded-full mb-4 group-hover:scale-110 transition duration-300">
                                    {mode === 'REEL' ? <Film className="w-8 h-8 text-gray-400" /> : <CloudUpload className="w-8 h-8 text-gray-400" />}
                                </div>
                                <p className="text-lg font-bold text-gray-700">Select from device</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {mode === 'REEL' ? 'MP4 or MOV up to 500MB' : 'Photos and Videos up to 500MB'}
                                </p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            onChange={handleFileChange} 
                            accept={getAcceptType()}
                        />
                         {previewUrl && (
                             <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setPreviewUrl(null); 
                                    setSelectedFile(null); 
                                    setMediaType('');
                                    setSelectedMusic(null);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
                             >
                                 <X className="w-4 h-4" />
                             </button>
                         )}
                    </div>

                    {/* Caption Input & Tools (Only if file selected) */}
                    {previewUrl && (
                        <div className="mt-4 animate-in slide-in-from-bottom-2 flex-1">
                            {/* Reel Specific Tools */}
                            {mode === 'REEL' && (
                                <div className="mb-3">
                                    {selectedMusic ? (
                                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Music className="w-4 h-4 text-blue-500" />
                                                <span className="text-xs font-bold text-blue-700">{selectedMusic.name}</span>
                                            </div>
                                            <button onClick={() => setSelectedMusic(null)} className="text-gray-400 hover:text-red-500">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShowMusicPicker(true)}
                                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-700 transition"
                                        >
                                            <Music className="w-4 h-4" /> Add Music
                                        </button>
                                    )}
                                </div>
                            )}

                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder={mode === 'STORY' ? "Add text..." : "Write a caption..."}
                                className="w-full bg-white rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black border border-gray-200 text-black shadow-sm resize-none h-24"
                            />
                            
                            <div className="flex gap-2 mt-4">
                                <button 
                                    onClick={handleSaveDraft}
                                    className="flex-1 bg-gray-100 text-black font-bold py-3.5 rounded-xl shadow-sm hover:bg-gray-200 transition flex items-center justify-center gap-2 border border-gray-200"
                                >
                                    <Save className="w-4 h-4" /> Draft
                                </button>
                                <button 
                                    onClick={handlePost}
                                    disabled={isPosting}
                                    className="flex-[2] bg-black text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPosting ? 'Uploading...' : (mode === 'STORY' ? 'Add to Story' : 'Share')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Bottom Mode Switcher */}
        {!showDrafts && !showMusicPicker && (
            <div className="bg-white p-2 border-t border-gray-100">
                <div className="flex justify-between items-center bg-gray-100 rounded-xl p-1 relative">
                    {/* Active Indicator Background */}
                    <div 
                        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out"
                        style={{ 
                            width: '24%', 
                            left: mode === 'POST' ? '0.5%' : mode === 'REEL' ? '25.5%' : mode === 'STORY' ? '50.5%' : '75.5%' 
                        }}
                    ></div>

                    {(['POST', 'REEL', 'STORY', 'LIVE'] as CreateMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => {
                                setMode(m);
                                // Reset state when switching modes
                                setPreviewUrl(null);
                                setSelectedFile(null);
                                setCaption('');
                                setMediaType('');
                                setSelectedMusic(null);
                            }}
                            className={`relative z-10 flex-1 py-2 text-xs font-bold text-center transition-colors duration-200 ${mode === m ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default CreateModal;