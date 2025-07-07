import { PixabayResponse } from '../types';

const PIXABAY_API_KEY = '51207563-77373cf5fba94022ae4cc7134';
const PIXABAY_URL = 'https://pixabay.com/api/';

export async function fetchImagesFromPixabay(keywords: string[], originalPrompt: string): Promise<string[]> {
  const imageUrls: string[] = [];
  
  try {
    // Target 8-10 images for 10-second slideshow
    const targetImages = Math.max(keywords.length, 8);
    
    for (let i = 0; i < targetImages; i++) {
      const keyword = keywords[i % keywords.length];
      let imageUrl = '';
      
      try {
        // Enhanced search strategies with topic-specific terms
        const searchStrategies = [
          // Primary search with exact keyword
          keyword,
          // Add "repair" or "maintenance" context if relevant
          `${keyword} ${getActionContext(originalPrompt)}`,
          // Add "tools" for repair-related queries
          `${keyword} tools`,
          // Broader topic search
          getMainTopicFromPrompt(originalPrompt),
          // Fallback with "how to" context
          `${keyword} tutorial`
        ];

        for (const searchTerm of searchStrategies) {
          console.log(`Searching for: "${searchTerm}"`);
          
          const response = await fetch(
            `${PIXABAY_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&category=industry,transportation,science,education&min_width=800&min_height=600&per_page=20&safesearch=true&order=popular`
          );

          if (!response.ok) continue;

          const data: PixabayResponse = await response.json();
          
          if (data.hits && data.hits.length > 0) {
            // Score images based on relevance with enhanced algorithm
            const scoredImages = data.hits.map(hit => ({
              ...hit,
              relevanceScore: calculateImageRelevance(hit, keyword, originalPrompt, searchTerm)
            })).sort((a, b) => b.relevanceScore - a.relevanceScore);

            // Select best image that hasn't been used
            const selectedImage = scoredImages.find(img => 
              !imageUrls.includes(img.webformatURL)
            );

            if (selectedImage) {
              imageUrl = selectedImage.webformatURL;
              console.log(`Found relevant image for "${searchTerm}": ${selectedImage.tags}`);
              break;
            }
          }
        }

        imageUrls.push(imageUrl);
      } catch (error) {
        console.warn(`Error fetching image for keyword "${keyword}":`, error);
        imageUrls.push('');
      }
    }

    // Fill any missing images with highly relevant fallback images
    await fillMissingImages(imageUrls, originalPrompt, keywords);

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images from Pixabay:', error);
    return new Array(targetImages).fill('');
  }
}

function getActionContext(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('repair') || lowerPrompt.includes('fix')) {
    return 'repair';
  } else if (lowerPrompt.includes('maintain') || lowerPrompt.includes('service')) {
    return 'maintenance';
  } else if (lowerPrompt.includes('install') || lowerPrompt.includes('setup')) {
    return 'installation';
  } else if (lowerPrompt.includes('clean')) {
    return 'cleaning';
  } else if (lowerPrompt.includes('replace')) {
    return 'replacement';
  }
  
  return 'repair';
}

function getMainTopicFromPrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  const topicKeywords = {
    'bicycle repair': ['bike', 'bicycle', 'cycling'],
    'car repair': ['car', 'automobile', 'vehicle'],
    'computer repair': ['computer', 'laptop', 'pc'],
    'phone repair': ['phone', 'smartphone', 'mobile'],
    'cooking': ['cook', 'recipe', 'kitchen', 'food'],
    'gardening': ['garden', 'plant', 'flower'],
    'home repair': ['house', 'home', 'wall', 'door', 'window'],
    'plumbing': ['pipe', 'plumbing', 'water', 'leak'],
    'electrical': ['electrical', 'wire', 'circuit', 'power'],
    'painting': ['paint', 'painting', 'brush'],
    'woodworking': ['wood', 'lumber', 'saw', 'drill'],
    'exercise': ['exercise', 'workout', 'fitness'],
    'music': ['music', 'instrument', 'guitar', 'piano']
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return topic;
    }
  }

  // Extract main subject as fallback
  const words = lowerPrompt.replace(/[^\w\s]/g, ' ').split(/\s+/);
  const meaningfulWord = words.find(word => 
    word.length > 3 && 
    !['what', 'how', 'why', 'when', 'where', 'explain', 'tell', 'about', 'does', 'work', 'make', 'repair', 'fix'].includes(word)
  );

  return meaningfulWord ? `${meaningfulWord} repair` : 'repair tools';
}

function calculateImageRelevance(image: any, keyword: string, originalPrompt: string, searchTerm: string): number {
  let score = 0;
  const tags = image.tags.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  const promptWords = originalPrompt.toLowerCase().split(/\s+/);

  // Exact keyword match in tags (highest priority)
  if (tags.includes(keywordLower)) {
    score += 20;
  }

  // Search term components in tags
  const searchWords = searchTerm.toLowerCase().split(/\s+/);
  searchWords.forEach(word => {
    if (word.length > 3 && tags.includes(word)) {
      score += 15;
    }
  });

  // Original prompt words in tags
  promptWords.forEach(word => {
    if (word.length > 3 && tags.includes(word)) {
      score += 12;
    }
  });

  // Boost for repair/maintenance related terms
  const repairTerms = ['repair', 'fix', 'maintenance', 'service', 'tool', 'workshop', 'mechanic', 'technician'];
  repairTerms.forEach(term => {
    if (tags.includes(term)) {
      score += 10;
    }
  });

  // Boost for specific tools and parts
  const toolTerms = ['wrench', 'screwdriver', 'hammer', 'pliers', 'drill', 'saw', 'tool', 'equipment'];
  toolTerms.forEach(term => {
    if (tags.includes(term)) {
      score += 8;
    }
  });

  // Boost for hands-on/tutorial content
  const tutorialTerms = ['hands', 'work', 'working', 'tutorial', 'instruction', 'step', 'process'];
  tutorialTerms.forEach(term => {
    if (tags.includes(term)) {
      score += 6;
    }
  });

  // Boost for high-quality images
  score += Math.min(image.likes / 100, 5);
  score += Math.min(image.views / 10000, 3);

  // Penalize completely unrelated content
  const irrelevantTerms = ['abstract', 'art', 'decoration', 'party', 'celebration', 'wedding', 'fashion', 'beauty'];
  irrelevantTerms.forEach(term => {
    if (tags.includes(term)) {
      score -= 10;
    }
  });

  // Penalize stock business photos for technical topics
  const businessTerms = ['business', 'office', 'meeting', 'handshake', 'suit', 'corporate', 'team'];
  if (originalPrompt.toLowerCase().includes('repair') || originalPrompt.toLowerCase().includes('fix')) {
    businessTerms.forEach(term => {
      if (tags.includes(term)) {
        score -= 8;
      }
    });
  }

  return Math.max(score, 0);
}

async function fillMissingImages(imageUrls: string[], originalPrompt: string, keywords: string[]): Promise<void> {
  const missingIndices = imageUrls
    .map((url, index) => url ? null : index)
    .filter(index => index !== null) as number[];

  if (missingIndices.length === 0) return;

  try {
    // Get topic-specific fallback images
    const mainTopic = getMainTopicFromPrompt(originalPrompt);
    const actionContext = getActionContext(originalPrompt);
    
    const fallbackSearches = [
      `${mainTopic} ${actionContext}`,
      `${mainTopic} tools`,
      `repair tools workshop`,
      `maintenance equipment`,
      `tutorial instruction`
    ];

    for (const searchTerm of fallbackSearches) {
      if (missingIndices.length === 0) break;

      const fallbackResponse = await fetch(
        `${PIXABAY_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&category=industry,transportation,science,education&min_width=800&min_height=600&per_page=20&safesearch=true&order=popular`
      );

      if (fallbackResponse.ok) {
        const fallbackData: PixabayResponse = await fallbackResponse.json();
        
        let usedImages = 0;
        for (let i = 0; i < missingIndices.length && usedImages < fallbackData.hits.length; i++) {
          const missingIndex = missingIndices[i];
          if (imageUrls[missingIndex] === '') {
            const availableImage = fallbackData.hits.find(hit => 
              !imageUrls.includes(hit.webformatURL)
            );
            
            if (availableImage) {
              imageUrls[missingIndex] = availableImage.webformatURL;
              usedImages++;
            }
          }
        }
      }
    }

    // Final fallback for any still missing images - topic-specific defaults
    const stillMissing = imageUrls
      .map((url, index) => url ? null : index)
      .filter(index => index !== null) as number[];

    if (stillMissing.length > 0) {
      const topicFallbacks = getTopicSpecificFallbacks(originalPrompt);
      
      stillMissing.forEach((missingIndex, i) => {
        imageUrls[missingIndex] = topicFallbacks[i % topicFallbacks.length];
      });
    }
  } catch (error) {
    console.warn('Error fetching fallback images:', error);
  }
}

function getTopicSpecificFallbacks(prompt: string): string[] {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('bike') || lowerPrompt.includes('bicycle')) {
    return [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop', // Bike repair
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop', // Bike tools
      'https://images.unsplash.com/photo-1544191696-15693072b5a7?w=800&h=600&fit=crop', // Bike maintenance
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop'  // Bike workshop
    ];
  } else if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle')) {
    return [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop', // Car repair
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&h=600&fit=crop', // Auto tools
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop', // Car maintenance
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&h=600&fit=crop'  // Auto workshop
    ];
  } else {
    return [
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop', // General tools
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop', // Workshop
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=600&fit=crop', // Repair work
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&h=600&fit=crop'  // Tools and equipment
    ];
  }
}