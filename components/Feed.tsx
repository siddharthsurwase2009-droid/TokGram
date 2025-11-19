import React from 'react';
import { useFeed } from '../context/FeedContext';
import PostItem from './PostItem';
import Stories from './Stories';
import { ViewMode } from '../App';

interface FeedProps {
  viewMode: ViewMode;
  searchQuery: string;
}

const Feed: React.FC<FeedProps> = ({ viewMode, searchQuery }) => {
  const { posts } = useFeed();

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return post.caption.toLowerCase().includes(query) || post.author.toLowerCase().includes(query);
  });

  return (
    <div 
      className={`w-full h-full bg-black ${
        viewMode === 'reels' 
          ? 'overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-[70px]'
          : 'overflow-y-auto pb-24 pt-[72px]'
      }`}
    >
      {/* Stories Bar only in Feed Mode */}
      {viewMode === 'feed' && <Stories />}
      
      <div className={`${viewMode === 'feed' ? 'max-w-lg mx-auto px-0 sm:px-4 space-y-4 sm:space-y-6 mt-2' : 'h-full'}`}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} viewMode={viewMode} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No posts found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;