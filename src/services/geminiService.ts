import { GeminiResponse } from '../types';

const GEMINI_API_KEY = 'AIzaSyA8C75YTr-5WSkCOd6ajuev8oaBw5feAWU';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Create a detailed, step-by-step visual explanation about: ${prompt}. 

Structure your response in exactly 6-8 clear segments. Each segment should:
1. Be 1-2 sentences maximum (under 120 characters each)
2. Focus on a specific step, tool, or component that can be clearly illustrated
3. Use concrete, specific terminology (mention exact tools, parts, actions)
4. Be practical and actionable
5. Include visual elements that can be photographed or illustrated

Make each segment focus on different visual aspects like tools, parts, steps, or techniques. Keep the explanation practical and visual.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get response from Gemini API');
  }
}

export function extractKeywordsFromSegments(segments: string[], originalPrompt: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'there', 'here',
    'where', 'when', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose', 'very', 'really',
    'quite', 'rather', 'much', 'many', 'most', 'more', 'less', 'some', 'any', 'all', 'both',
    'each', 'every', 'other', 'another', 'such', 'only', 'own', 'same', 'so', 'than', 'too',
    'about', 'from', 'into', 'during', 'before', 'after', 'above', 'below', 'between', 'through',
    'also', 'then', 'now', 'first', 'second', 'third', 'important', 'process', 'system', 'way',
    'part', 'example', 'different', 'various', 'several', 'including', 'such', 'like', 'called',
    'step', 'steps', 'make', 'sure', 'need', 'needs', 'use', 'using', 'used'
  ]);

  // Extract main topic from original prompt
  const mainTopic = extractMainTopic(originalPrompt);
  
  return segments.map((segment, index) => {
    // Clean and tokenize the segment
    const words = segment
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    // Score words based on relevance to the topic
    const wordScores = new Map<string, number>();
    
    words.forEach((word, position) => {
      let score = 0;
      
      // Base frequency score
      score += 1;
      
      // Boost specific tools, parts, and actions
      if (isToolOrPart(word, mainTopic)) {
        score += 15;
      }
      
      // Boost action words related to the topic
      if (isActionWord(word, mainTopic)) {
        score += 12;
      }
      
      // Boost if word appears early in segment (more important)
      if (position < words.length * 0.4) {
        score += 5;
      }
      
      // Boost technical terms related to main topic
      if (isTechnicalTerm(word, mainTopic)) {
        score += 10;
      }
      
      // Boost visual/concrete nouns
      if (isVisualNoun(word)) {
        score += 8;
      }
      
      // Penalize very generic words
      if (isGenericWord(word)) {
        score -= 5;
      }
      
      wordScores.set(word, (wordScores.get(word) || 0) + score);
    });

    // Get the best keywords for this segment
    const sortedWords = Array.from(wordScores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedWords.length > 0) {
      const bestWord = sortedWords[0][0];
      
      // Create highly specific search term
      return createSpecificSearchTerm(bestWord, segment, mainTopic, originalPrompt);
    }
    
    // Fallback to main topic
    return mainTopic;
  });
}

function extractMainTopic(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Define topic mappings with their key components
  const topicMappings = {
    'bike': ['bicycle', 'bike', 'cycling', 'wheel', 'chain', 'gear', 'brake', 'tire'],
    'car': ['car', 'automobile', 'vehicle', 'engine', 'brake', 'tire', 'transmission'],
    'computer': ['computer', 'laptop', 'pc', 'hardware', 'software', 'motherboard', 'cpu'],
    'phone': ['phone', 'smartphone', 'mobile', 'screen', 'battery', 'charging'],
    'cooking': ['cook', 'recipe', 'kitchen', 'food', 'ingredient', 'pan', 'oven'],
    'garden': ['garden', 'plant', 'flower', 'soil', 'water', 'seed', 'grow'],
    'exercise': ['exercise', 'workout', 'fitness', 'muscle', 'training', 'gym'],
    'study': ['study', 'learn', 'education', 'book', 'knowledge', 'school'],
    'clean': ['clean', 'cleaning', 'wash', 'soap', 'vacuum', 'dust'],
    'paint': ['paint', 'painting', 'brush', 'color', 'wall', 'canvas'],
    'music': ['music', 'instrument', 'guitar', 'piano', 'song', 'sound'],
    'photography': ['photo', 'camera', 'picture', 'lens', 'light', 'image']
  };

  // Find the best matching topic
  for (const [topic, keywords] of Object.entries(topicMappings)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return topic;
    }
  }

  // Extract first meaningful noun as fallback
  const words = lowerPrompt.replace(/[^\w\s]/g, ' ').split(/\s+/);
  const meaningfulWord = words.find(word => 
    word.length > 3 && 
    !['what', 'how', 'why', 'when', 'where', 'explain', 'tell', 'about', 'does', 'work', 'make', 'repair', 'fix'].includes(word)
  );

  return meaningfulWord || 'repair';
}

function isToolOrPart(word: string, mainTopic: string): boolean {
  const toolsAndParts = {
    'bike': ['wrench', 'screwdriver', 'chain', 'wheel', 'tire', 'brake', 'gear', 'pedal', 'handlebar', 'seat', 'spoke', 'derailleur', 'cassette', 'crankset', 'tube', 'pump'],
    'car': ['wrench', 'jack', 'tire', 'engine', 'brake', 'oil', 'filter', 'battery', 'alternator', 'radiator', 'transmission', 'clutch', 'spark', 'plug'],
    'computer': ['screwdriver', 'motherboard', 'cpu', 'ram', 'harddrive', 'graphics', 'card', 'power', 'supply', 'cable', 'monitor', 'keyboard', 'mouse'],
    'phone': ['screwdriver', 'screen', 'battery', 'charger', 'cable', 'speaker', 'microphone', 'camera', 'button', 'port'],
    'cooking': ['knife', 'pan', 'pot', 'oven', 'stove', 'spatula', 'whisk', 'bowl', 'cutting', 'board', 'ingredient'],
    'garden': ['shovel', 'rake', 'hose', 'seed', 'soil', 'fertilizer', 'pruner', 'gloves', 'watering', 'can'],
    'clean': ['vacuum', 'mop', 'bucket', 'soap', 'detergent', 'brush', 'cloth', 'sponge', 'cleaner'],
    'paint': ['brush', 'roller', 'paint', 'primer', 'canvas', 'palette', 'easel', 'spray'],
    'exercise': ['dumbbell', 'barbell', 'treadmill', 'mat', 'weights', 'resistance', 'band'],
    'music': ['guitar', 'piano', 'drum', 'violin', 'microphone', 'amplifier', 'string', 'pick']
  };

  const relevantTools = toolsAndParts[mainTopic] || [];
  return relevantTools.some(tool => word.includes(tool) || tool.includes(word));
}

function isActionWord(word: string, mainTopic: string): boolean {
  const actionWords = {
    'bike': ['adjust', 'tighten', 'loosen', 'replace', 'install', 'remove', 'clean', 'lubricate', 'inflate', 'align'],
    'car': ['change', 'replace', 'check', 'fill', 'drain', 'tighten', 'connect', 'disconnect', 'start', 'stop'],
    'computer': ['install', 'connect', 'disconnect', 'update', 'restart', 'backup', 'format', 'scan'],
    'phone': ['charge', 'restart', 'update', 'backup', 'reset', 'connect', 'sync'],
    'cooking': ['chop', 'slice', 'mix', 'stir', 'bake', 'fry', 'boil', 'season', 'marinate'],
    'garden': ['plant', 'water', 'prune', 'fertilize', 'weed', 'harvest', 'dig', 'mulch'],
    'clean': ['scrub', 'wipe', 'vacuum', 'mop', 'dust', 'wash', 'rinse', 'dry'],
    'paint': ['brush', 'roll', 'spray', 'mix', 'prime', 'sand', 'mask'],
    'exercise': ['lift', 'push', 'pull', 'stretch', 'run', 'walk', 'squat', 'press'],
    'music': ['play', 'strum', 'press', 'blow', 'tune', 'practice', 'record']
  };

  const relevantActions = actionWords[mainTopic] || ['repair', 'fix', 'maintain', 'service'];
  return relevantActions.includes(word);
}

function isTechnicalTerm(word: string, mainTopic: string): boolean {
  const technicalTerms = {
    'bike': ['derailleur', 'cassette', 'crankset', 'chainring', 'freewheel', 'headset', 'bottom', 'bracket'],
    'car': ['carburetor', 'alternator', 'radiator', 'transmission', 'differential', 'catalytic', 'converter'],
    'computer': ['motherboard', 'processor', 'graphics', 'harddrive', 'memory', 'bios', 'firmware'],
    'phone': ['touchscreen', 'digitizer', 'motherboard', 'processor', 'antenna', 'sensor'],
    'cooking': ['sauté', 'braise', 'julienne', 'emulsify', 'caramelize', 'reduction'],
    'garden': ['photosynthesis', 'germination', 'pollination', 'composting', 'mulching'],
    'clean': ['disinfectant', 'sanitizer', 'degreaser', 'solvent'],
    'paint': ['primer', 'undercoat', 'topcoat', 'pigment', 'binder'],
    'exercise': ['cardiovascular', 'anaerobic', 'aerobic', 'metabolism', 'endurance'],
    'music': ['frequency', 'amplitude', 'resonance', 'harmony', 'melody']
  };

  const relevantTerms = technicalTerms[mainTopic] || [];
  return relevantTerms.some(term => word.includes(term) || term.includes(word));
}

function isVisualNoun(word: string): boolean {
  const visualNouns = [
    'tool', 'part', 'component', 'piece', 'section', 'area', 'surface', 'edge', 'corner',
    'handle', 'grip', 'button', 'switch', 'lever', 'knob', 'dial', 'gauge', 'meter',
    'wire', 'cable', 'tube', 'pipe', 'hose', 'belt', 'strap', 'band', 'ring',
    'screw', 'bolt', 'nut', 'washer', 'spring', 'bearing', 'seal', 'gasket',
    'frame', 'housing', 'case', 'cover', 'panel', 'door', 'lid', 'cap'
  ];
  return visualNouns.includes(word);
}

function isGenericWord(word: string): boolean {
  const genericWords = [
    'thing', 'things', 'something', 'anything', 'everything', 'nothing',
    'item', 'items', 'stuff', 'material', 'object', 'device', 'equipment',
    'problem', 'issue', 'trouble', 'difficulty', 'situation', 'condition',
    'method', 'technique', 'approach', 'solution', 'answer', 'result'
  ];
  return genericWords.includes(word);
}

function createSpecificSearchTerm(mainKeyword: string, segment: string, mainTopic: string, originalPrompt: string): string {
  // Create highly specific search terms by combining relevant keywords
  const segmentWords = segment.toLowerCase().split(/\s+/);
  
  // Look for tools, parts, or actions in the segment
  const tools = segmentWords.filter(word => isToolOrPart(word, mainTopic));
  const actions = segmentWords.filter(word => isActionWord(word, mainTopic));
  
  // Build specific search term
  let searchTerm = mainKeyword;
  
  // Add main topic for context
  if (!searchTerm.includes(mainTopic)) {
    searchTerm = `${mainTopic} ${searchTerm}`;
  }
  
  // Add specific tool or action if found
  if (tools.length > 0 && !searchTerm.includes(tools[0])) {
    searchTerm = `${searchTerm} ${tools[0]}`;
  } else if (actions.length > 0 && !searchTerm.includes(actions[0])) {
    searchTerm = `${searchTerm} ${actions[0]}`;
  }
  
  // Add repair/maintenance context if not present
  if (!searchTerm.includes('repair') && !searchTerm.includes('fix') && !searchTerm.includes('maintenance')) {
    if (originalPrompt.toLowerCase().includes('repair') || originalPrompt.toLowerCase().includes('fix')) {
      searchTerm = `${searchTerm} repair`;
    }
  }
  
  return searchTerm.trim();
}

export function splitTextIntoSegments(text: string, targetSegments: number = 7): string[] {
  // First try to split by clear paragraph breaks or numbered steps
  let segments = text.split(/\n\s*\n/).filter(s => s.trim().length > 15);
  
  // Try splitting by numbered points or bullet points
  if (segments.length < targetSegments) {
    const numberedSections = text.split(/(?:\d+\.|•|\*|-)\s+/).filter(s => s.trim().length > 15);
    if (numberedSections.length >= targetSegments) {
      segments = numberedSections;
    }
  }
  
  // Split by sentences but group them intelligently for 10-second timing
  if (segments.length < targetSegments) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length <= targetSegments) {
      segments = sentences.map(s => s.trim() + '.');
    } else {
      // Group sentences into logical segments for 10-second slideshow
      const segmentSize = Math.ceil(sentences.length / targetSegments);
      segments = [];
      
      for (let i = 0; i < sentences.length; i += segmentSize) {
        const segmentSentences = sentences.slice(i, i + segmentSize);
        const segment = segmentSentences.join('. ').trim();
        if (segment) {
          segments.push(segment + (segment.endsWith('.') ? '' : '.'));
        }
      }
    }
  }

  // Ensure we have exactly the target number of segments
  if (segments.length > targetSegments) {
    const newSegments = [];
    const segmentsPerGroup = Math.ceil(segments.length / targetSegments);
    
    for (let i = 0; i < segments.length; i += segmentsPerGroup) {
      const group = segments.slice(i, i + segmentsPerGroup);
      newSegments.push(group.join(' '));
    }
    segments = newSegments;
  }

  // Ensure segments are concise for 10-second timing (max 120 characters)
  segments = segments.map(segment => {
    if (segment.length > 120) {
      const words = segment.split(' ');
      const truncated = words.slice(0, 18).join(' ');
      return truncated + (truncated.endsWith('.') ? '' : '.');
    }
    return segment;
  });

  return segments.filter(s => s.trim().length > 5).slice(0, targetSegments);
}