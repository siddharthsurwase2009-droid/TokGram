import { GoogleGenAI, Modality, VideoGenerationReferenceType } from "@google/genai";

// Helper to get AI instance. 
// For Veo, we MUST create a new instance to catch the latest API key selection.
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- IMAGE GENERATION (Imagen 4) ---
export const generateImage = async (prompt: string, aspectRatio: string = '1:1'): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: aspectRatio,
    },
  });

  const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64ImageBytes) throw new Error("No image generated");
  return `data:image/jpeg;base64,${base64ImageBytes}`;
};

// --- IMAGE EDITING (Nano Banana / Gemini Flash Image) ---
export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  // Nano Banana returns the image in the parts
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No edited image returned");
};

// --- VIDEO GENERATION (Veo 3) ---
export const generateVideo = async (prompt: string, aspectRatio: string = '16:9'): Promise<string> => {
  // Ensure API Key is selected for Veo
  // @ts-ignore - window.aistudio is injected
  if (window.aistudio && window.aistudio.hasSelectedApiKey && !(await window.aistudio.hasSelectedApiKey())) {
     // @ts-ignore
    await window.aistudio.openSelectKey();
  }

  const ai = getAiClient(); // Re-init with potentially new key
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p', // fast-generate supports 720p/1080p. Stick to 720 for speed/compatibility
      aspectRatio: aspectRatio, 
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("No video generated");

  // Fetch the actual video bytes
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

// --- ANIMATE IMAGE (Veo 3 Image-to-Video) ---
export const animateImage = async (base64Image: string, mimeType: string, prompt: string | undefined, aspectRatio: string = '16:9'): Promise<string> => {
  // Ensure API Key is selected for Veo
  // @ts-ignore
  if (window.aistudio && window.aistudio.hasSelectedApiKey && !(await window.aistudio.hasSelectedApiKey())) {
     // @ts-ignore
    await window.aistudio.openSelectKey();
  }

  const ai = getAiClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt, // Optional prompt
    image: {
      imageBytes: base64Image,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("No video generated");

  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

// --- VIDEO UNDERSTANDING (Gemini Pro) ---
export const analyzeVideo = async (base64Video: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  // Gemini 3 Pro Preview for video understanding
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Video,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
  });

  return response.text || "I couldn't analyze that video.";
};

// --- GENERAL INTELLIGENCE (Gemini Flash) ---
export const askGemini = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "No response.";
};
