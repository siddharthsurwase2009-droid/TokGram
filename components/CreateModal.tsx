import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, CloudUpload, Camera, Radio, Image as ImageIcon, Film } from 'lucide-react';
import { useFeed } from '../context/FeedContext';
import { MediaType } from '../types';

interface CreateModalProps {
  onClose: () => void;
}

type CreateMode = 'POST' | 'REEL' | 'STORY' | 'LIVE';

const CreateModal: React.FC<CreateModalProps> = ({ onClose }) => {
  const { addPost, addStory } = useFeed();
  const [mode, setMode] = useState<CreateMode>('POST');
  
  // Upload State
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Cleanup effect for preview URLs and Camera stream
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
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
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
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

    if (!previewUrl || !selectedFile) {
        alert("Please select a file first");
        return;
    }

    setIsPosting(true);
    try {
      const isVideo = selectedFile.type.startsWith('video');
      const mediaType = isVideo ? MediaType.VIDEO : MediaType.IMAGE;
      const commonId = Date.now().toString();

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
            caption: caption || (mode === 'REEL' ? '#reel' : 'Uploaded from gallery'),
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
      <div className={`bg-white w-full sm:w-[500px] ${mode === 'LIVE' ? 'h-[90vh]' : 'max-h-[90vh]'} overflow-hidden rounded-t-2xl sm:rounded-2xl flex flex-col border border-gray-200 relative shadow-2xl transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 z-10 bg-white">
            <h2 className="text-lg font-bold text-black">{getTitle()}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-gray-50 flex flex-col">
            {mode === 'LIVE' ? (
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
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition min-h-[300px] relative bg-white group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            selectedFile?.type.startsWith('video') ? (
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
                                onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setSelectedFile(null); }}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition"
                             >
                                 <X className="w-4 h-4" />
                             </button>
                         )}
                    </div>

                    {/* Caption Input (Only if file selected) */}
                    {previewUrl && (
                        <div className="mt-4 animate-in slide-in-from-bottom-2">
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder={mode === 'STORY' ? "Add text..." : "Write a caption..."}
                                className="w-full bg-white rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-black border border-gray-200 text-black shadow-sm resize-none h-24"
                            />
                            
                            <button 
                                onClick={handlePost}
                                disabled={isPosting}
                                className="w-full mt-4 bg-black text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPosting ? 'Uploading...' : (mode === 'STORY' ? 'Add to Story' : 'Share')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Bottom Mode Switcher */}
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
                        }}
                        className={`relative z-10 flex-1 py-2 text-xs font-bold text-center transition-colors duration-200 ${mode === m ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CreateModal;