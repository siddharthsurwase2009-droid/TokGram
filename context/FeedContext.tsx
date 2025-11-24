import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Post, Story } from '../types';

interface FeedContextType {
  posts: Post[];
  stories: Story[];
  addPost: (post: Post) => void;
  addStory: (story: Story) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

// Initial dummy posts
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
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    author: 'film_maker_x',
    likes: 892,
    caption: 'Cinematic moments captured in time. 🎬',
    aspectRatio: '16:9'
  }
];

// Initial dummy stories
const initialStories: Story[] = [
  { id: 'user', username: 'Your Story', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', type: 'image', isUser: true },
  { id: 's1', username: 'alex_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', mediaUrl: 'https://picsum.photos/400/800', type: 'image' },
  { id: 's2', username: 'sarah_art', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', mediaUrl: 'https://picsum.photos/401/800', type: 'image' },
  { id: 's3', username: 'mike_vids', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', mediaUrl: 'https://picsum.photos/402/800', type: 'image' },
];

export const FeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [stories, setStories] = useState<Story[]>(initialStories);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const addStory = (story: Story) => {
    // Add new story after the user's "Add Story" button but before others, or just append. 
    // Logic: If it's the current user, update the "Your Story" or add a new entry next to it.
    // For simplicity, we just add it to the list.
    setStories((prev) => {
        // If user already has a story, maybe replace it or add to queue. 
        // Here we just insert at index 1 (after "Your Story" placeholder)
        const newStories = [...prev];
        newStories.splice(1, 0, story);
        return newStories;
    });
  };

  return (
    <FeedContext.Provider value={{ posts, stories, addPost, addStory }}>
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