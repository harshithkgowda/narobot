import { useState, useCallback } from 'react';
import { ChatMessage, SlideContent } from '../types';
import { getGeminiResponse, extractKeywordsFromSegments, splitTextIntoSegments } from '../services/geminiService';
import { fetchImagesFromPixabay } from '../services/pixabayService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    // Add user message
    const userChatMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userChatMessage]);
    setIsLoading(true);

    try {
      // Get response from Gemini with enhanced prompting for visual content
      const geminiResponse = await getGeminiResponse(userMessage);
      
      // Split the response into meaningful segments optimized for visual representation
      const segments = splitTextIntoSegments(geminiResponse, 5);
      
      // Extract highly relevant keywords from each segment with context from original question
      const keywords = extractKeywordsFromSegments(segments, userMessage);
      
      console.log('Generated segments:', segments);
      console.log('Extracted keywords:', keywords);
      
      // Fetch highly relevant images from Pixabay with improved search strategy
      const images = await fetchImagesFromPixabay(keywords, userMessage);
      
      console.log('Fetched images:', images);
      
      // Create slideshow content with perfectly matched segments and images
      const slideContent: SlideContent[] = segments.map((segment, index) => ({
        image: images[index] || '',
        caption: segment,
        keywords: keywords[index] ? [keywords[index]] : [],
      }));

      // Add bot response with more descriptive message
      const botChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I've created a comprehensive visual explanation about "${userMessage}". This slideshow will automatically play with synchronized narration and carefully selected images that illustrate each concept!`,
        timestamp: new Date(),
        slideshow: slideContent,
      };

      setMessages(prev => [...prev, botChatMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I encountered an error while creating your slideshow. This might be due to API limits or network issues. Please try asking your question again, or try rephrasing it for better results.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
  };
};