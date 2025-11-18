import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, Sparkles, Film, Music2, MoreHorizontal } from 'lucide-react';
import { analyzeVideo, editImage } from '../services/gemini';
import { ViewMode } from '../App';

interface PostItemProps {
  post: Post;
  viewMode: ViewMode;
}

const PostItem: React.FC<PostItemProps> = ({ post, viewMode }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Analysis/Edit State
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Editing State
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play logic for Reels mode when simplified
    if (viewMode === 'reels' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [viewMode]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAnalyze = async () => {
    if (!analysisPrompt.trim()) return;
    setIsProcessing(true);
    try {
      let result = "";
      if (post.url.startsWith('blob:') || post.url.startsWith('data:')) {
         const response = await fetch(post.url);
         const blob = await response.blob();
         const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(blob);
         });
         
         if (post.type === 'video') {
            result = await analyzeVideo(base64, 'video/mp4', analysisPrompt);
         } else {
             result = "Analysis only available for videos in this view.";
         }
      } else {
        result = "⚠️ Cannot analyze external feed videos due to browser CORS restrictions. Try analyzing a video you generate!";
      }
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisResult("Error analyzing content: " + error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    setIsProcessing(true);
    try {
        let base64 = '';
        let mimeType = 'image/jpeg';
        let fetchUrl = post.url;

        // Handle edit on top of edit
        if (editedImageUrl) fetchUrl = editedImageUrl;

        if (fetchUrl.startsWith('http')) {
             try {
                const res = await fetch(fetchUrl);
                const blob = await res.blob();
                mimeType = blob.type;
                base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                alert("Cannot edit this external image due to CORS.");
                setIsProcessing(false);
                return;
            }
        } else {
             const response = await fetch(fetchUrl);
             const blob = await response.blob();
             mimeType = blob.type;
             base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(blob);
             });
        }

        const resultUrl = await editImage(base64, mimeType, editPrompt);
        setEditedImageUrl(resultUrl);
    } catch (error) {
        console.error(error);
        alert("Failed to edit image");
    } finally {
        setIsProcessing(false);
    }
  };

  // --- Render Helpers ---

  const renderMedia = (isReels: boolean) => {
    const commonClasses = isReels 
      ? "w-full h-full object-cover" 
      : "w-full h-auto object-contain max-h-[500px] bg-black";

    if (post.type === 'image') {
      return <img src={editedImageUrl || post.url} alt={post.caption} className={commonClasses} />;
    }
    return (
      <video 
        ref={videoRef}
        src={post.url} 
        className={commonClasses}
        loop
        playsInline
        controls={!isReels}
        autoPlay={isReels}
        muted={isReels}
      />
    );
  };

  const ActionButton = ({ icon: Icon, label, onClick, active, colorClass = "text-accent" }: any) => (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
      <div 
        onClick={onClick} 
        className={`p-3 rounded-full transition-all ${viewMode === 'reels' ? 'bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm' : 'hover:bg-gray-800'} ${active ? 'scale-110' : ''}`}
      >
        <Icon className={`w-7 h-7 transition-colors ${active ? `fill-current ${colorClass}` : 'text-white'}`} />
      </div>
      {label && <span className="text-xs font-medium text-white shadow-black drop-shadow-md">{label}</span>}
    </div>
  );

  // --- REELS LAYOUT ---
  if (viewMode === 'reels') {
    return (
      <div className="w-full h-full snap-start relative bg-black overflow-hidden">
        {/* Media Layer */}
        <div className="absolute inset-0">
          {renderMedia(true)}
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none"></div>
        </div>

        {/* Right Sidebar Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold border-2 border-white">
                        {post.author[0].toUpperCase()}
                    </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-accent rounded-full p-0.5">
                     <div className="w-3 h-3 flex items-center justify-center text-[8px] font-bold">+