import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Post } from '../types';

interface FeedContextType {
  posts: Post[];
  addPost: (post: Post) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

// Initial dummy data
const initialPosts: Post[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://picsum.photos/600/800',
    author: 'creative_soul',
    likes: 1240,
    caption: 'Exploring the abstract nature of reality. 🌌 #art #ai',
  },
  {
    id: '2',
    type: 'video',
    // A sample video URL (using a reliable creative commons source or placeholder if needed, but keeping simple for now)
    // Since we can't guarantee a live video URL works forever, using a placeholder image for the feed logic, 
    // but normally this would be a .mp4. I'll use a placeholder text for video simulation if not generated.
    // For this demo, let's use a very short creative commons video link if possible, or just handle it.
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    author: 'film_maker_x',
    likes: 892,
    caption: 'Cinematic moments captured in time. 🎬',
    aspectRatio: '16:9'
  }
];

export const FeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <FeedContext.Provider value={{ posts, addPost }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
