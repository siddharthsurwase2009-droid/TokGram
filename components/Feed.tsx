import React from 'react';
import { useFeed } from '../context/FeedContext';
import PostItem from './PostItem';
import { ViewMode } from '../App';

interface FeedProps {
  viewMode: ViewMode;
}

const Feed: React.FC<FeedProps> = ({ viewMode }) => {
  const { posts } = useFeed();

  return (
    <div 
      className={`w-full h-full ${
        viewMode === 'reels' 
          ? 'overflow-y-scroll snap-y snap-mandatory no-scrollbar pb-[70px]' // Add padding for navbar in reels mode
          : 'overflow-y-auto pb-24 pt-20'
      }`}
    >
      <div className={`${viewMode === 'feed' ? 'max-w-lg mx-auto px-2 space-y-6' : 'h-full'}`}>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};

export default Feed;