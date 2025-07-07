import { PixabayResponse } from '../types';

const PIXABAY_API_KEY = '51207563-77373cf5fba94022ae4cc7134';
const PIXABAY_URL = 'https://pixabay.com/api/';

export async function fetchImagesFromPixabay(keywords: string[], originalPrompt: string): Promise<string[]> {
  const imageUrls: string[] = [];
  
  try {
    // Target more images for better accuracy
    const targetImages = Math.max(keywords.length, 10);
    
    for (let i = 0; i < targetImages; i++) {
      const keyword = keywords[i % keywords.length];
      let imageUrl = '';
      
      try {
        // Enhanced search strategies with more specific terms
        const searchStrategies = [
          // Primary search with exact keyword
          keyword,
          // Add specific context based on step
          `${keyword} ${getStepContext(i, originalPrompt)}`,
          // Add professional context
          `${keyword} professional mechanic`,
          // Add workshop context
          `${keyword} garage workshop`,
          // Add hands-on context
          `${keyword} hands working`,
          // Broader topic search
          getMainTopicFromPrompt(originalPrompt),
          // Fallback with tutorial context
          `${keyword} repair tutorial`
        ];

        for (const searchTerm of searchStrategies) {
          console.log(`Searching for: "${searchTerm}"`);
          
          const response = await fetch(
            `${PIXABAY_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&category=industry,transportation,science,education,business&min_width=1000&min_height=700&per_page=30&safesearch=true&order=popular`
          );

          if (!response.ok) continue;

          const data: PixabayResponse = await response.json();
          
          if (data.hits && data.hits.length > 0) {
            // Score images based on relevance with enhanced algorithm
            const scoredImages = data.hits.map(hit => ({
              ...hit,
              relevanceScore: calculateImageRelevance(hit, keyword, originalPrompt, searchTerm, i)
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

function getStepContext(stepIndex: number, prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle')) {
    const carSteps = [
      'tools preparation',
      'safety lifting',
      'engine inspection',
      'fluid checking',
      'component removal',
      'part replacement',
      'system testing',
      'final inspection',
      'cleanup completion',
      'quality check'
    ];
    return carSteps[stepIndex % carSteps.length];
  }
  
  // Generic step contexts
  const genericSteps = [
    'preparation setup',
    'initial inspection',
    'tool selection',
    'component access',
    'main procedure',
    'assembly process',
    'testing verification',
    'final check',
    'completion cleanup',
    'quality assurance'
  ];
  
  return genericSteps[stepIndex % genericSteps.length];
}

function getMainTopicFromPrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  const topicKeywords = {
    'automotive repair garage': ['car', 'automobile', 'vehicle'],
    'bicycle maintenance workshop': ['bike', 'bicycle', 'cycling'],
    'computer hardware repair': ['computer', 'laptop', 'pc'],
    'smartphone repair technician': ['phone', 'smartphone', 'mobile'],
    'professional kitchen cooking': ['cook', 'recipe', 'kitchen', 'food'],
    'garden maintenance tools': ['garden', 'plant', 'flower'],
    'home improvement repair': ['house', 'home', 'wall', 'door', 'window'],
    'plumbing repair tools': ['pipe', 'plumbing', 'water', 'leak'],
    'electrical work safety': ['electrical', 'wire', 'circuit', 'power'],
    'painting preparation tools': ['paint', 'painting', 'brush'],
    'woodworking shop tools': ['wood', 'lumber', 'saw', 'drill'],
    'fitness equipment gym': ['exercise', 'workout', 'fitness'],
    'music instrument practice': ['music', 'instrument', 'guitar', 'piano']
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return topic;
    }
  }

  return 'professional repair workshop';
}

function calculateImageRelevance(image: any, keyword: string, originalPrompt: string, searchTerm: string, stepIndex: number): number {
  let score = 0;
  const tags = image.tags.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  const promptWords = originalPrompt.toLowerCase().split(/\s+/);

  // Exact keyword match in tags (highest priority)
  if (tags.includes(keywordLower)) {
    score += 25;
  }

  // Search term components in tags
  const searchWords = searchTerm.toLowerCase().split(/\s+/);
  searchWords.forEach(word => {
    if (word.length > 3 && tags.includes(word)) {
      score += 18;
    }
  });

  // Original prompt words in tags
  promptWords.forEach(word => {
    if (word.length > 3 && tags.includes(word)) {
      score += 15;
    }
  });

  // Boost for repair/maintenance related terms
  const repairTerms = ['repair', 'fix', 'maintenance', 'service', 'tool', 'workshop', 'mechanic', 'technician', 'garage', 'professional'];
  repairTerms.forEach(term => {
    if (tags.includes(term)) {
      score += 12;
    }
  });

  // Boost for specific tools and parts
  const toolTerms = ['wrench', 'screwdriver', 'hammer', 'pliers', 'drill', 'saw', 'tool', 'equipment', 'socket', 'ratchet'];
  toolTerms.forEach(term => {
    if (tags.includes(term)) {
      score += 10;
    }
  });

  // Boost for hands-on/tutorial content
  const tutorialTerms = ['hands', 'work', 'working', 'tutorial', 'instruction', 'step', 'process', 'demonstration'];
  tutorialTerms.forEach(term => {
    if (tags.includes(term)) {
      score += 8;
    }
  });

  // Boost for automotive specific terms if car-related
  if (originalPrompt.toLowerCase().includes('car') || originalPrompt.toLowerCase().includes('vehicle')) {
    const carTerms = ['car', 'vehicle', 'automotive', 'engine', 'brake', 'tire', 'oil', 'battery', 'mechanic', 'garage'];
    carTerms.forEach(term => {
      if (tags.includes(term)) {
        score += 15;
      }
    });
  }

  // Boost for step-specific relevance
  const stepBonus = getStepSpecificBonus(tags, stepIndex, originalPrompt);
  score += stepBonus;

  // Boost for high-quality images
  score += Math.min(image.likes / 50, 8);
  score += Math.min(image.views / 5000, 5);

  // Penalize completely unrelated content
  const irrelevantTerms = ['abstract', 'art', 'decoration', 'party', 'celebration', 'wedding', 'fashion', 'beauty', 'food', 'nature'];
  if (!originalPrompt.toLowerCase().includes('cook') && !originalPrompt.toLowerCase().includes('garden')) {
    irrelevantTerms.forEach(term => {
      if (tags.includes(term)) {
        score -= 15;
      }
    });
  }

  // Penalize stock business photos for technical topics
  const businessTerms = ['business', 'office', 'meeting', 'handshake', 'suit', 'corporate', 'team', 'conference'];
  if (originalPrompt.toLowerCase().includes('repair') || originalPrompt.toLowerCase().includes('fix')) {
    businessTerms.forEach(term => {
      if (tags.includes(term)) {
        score -= 12;
      }
    });
  }

  return Math.max(score, 0);
}

function getStepSpecificBonus(tags: string, stepIndex: number, originalPrompt: string): number {
  let bonus = 0;
  
  // Car repair step-specific bonuses
  if (originalPrompt.toLowerCase().includes('car')) {
    const carStepTerms = [
      ['tools', 'preparation', 'garage', 'workshop'],
      ['jack', 'lifting', 'safety', 'support'],
      ['engine', 'hood', 'inspection', 'check'],
      ['oil', 'fluid', 'drain', 'filter'],
      ['tire', 'wheel', 'removal', 'brake'],
      ['battery', 'electrical', 'connection', 'cable'],
      ['testing', 'diagnostic', 'check', 'verify'],
      ['assembly', 'installation', 'replacement', 'new'],
      ['cleanup', 'completion', 'finished', 'done'],
      ['quality', 'final', 'inspection', 'complete']
    ];
    
    if (stepIndex < carStepTerms.length) {
      const relevantTerms = carStepTerms[stepIndex];
      relevantTerms.forEach(term => {
        if (tags.includes(term)) {
          bonus += 10;
        }
      });
    }
  }
  
  return bonus;
}

async function fillMissingImages(imageUrls: string[], originalPrompt: string, keywords: string[]): Promise<void> {
  const missingIndices = imageUrls
    .map((url, index) => url ? null : index)
    .filter(index => index !== null) as number[];

  if (missingIndices.length === 0) return;

  try {
    // Get topic-specific fallback images with better search terms
    const mainTopic = getMainTopicFromPrompt(originalPrompt);
    
    const fallbackSearches = [
      `${mainTopic} professional`,
      `${mainTopic} workshop tools`,
      `repair maintenance garage`,
      `professional mechanic working`,
      `automotive repair shop`,
      `tools equipment workshop`
    ];

    for (const searchTerm of fallbackSearches) {
      if (missingIndices.length === 0) break;

      const fallbackResponse = await fetch(
        `${PIXABAY_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchTerm)}&image_type=photo&category=industry,transportation,science,education&min_width=1000&min_height=700&per_page=30&safesearch=true&order=popular`
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

    // Final fallback for any still missing images - high-quality topic-specific defaults
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
  
  if (lowerPrompt.includes('car') || lowerPrompt.includes('vehicle')) {
    return [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=800&fit=crop', // Car repair garage
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=800&fit=crop', // Auto tools
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&h=800&fit=crop', // Car maintenance
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=1200&h=800&fit=crop', // Auto workshop
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop', // Mechanic working
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&h=800&fit=crop', // Car engine
      'https://images.unsplash.com/photo-1544191696-15693072b5a7?w=1200&h=800&fit=crop', // Auto repair
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=800&fit=crop'  // Professional garage
    ];
  } else if (lowerPrompt.includes('bike') || lowerPrompt.includes('bicycle')) {
    return [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop', // Bike repair
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&h=800&fit=crop', // Bike tools
      'https://images.unsplash.com/photo-1544191696-15693072b5a7?w=1200&h=800&fit=crop', // Bike maintenance
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=800&fit=crop'  // Bike workshop
    ];
  } else {
    return [
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200&h=800&fit=crop', // General tools
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=800&fit=crop', // Workshop
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200&h=800&fit=crop', // Repair work
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200&h=800&fit=crop', // Tools and equipment
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=800&fit=crop', // Professional repair
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=1200&h=800&fit=crop'  // Workshop environment
    ];
  }
}