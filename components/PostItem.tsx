import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, Sparkles, Film, Music2, MoreHorizontal, X, Gift, Flag, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analyzeVideo, editImage } from '../services/gemini';
import { ViewMode } from '../App';

interface PostItemProps {
  post: Post;
  viewMode: ViewMode;
}

const PostItem: React.FC<PostItemProps> = ({ post, viewMode }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGiftAnimation, setShowGiftAnimation] = useState(false);

  // Safety / Menu State
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  // Analysis/Edit State
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Editing State
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-play logic for Reels mode
    if (viewMode === 'reels' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true; // Start muted to allow autoplay
      videoRef.current.play().catch((e) => console.log("Autoplay prevented:", e));
    } else if (viewMode === 'feed' && videoRef.current) {
        videoRef.current.pause();
    }
  }, [viewMode]);

  // Click outside options menu to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    // If user double taps, we always like the post (if not already liked)
    // We also show the animation regardless
    if (!isLiked) {
        handleLike();
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  const handleGift = () => {
    setShowGiftAnimation(true);
    setTimeout(() => setShowGiftAnimation(false), 2000);
  };

  const handleAnalyze = async () => {
    if (!analysisPrompt.trim()) return;
    setIsProcessing(true);
    try {
      let result = "";
      // Handle both blob URLs (generated) and external URLs
      let fetchUrl = post.url;
      
      const response = await fetch(fetchUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });
      
      if (post.type === 'video') {
        result = await analyzeVideo(base64, 'video/mp4', analysisPrompt);
      } else {
         result = "Video analysis is best suited for video content.";
      }
      
      setAnalysisResult(result);
    } catch (error: any) {
      setAnalysisResult("Error analyzing content. If this is an external video, CORS might be blocking access. " + error.message);
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
        let fetchUrl = editedImageUrl || post.url;

        const response = await fetch(fetchUrl);
        const blob = await response.blob();
        mimeType = blob.type;
        base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(blob);
        });

        const resultUrl = await editImage(base64, mimeType, editPrompt);
        setEditedImageUrl(resultUrl);
        setEditPrompt('');
    } catch (error) {
        console.error(error);
        alert("Failed to edit image. Ensure it is a generated image or allows CORS.");
    } finally {
        setIsProcessing(false);
    }
  };

  const submitReport = () => {
     setIsReportSubmitted(true);
     setTimeout(() => {
         setShowReportModal(false);
         setIsReportSubmitted(false);
         setReportReason(null);
         setShowOptionsMenu(false);
         alert("Thanks for reporting. We will review this post shortly.");
     }, 2000);
  };

  const renderMedia = (isReels: boolean) => {
    const commonClasses = isReels 
      ? "w-full h-full object-cover" 
      : "w-full h-auto object-contain max-h-[500px] bg-black";

    const content = post.type === 'image' ? (
      <img src={editedImageUrl || post.url} alt={post.caption} className={commonClasses} />
    ) : (
      <video 
        ref={videoRef}
        src={post.url} 
        className={commonClasses}
        loop
        playsInline
        controls={!isReels}
        muted={isReels} 
      />
    );

    return (
        <div className="w-full h-full relative select-none" onDoubleClick={handleDoubleTap}>
            {content}
            {/* Heart Animation Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${showHeartOverlay ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`}>
                <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg animate-pulse" />
            </div>
            
            {/* Gift Animation Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500 ${showGiftAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-black/50 backdrop-blur-md p-4 rounded-full flex flex-col items-center animate-bounce">
                    <Gift className="w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                    <span className="text-yellow-400 font-bold text-lg">+100 Coins</span>
                </div>
            </div>
        </div>
    );
  };

  const ActionButton = ({ icon: Icon, label, onClick, active, colorClass = "text-accent" }: any) => (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
      <button 
        onClick={(e) => { e.stopPropagation(); onClick?.(); }} 
        className={`p-3 rounded-full transition-all ${viewMode === 'reels' ? 'bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm' : 'hover:bg-gray-800'} ${active ? 'scale-110' : ''}`}
        aria-label={label}
      >
        <Icon className={`w-7 h-7 transition-colors ${active ? `fill-current ${colorClass}` : 'text-white'}`} />
      </button>
      {label && <span className="text-xs font-medium text-white shadow-black drop-shadow-md">{label}</span>}
    </div>
  );

  // --- REELS LAYOUT ---
  if (viewMode === 'reels') {
    return (
      <div className="w-full h-full snap-start relative bg-black overflow-hidden">
        {/* Media Layer */}
        <div className="absolute inset-0" onClick={() => {
            // Toggle mute on tap for reels
            if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
        }}>
          {renderMedia(true)}
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none"></div>
        </div>

        {/* Right Sidebar Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-20">
            <div className="relative mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-orange-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold border-2 border-white overflow-hidden">
                         {/* Avatar placeholder */}
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center text-white">
                             {post.author[0].toUpperCase()}
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-accent rounded-full p-0.5 cursor-pointer">
                     <div className="w-3 h-3 flex items-center justify-center text-[8px] font-bold">+</div>
                </div>
            </div>

            <ActionButton icon={Heart} label={likes} onClick={handleLike} active={isLiked} />
            <ActionButton icon={MessageCircle} label="42" />
            <ActionButton icon={Gift} label="Gift" onClick={handleGift} colorClass="text-yellow-400" />
            <ActionButton icon={Share2} label="Share" />
            <div className="relative" ref={optionsRef}>
                 <ActionButton icon={MoreHorizontal} label="More" onClick={() => setShowOptionsMenu(!showOptionsMenu)} />
                 {showOptionsMenu && (
                    <div className="absolute right-12 bottom-0 w-48 bg-black/90 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-right-5 z-50">
                        <button onClick={() => setShowReportModal(true)} className="w-full text-left px-4 py-3 text-red-500 font-bold text-sm hover:bg-white/10 flex items-center gap-2">
                            <Flag className="w-4 h-4" /> Report
                        </button>
                        <button className="w-full text-left px-4 py-3 text-white text-sm hover:bg-white/10 flex items-center gap-2">
                            <EyeOff className="w-4 h-4" /> Not Interested
                        </button>
                    </div>
                 )}
            </div>
            
            <div className="w-8 h-[1px] bg-white/20 my-1"></div>
            
            {/* AI Tools in Sidebar */}
             <ActionButton 
                icon={Sparkles} 
                label="Edit" 
                onClick={() => setShowEditModal(!showEditModal)} 
                colorClass="text-neon" 
                active={showEditModal}
            />
             {post.type === 'video' && (
                <ActionButton 
                    icon={Film} 
                    label="Analyze" 
                    onClick={() => setShowAnalyzeModal(!showAnalyzeModal)}
                    colorClass="text-purple-400"
                    active={showAnalyzeModal}
                />
            )}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-20 left-4 right-16 z-20 text-left pointer-events-none">
             <div className="pointer-events-auto">
                <h3 className="font-bold text-white drop-shadow-md mb-1 text-lg">@{post.author}</h3>
                <p className="text-sm text-white/90 drop-shadow-md mb-3 line-clamp-2 pr-4">{post.caption}</p>
                <div className="flex items-center space-x-2 opacity-80">
                    <Music2 className="w-3 h-3 animate-spin-slow" />
                    <p className="text-xs">Original Audio - {post.author}</p>
                </div>
             </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-gray-900 border border-gray-800 w-full max-w-sm rounded-2xl p-6 relative">
                    {!isReportSubmitted ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Report</h3>
                                <button onClick={() => setShowReportModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">Why are you reporting this post?</p>
                            <div className="space-y-2 mb-4">
                                {['Spam', 'Nudity or sexual activity', 'Hate speech or symbols', 'Violence or dangerous organizations', 'Bullying or harassment'].map((reason) => (
                                    <button 
                                        key={reason}
                                        onClick={() => setReportReason(reason)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${reportReason === reason ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                            <button 
                                disabled={!reportReason}
                                onClick={submitReport}
                                className="w-full bg-red-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition"
                            >
                                Submit Report
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-8 text-center">
                             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                 <CheckCircle2 className="w-8 h-8 text-green-500" />
                             </div>
                             <h3 className="font-bold text-lg text-white mb-2">Thanks for letting us know</h3>
                             <p className="text-sm text-gray-400">We use your feedback to help keep our community safe.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Analysis/Edit Overlays for Reels */}
        {(showAnalyzeModal || showEditModal) && (
           <div className="absolute inset-x-4 bottom-40 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-gray-800 z-30 animate-in slide-in-from-bottom-10">
               <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-neon">
                      {showAnalyzeModal ? 'Video Intelligence' : 'AI Magic Editor'}
                  </h4>
                  <button onClick={() => { setShowAnalyzeModal(false); setShowEditModal(false); }} className="text-gray-400"><X className="w-4 h-4" /></button>
               </div>
               
               {showAnalyzeModal && (
                   <>
                       {analysisResult ? (
                           <p className="text-xs text-gray-200 max-h-32 overflow-y-auto">{analysisResult}</p>
                       ) : (
                           <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 value={analysisPrompt}
                                 onChange={(e) => setAnalysisPrompt(e.target.value)}
                                 placeholder="Ask about this video..."
                                 className="flex-1 bg-white/10 rounded px-2 py-2 text-xs focus:outline-none border border-transparent focus:border-purple-500 transition-all"
                               />
                               <button onClick={handleAnalyze} disabled={isProcessing} className="bg-purple-600 px-3 py-1 rounded text-xs font-bold">
                                   {isProcessing ? '...' : 'Ask'}
                               </button>
                           </div>
                       )}
                   </>
               )}

               {showEditModal && (
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="Describe changes..."
                        className="flex-1 bg-white/10 rounded px-2 py-2 text-xs focus:outline-none border border-transparent focus:border-neon transition-all"
                      />
                      <button onClick={handleEdit} disabled={isProcessing} className="bg-neon text-black px-3 py-1 rounded text-xs font-bold">
                          {isProcessing ? '...' : 'Go'}
                      </button>
                   </div>
               )}
           </div>
        )}
      </div>
    );
  }

  // --- FEED LAYOUT (Instagram Style) ---
  return (
      <div className="bg-card rounded-xl overflow-hidden border border-gray-800 shadow-lg mb-6">
          {/* Header */}
          <div className="flex items-center justify-between p-3 relative">
              <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-accent p-[2px]">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-xs font-bold overflow-hidden">
                         <div className="bg-gray-700 w-full h-full flex items-center justify-center text-white">
                             {post.author[0].toUpperCase()}
                        </div>
                      </div>
                  </div>
                  <span className="font-semibold text-sm">{post.author}</span>
              </div>
              
              <div className="relative" ref={optionsRef}>
                  <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" onClick={() => setShowOptionsMenu(!showOptionsMenu)} />
                  {showOptionsMenu && (
                    <div className="absolute right-0 top-8 w-48 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl z-20 animate-in fade-in zoom-in-95">
                        <button onClick={() => setShowReportModal(true)} className="w-full text-left px-4 py-3 text-red-500 font-bold text-sm hover:bg-gray-800 flex items-center gap-2 border-b border-gray-800/50">
                            <Flag className="w-4 h-4" /> Report
                        </button>
                        <button className="w-full text-left px-4 py-3 text-white text-sm hover:bg-gray-800 flex items-center gap-2">
                            <EyeOff className="w-4 h-4" /> Not Interested
                        </button>
                        <button className="w-full text-left px-4 py-3 text-white text-sm hover:bg-gray-800 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> About Account
                        </button>
                    </div>
                  )}
              </div>
          </div>

          {/* Report Modal for Feed (Reused logic) */}
          {showReportModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-gray-900 border border-gray-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
                    {!isReportSubmitted ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Report</h3>
                                <button onClick={() => setShowReportModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">Why are you reporting this post?</p>
                            <div className="space-y-2 mb-4">
                                {['Spam', 'Nudity or sexual activity', 'Hate speech or symbols', 'Violence or dangerous organizations', 'Bullying or harassment'].map((reason) => (
                                    <button 
                                        key={reason}
                                        onClick={() => setReportReason(reason)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${reportReason === reason ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                            <button 
                                disabled={!reportReason}
                                onClick={submitReport}
                                className="w-full bg-red-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition"
                            >
                                Submit Report
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-8 text-center">
                             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                 <CheckCircle2 className="w-8 h-8 text-green-500" />
                             </div>
                             <h3 className="font-bold text-lg text-white mb-2">Thanks for letting us know</h3>
                             <p className="text-sm text-gray-400">We use your feedback to help keep our community safe.</p>
                        </div>
                    )}
                </div>
            </div>
          )}

          {/* Media */}
          <div className="relative min-h-[300px] bg-black flex items-center justify-center group">
             {renderMedia(false)}
             
             {/* Overlays for Edit/Analyze in Feed */}
             {showAnalyzeModal && (
                 <div className="absolute inset-0 bg-black/90 z-10 p-6 flex flex-col justify-center animate-in fade-in">
                      <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><Film className="w-4 h-4"/> Video Analysis</h3>
                      {analysisResult ? (
                          <div className="bg-gray-900 p-4 rounded-lg mb-4 text-sm text-gray-300 max-h-[60%] overflow-y-auto scrollbar-thin">
                              {analysisResult}
                          </div>
                      ) : (
                          <div className="space-y-3">
                              <textarea 
                                value={analysisPrompt}
                                onChange={(e) => setAnalysisPrompt(e.target.value)}
                                className="w-full bg-gray-800 rounded p-3 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none"
                                placeholder="What's happening in this video?"
                                rows={3}
                              />
                              <button 
                                onClick={handleAnalyze} 
                                disabled={isProcessing}
                                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-bold text-sm transition-colors"
                              >
                                  {isProcessing ? 'Analyzing...' : 'Analyze with Gemini'}
                              </button>
                          </div>
                      )}
                      <button onClick={() => setShowAnalyzeModal(false)} className="mt-auto text-gray-500 text-sm hover:text-white self-center">Close</button>
                 </div>
             )}
          </div>

          {/* Actions */}
          <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                      <button onClick={handleLike} className="hover:text-accent transition transform active:scale-90">
                          <Heart className={`w-6 h-6 ${isLiked ? 'fill-accent text-accent' : ''}`} />
                      </button>
                      <MessageCircle className="w-6 h-6 hover:text-gray-300 cursor-pointer" />
                      <Share2 className="w-6 h-6 hover:text-gray-300 cursor-pointer" />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.type === 'video' && (
                        <button 
                            onClick={() => setShowAnalyzeModal(true)}
                            className="flex items-center space-x-1 bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-medium hover:bg-purple-500/30 transition"
                        >
                            <Film className="w-3 h-3" />
                            <span>Analyze</span>
                        </button>
                    )}
                     <button 
                        onClick={() => setShowEditModal(!showEditModal)}
                        className="flex items-center space-x-1 bg-neon/10 text-neon px-2 py-1 rounded-md text-xs font-medium hover:bg-neon/20 transition"
                     >
                        <Sparkles className="w-3 h-3" />
                        <span>Edit</span>
                     </button>
                  </div>
              </div>

              <div className="font-bold text-sm mb-1">{likes.toLocaleString()} likes</div>
              <div className="text-sm">
                  <span className="font-bold mr-2">{post.author}</span>
                  {post.caption}
              </div>
              <div className="text-xs text-gray-500 mt-1 uppercase">2 hours ago</div>
              
              {/* Inline Edit Box for Feed */}
              {showEditModal && (
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-800 animate-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-neon flex items-center gap-2"><Sparkles className="w-3 h-3"/> AI Editor</h4>
                        <button onClick={() => setShowEditModal(false)}><X className="w-3 h-3 text-gray-500 hover:text-white" /></button>
                      </div>
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="Add sunglasses, change background..."
                            className="flex-1 bg-black rounded px-3 py-2 text-sm border border-gray-700 focus:border-neon focus:outline-none"
                          />
                          <button 
                            onClick={handleEdit}
                            disabled={isProcessing}
                            className="bg-neon text-black px-4 py-2 rounded font-bold text-xs hover:bg-cyan-400 transition-colors"
                          >
                              {isProcessing ? '...' : 'Go'}
                          </button>
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};

export default PostItem;