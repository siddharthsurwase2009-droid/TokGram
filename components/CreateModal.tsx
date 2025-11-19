import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video as VideoIcon, Wand2, Upload, Sparkles } from 'lucide-react';
import { generateImage, generateVideo, animateImage } from '../services/gemini';
import { useFeed } from '../context/FeedContext';
import { MediaType } from '../types';
import { fileToBase64 } from '../utils/helpers';

interface CreateModalProps {
  onClose: () => void;
}

enum CreateTab {
  GEN_IMAGE = 'GEN_IMAGE',
  GEN_VIDEO = 'GEN_VIDEO',
  ANIMATE = 'ANIMATE',
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose }) => {
  const { addPost } = useFeed();
  const [activeTab, setActiveTab] = useState<CreateTab>(CreateTab.GEN_IMAGE);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let mediaUrl = '';
      let mediaType: MediaType = MediaType.IMAGE;

      if (activeTab === CreateTab.GEN_IMAGE) {
        // Imagen 4
        mediaUrl = await generateImage(prompt, aspectRatio);
        mediaType = MediaType.IMAGE;
      } else if (activeTab === CreateTab.GEN_VIDEO) {
        // Veo 3 Text-to-Video
        mediaUrl = await generateVideo(prompt, aspectRatio);
        mediaType = MediaType.VIDEO;
      } else if (activeTab === CreateTab.ANIMATE) {
        // Veo 3 Image-to-Video
        if (!selectedFile) {
            alert("Please upload an image to animate.");
            setIsGenerating(false);
            return;
        }
        const base64 = await fileToBase64(selectedFile);
        mediaUrl = await animateImage(base64, selectedFile.type, prompt, aspectRatio);
        mediaType = MediaType.VIDEO;
      }

      addPost({
        id: Date.now().toString(),
        type: mediaType === MediaType.IMAGE ? 'image' : 'video',
        url: mediaUrl,
        author: 'you',
        likes: 0,
        caption: prompt || (activeTab === CreateTab.ANIMATE ? 'Animated masterpiece' : 'Generated content'),
        aspectRatio: aspectRatio,
      });
      
      onClose();
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Generation failed. Ensure API keys are set (User Key for Veo) or try a simpler prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full sm:w-96 max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 flex flex-col border border-gray-200 relative shadow-xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
          Create Magic
        </h2>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab(CreateTab.GEN_IMAGE)}
            className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition ${activeTab === CreateTab.GEN_IMAGE ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
          >
            <ImageIcon className="w-3 h-3" /> Imagen
          </button>
          <button 
            onClick={() => setActiveTab(CreateTab.GEN_VIDEO)}
            className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition ${activeTab === CreateTab.GEN_VIDEO ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
          >
            <VideoIcon className="w-3 h-3" /> Reel
          </button>
          <button 
            onClick={() => setActiveTab(CreateTab.ANIMATE)}
            className={`flex-1 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition ${activeTab === CreateTab.ANIMATE ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
          >
            <Wand2 className="w-3 h-3" /> Animate
          </button>
        </div>

        {/* Config */}
        <div className="space-y-4 flex-1">
          
          {/* File Upload for Animate */}
          {activeTab === CreateTab.ANIMATE && (
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition bg-gray-50"
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-32 object-cover rounded-md" />
                ) : (
                    <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload photo to animate</span>
                    </>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
            </div>
          )}

          {/* Prompt */}
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === CreateTab.ANIMATE ? "Describe how it should move..." : "Describe what you want to see..."}
              className="w-full bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none border border-gray-200 text-black"
            />
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Aspect Ratio</label>
            <div className="flex space-x-2">
              {['1:1', '16:9', '9:16', '3:4', '4:3'].map(ratio => (
                <button 
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${aspectRatio === ratio ? 'border-purple-500 text-purple-600 bg-purple-50' : 'border-gray-300 text-gray-500'}`}
                >
                    {ratio}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-accent to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-orange-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
                <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Generating...
                </>
            ) : (
                <>
                 <Sparkles className="w-4 h-4" /> Generate
                </>
            )}
          </button>
          
          {/* Veo specific note */}
          {(activeTab === CreateTab.GEN_VIDEO || activeTab === CreateTab.ANIMATE) && (
             <p className="text-[10px] text-center text-gray-500">
                 Video generation uses Veo and requires your API Key selection via the Google AI Studio popup.
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;