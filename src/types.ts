export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface PixabayResponse {
  hits: Array<{
    id: number;
    webformatURL: string;
    tags: string;
    views: number;
    downloads: number;
    likes: number;
  }>;
}

export interface SlideContent {
  image: string;
  caption: string;
  keywords: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  slideshow?: SlideContent[];
}