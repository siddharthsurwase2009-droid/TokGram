import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, X, Flag, EyeOff, AlertCircle, CheckCircle2, Check } from 'lucide-react';
import { ViewMode } from '../App';

interface PostItemProps {
  post: Post;
  viewMode: ViewMode;
}

const PostItem: React.FC<PostItemProps> = ({ post, viewMode }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // Safety / Menu State
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

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

  // Track video progress for progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (viewMode === 'reels' && post.type === 'video' && video) {
      const handleTimeUpdate = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [viewMode, post.type]);

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

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
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

  const isCurrentUser = ['you', 'you_creative_ai'].includes(post.author.toLowerCase());

  const renderMedia = (isReels: boolean) => {
    const commonClasses = isReels 
      ? "w-full h-full object-cover" 
      : "w-full h-auto object-contain max-h-[500px] bg-gray-100";

    const content = post.type === 'image' ? (
      <img src={post.url} alt={post.caption} className={commonClasses} />
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
        </div>
    );
  };

  const ActionButton = ({ icon: Icon, label, onClick, active, colorClass = "text-accent" }: any) => (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
      <button 
        onClick={(e) => { e.stopPropagation(); onClick?.(); }} 
        className={`p-3 rounded-full transition-all ${viewMode === 'reels' ? 'bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm' : 'hover:bg-gray-100'} ${active ? 'scale-110' : ''}`}
        aria-label={label}
      >
        <Icon className={`w-7 h-7 transition-colors ${active ? `fill-current ${colorClass} animate-like-bounce` : (viewMode === 'reels' ? 'text-white' : 'text-black')}`} />
      </button>
      {label && <span className={`text-xs font-medium ${viewMode === 'reels' ? 'text-white shadow-black drop-shadow-md' : 'text-black'}`}>{label}</span>}
    </div>
  );

  // --- REELS LAYOUT ---
  if (viewMode === 'reels') {
    return (
      <div className="w-full h-full snap-start relative bg-black overflow-hidden">
        {/* Media Layer - Keep bg-black for video */}
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
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold border-2 border-white overflow-hidden">
                         {/* Avatar placeholder */}
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center text-black">
                             {post.author[0].toUpperCase()}
                        </div>
                    </div>
                </div>
                {!isCurrentUser && (
                    <div 
                        onClick={handleFollow} 
                        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 p-0.5 rounded-full cursor-pointer transition-all duration-300 ${isFollowing ? 'bg-white border border-gray-200 scale-90' : 'bg-accent hover:scale-110'}`}
                    >
                         {isFollowing ? (
                             <Check className="w-3 h-3 text-accent" />
                         ) : (
                             <div className="w-3 h-3 flex items-center justify-center text-[8px] font-bold text-white">+</div>
                         )}
                    </div>
                )}
            </div>

            <ActionButton icon={Heart} label={likes} onClick={handleLike} active={isLiked} />
            <ActionButton icon={MessageCircle} label="42" />
            <ActionButton icon={Share2} label="Share" />
            <div className="relative" ref={optionsRef}>
                 <ActionButton icon={MoreHorizontal} label="More" onClick={() => setShowOptionsMenu(!showOptionsMenu)} />
                 {showOptionsMenu && (
                    <div className="absolute right-12 bottom-0 w-48 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-right-5 z-50">
                        <button onClick={() => setShowReportModal(true)} className="w-full text-left px-4 py-3 text-red-500 font-bold text-sm hover:bg-gray-100 flex items-center gap-2">
                            <Flag className="w-4 h-4" /> Report
                        </button>
                        <button className="w-full text-left px-4 py-3 text-black text-sm hover:bg-gray-100 flex items-center gap-2">
                            <EyeOff className="w-4 h-4" /> Not Interested
                        </button>
                    </div>
                 )}
            </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-20 left-4 right-16 z-20 text-left pointer-events-none">
             <div className="pointer-events-auto">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white drop-shadow-md text-lg shadow-black">@{post.author}</h3>
                    {!isCurrentUser && (
                        <button 
                            onClick={handleFollow}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all backdrop-blur-sm ${
                                isFollowing 
                                ? 'bg-white/10 border-white/30 text-white/80' 
                                : 'bg-transparent border-white text-white hover:bg-white/20'
                            }`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
                <p className="text-sm text-white/90 drop-shadow-md mb-3 line-clamp-2 pr-4 shadow-black">{post.caption}</p>
             </div>
        </div>

        {/* Progress Bar - Only for Video in Reels */}
        {post.type === 'video' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
                <div 
                    className="h-full bg-white transition-all duration-100 ease-linear" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white border border-gray-200 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
                    {!isReportSubmitted ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-black">Report</h3>
                                <button onClick={() => setShowReportModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Why are you reporting this post?</p>
                            <div className="space-y-2 mb-4">
                                {['Spam', 'Nudity or sexual activity', 'Hate speech or symbols', 'Violence or dangerous organizations', 'Bullying or harassment'].map((reason) => (
                                    <button 
                                        key={reason}
                                        onClick={() => setReportReason(reason)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${reportReason === reason ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
                             <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                 <CheckCircle2 className="w-8 h-8 text-green-500" />
                             </div>
                             <h3 className="font-bold text-lg text-black mb-2">Thanks for letting us know</h3>
                             <p className="text-sm text-gray-500">We use your feedback to help keep our community safe.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    );
  }

  // --- FEED LAYOUT (Instagram Style) ---
  return (
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-6">
          {/* Header */}
          <div className="flex items-center justify-between p-3 relative">
              <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-accent p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold overflow-hidden">
                         <div className="bg-gray-100 w-full h-full flex items-center justify-center text-black">
                             {post.author[0].toUpperCase()}
                        </div>
                      </div>
                  </div>
                  <span className="font-semibold text-sm text-black">{post.author}</span>
                  {!isCurrentUser && (
                      <>
                        <span className="text-gray-300 text-xs">•</span>
                        <button 
                            onClick={handleFollow}
                            className={`text-sm font-bold transition-colors ${isFollowing ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'}`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </>
                  )}
              </div>
              
              <div className="relative" ref={optionsRef}>
                  <MoreHorizontal className="w-5 h-5 text-black cursor-pointer hover:text-gray-600" onClick={() => setShowOptionsMenu(!showOptionsMenu)} />
                  {showOptionsMenu && (
                    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xl z-20 animate-in fade-in zoom-in-95">
                        <button onClick={() => setShowReportModal(true)} className="w-full text-left px-4 py-3 text-red-500 font-bold text-sm hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100">
                            <Flag className="w-4 h-4" /> Report
                        </button>
                        <button className="w-full text-left px-4 py-3 text-black text-sm hover:bg-gray-100 flex items-center gap-2">
                            <EyeOff className="w-4 h-4" /> Not Interested
                        </button>
                        <button className="w-full text-left px-4 py-3 text-black text-sm hover:bg-gray-100 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> About Account
                        </button>
                    </div>
                  )}
              </div>
          </div>

          {/* Report Modal for Feed (Reused logic) */}
          {showReportModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white border border-gray-200 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
                    {!isReportSubmitted ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-black">Report</h3>
                                <button onClick={() => setShowReportModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Why are you reporting this post?</p>
                            <div className="space-y-2 mb-4">
                                {['Spam', 'Nudity or sexual activity', 'Hate speech or symbols', 'Violence or dangerous organizations', 'Bullying or harassment'].map((reason) => (
                                    <button 
                                        key={reason}
                                        onClick={() => setReportReason(reason)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${reportReason === reason ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
                             <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                 <CheckCircle2 className="w-8 h-8 text-green-500" />
                             </div>
                             <h3 className="font-bold text-lg text-black mb-2">Thanks for letting us know</h3>
                             <p className="text-sm text-gray-500">We use your feedback to help keep our community safe.</p>
                        </div>
                    )}
                </div>
            </div>
          )}

          {/* Media */}
          <div className="relative min-h-[300px] bg-gray-100 flex items-center justify-center group">
             {renderMedia(false)}
          </div>

          {/* Actions */}
          <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                      <button onClick={handleLike} className="hover:text-accent transition transform active:scale-90">
                          <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-accent text-accent animate-like-bounce' : 'text-black'}`} />
                      </button>
                      <MessageCircle className="w-6 h-6 text-black hover:text-gray-600 cursor-pointer" />
                      <Share2 className="w-6 h-6 text-black hover:text-gray-600 cursor-pointer" />
                  </div>
              </div>

              <div className="font-bold text-sm mb-1 text-black">{likes.toLocaleString()} likes</div>
              <div className="text-sm text-black">
                  <span className="font-bold mr-2">{post.author}</span>
                  {post.caption}
              </div>
              <div className="text-xs text-gray-500 mt-1 uppercase">2 hours ago</div>
          </div>
      </div>
  );
};

export default PostItem;