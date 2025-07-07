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
      // Get response from Gemini with enhanced prompting for natural conversation
      const geminiResponse = await getGeminiResponse(userMessage);
      
      // Split the response into meaningful segments optimized for visual representation
      const segments = splitTextIntoSegments(geminiResponse, 8);
      
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

      // Create a more natural, conversational response
      const topicName = extractTopicFromMessage(userMessage);
      const responseMessage = createNaturalResponse(topicName, segments.length);

      // Add bot response with more natural message
      const botChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseMessage,
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
        content: 'I apologize, but I encountered an issue while preparing your visual guide. This might be due to high demand or connectivity issues. Please try asking your question again, and I\'ll do my best to help you!',
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

function extractTopicFromMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('car') || lowerMessage.includes('vehicle') || lowerMessage.includes('automobile')) {
    return 'car maintenance';
  } else if (lowerMessage.includes('bike') || lowerMessage.includes('bicycle')) {
    return 'bike repair';
  } else if (lowerMessage.includes('computer') || lowerMessage.includes('laptop')) {
    return 'computer troubleshooting';
  } else if (lowerMessage.includes('phone') || lowerMessage.includes('smartphone')) {
    return 'phone repair';
  } else if (lowerMessage.includes('cook') || lowerMessage.includes('recipe')) {
    return 'cooking';
  } else if (lowerMessage.includes('garden') || lowerMessage.includes('plant')) {
    return 'gardening';
  } else if (lowerMessage.includes('clean')) {
    return 'cleaning';
  } else if (lowerMessage.includes('paint')) {
    return 'painting';
  } else if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
    return 'fitness';
  } else if (lowerMessage.includes('music') || lowerMessage.includes('instrument')) {
    return 'music';
  }
  
  // Extract the main action or subject
  const words = lowerMessage.split(' ');
  const actionWords = ['fix', 'repair', 'make', 'build', 'create', 'learn', 'understand'];
  const action = words.find(word => actionWords.includes(word)) || 'help with';
  const subject = words.find(word => word.length > 4 && !actionWords.includes(word)) || 'this topic';
  
  return `${action} ${subject}`;
}

function createNaturalResponse(topic: string, stepCount: number): string {
  const responses = [
    `Perfect! I've put together a comprehensive ${stepCount}-step visual guide for ${topic}. Each step includes carefully selected images and clear instructions that will walk you through the entire process.`,
    
    `Great question! I've created a detailed ${stepCount}-step tutorial about ${topic}. You'll see exactly what to do at each stage with helpful visuals and easy-to-follow explanations.`,
    
    `I'd be happy to help with ${topic}! I've prepared a ${stepCount}-step visual walkthrough that shows you everything you need to know. The slideshow will guide you through each step with clear images and instructions.`,
    
    `Excellent! Here's a complete ${stepCount}-step guide for ${topic}. I've included specific visuals for each step so you can see exactly what you're working with and what to do next.`,
    
    `I've got you covered! This ${stepCount}-step visual guide will take you through ${topic} from start to finish. Each slide shows you the key details and actions you need to take.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}