export interface Post {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt?: string;
  author: string;
  likes: number;
  caption: string;
  aspectRatio?: string;
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface Comment {
  id: string;
  user: string;
  text: string;
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  mediaUrl?: string; // Optional for placeholder stories
  type: 'image' | 'video';
  isUser?: boolean;
  viewed?: boolean;
}