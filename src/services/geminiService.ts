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
                text: `You are an expert instructor creating a step-by-step visual guide about: ${prompt}

Create a detailed, practical explanation with 8-10 clear steps. Each step should:
1. Be conversational and natural (like talking to a friend)
2. Be 1-2 sentences maximum (under 100 characters each)
3. Focus on specific, visual actions that can be clearly shown in photos
4. Use "as shown" or "you can see" instead of mentioning "image" directly
5. Include specific tool names, part names, and exact actions
6. Be practical and actionable for someone actually doing this task

Write in a friendly, helpful tone as if you're guiding someone through the process in person. Focus on what they would actually see and do at each step.

Example format:
"First, gather your basic tools as shown - you'll need a wrench set and screwdriver."
"Next, locate the main component you can see here - it's usually near the center."

Make each step focus on different visual elements like tools, parts, locations, or specific actions.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1200,
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
    'step', 'steps', 'make', 'sure', 'need', 'needs', 'use', 'using', 'used', 'shown', 'see',
    'can', 'you', 'your', 'here', 'as'
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
        score += 20;
      }
      
      // Boost action words related to the topic
      if (isActionWord(word, mainTopic)) {
        score += 15;
      }
      
      // Boost if word appears early in segment (more important)
      if (position < words.length * 0.4) {
        score += 8;
      }
      
      // Boost technical terms related to main topic
      if (isTechnicalTerm(word, mainTopic)) {
        score += 12;
      }
      
      // Boost visual/concrete nouns
      if (isVisualNoun(word)) {
        score += 10;
      }
      
      // Boost specific car parts for car-related queries
      if (mainTopic === 'car' && isCarPart(word)) {
        score += 18;
      }
      
      // Penalize very generic words
      if (isGenericWord(word)) {
        score -= 8;
      }
      
      wordScores.set(word, (wordScores.get(word) || 0) + score);
    });

    // Get the best keywords for this segment
    const sortedWords = Array.from(wordScores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedWords.length > 0) {
      const bestWord = sortedWords[0][0];
      
      // Create highly specific search term
      return createSpecificSearchTerm(bestWord, segment, mainTopic, originalPrompt, index);
    }
    
    // Fallback to main topic
    return mainTopic;
  });
}

function extractMainTopic(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Define topic mappings with their key components
  const topicMappings = {
    'car': ['car', 'automobile', 'vehicle', 'engine', 'brake', 'tire', 'transmission', 'oil', 'battery', 'radiator'],
    'bike': ['bicycle', 'bike', 'cycling', 'wheel', 'chain', 'gear', 'brake', 'tire'],
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

function isCarPart(word: string): boolean {
  const carParts = [
    'engine', 'brake', 'tire', 'wheel', 'battery', 'alternator', 'radiator', 'transmission',
    'clutch', 'spark', 'plug', 'filter', 'oil', 'coolant', 'belt', 'hose', 'pump',
    'starter', 'ignition', 'exhaust', 'muffler', 'suspension', 'shock', 'strut',
    'headlight', 'taillight', 'bumper', 'fender', 'hood', 'trunk', 'door',
    'windshield', 'mirror', 'wiper', 'seat', 'steering', 'dashboard', 'gauge'
  ];
  return carParts.some(part => word.includes(part) || part.includes(word));
}

function isToolOrPart(word: string, mainTopic: string): boolean {
  const toolsAndParts = {
    'car': ['wrench', 'socket', 'ratchet', 'screwdriver', 'pliers', 'jack', 'jackstand', 'funnel', 'drain', 'pan', 'filter', 'wrench', 'torque', 'multimeter', 'jumper', 'cables'],
    'bike': ['wrench', 'screwdriver', 'chain', 'wheel', 'tire', 'brake', 'gear', 'pedal', 'handlebar', 'seat', 'spoke', 'derailleur', 'cassette', 'crankset', 'tube', 'pump'],
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
    'car': ['change', 'replace', 'check', 'fill', 'drain', 'tighten', 'connect', 'disconnect', 'start', 'stop', 'remove', 'install', 'inspect', 'test'],
    'bike': ['adjust', 'tighten', 'loosen', 'replace', 'install', 'remove', 'clean', 'lubricate', 'inflate', 'align'],
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
    'car': ['carburetor', 'alternator', 'radiator', 'transmission', 'differential', 'catalytic', 'converter', 'thermostat', 'serpentine', 'timing'],
    'bike': ['derailleur', 'cassette', 'crankset', 'chainring', 'freewheel', 'headset', 'bottom', 'bracket'],
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

function createSpecificSearchTerm(mainKeyword: string, segment: string, mainTopic: string, originalPrompt: string, stepIndex: number): string {
  // Create highly specific search terms by combining relevant keywords
  const segmentWords = segment.toLowerCase().split(/\s+/);
  
  // Look for tools, parts, or actions in the segment
  const tools = segmentWords.filter(word => isToolOrPart(word, mainTopic));
  const actions = segmentWords.filter(word => isActionWord(word, mainTopic));
  const carParts = segmentWords.filter(word => isCarPart(word));
  
  // Build specific search term based on step
  let searchTerm = '';
  
  // For car repairs, create step-specific searches
  if (mainTopic === 'car') {
    const carStepMappings = [
      'car repair tools garage',
      'car jack lifting vehicle',
      'car engine hood open',
      'car oil drain pan underneath',
      'car tire wheel removal',
      'car battery jumper cables',
      'car brake inspection',
      'car filter replacement',
      'car mechanic working',
      'car maintenance completed'
    ];
    
    if (stepIndex < carStepMappings.length) {
      searchTerm = carStepMappings[stepIndex];
    }
  }
  
  // If no step mapping, build dynamically
  if (!searchTerm) {
    searchTerm = mainKeyword;
    
    // Add main topic for context
    if (!searchTerm.includes(mainTopic)) {
      searchTerm = `${mainTopic} ${searchTerm}`;
    }
    
    // Add specific car part if found
    if (carParts.length > 0 && !searchTerm.includes(carParts[0])) {
      searchTerm = `${searchTerm} ${carParts[0]}`;
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
  }
  
  return searchTerm.trim();
}

export function splitTextIntoSegments(text: string, targetSegments: number = 8): string[] {
  // Remove any markdown formatting and asterisks
  let cleanText = text.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove **bold**
  cleanText = cleanText.replace(/\*([^*]+)\*/g, '$1'); // Remove *italic*
  cleanText = cleanText.replace(/\*+/g, ''); // Remove any remaining asterisks
  cleanText = cleanText.replace(/#+\s*/g, ''); // Remove markdown headers
  
  // First try to split by clear paragraph breaks or numbered steps
  let segments = cleanText.split(/\n\s*\n/).filter(s => s.trim().length > 15);
  
  // Try splitting by numbered points or bullet points
  if (segments.length < targetSegments) {
    const numberedSections = cleanText.split(/(?:\d+\.|•|\*|-)\s+/).filter(s => s.trim().length > 15);
    if (numberedSections.length >= targetSegments) {
      segments = numberedSections;
    }
  }
  
  // Split by sentences but group them intelligently
  if (segments.length < targetSegments) {
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length <= targetSegments) {
      segments = sentences.map(s => s.trim() + '.');
    } else {
      // Group sentences into logical segments
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

  // Clean up segments and ensure they're concise
  segments = segments.map(segment => {
    // Remove any remaining asterisks or markdown
    let cleanSegment = segment.replace(/\*+/g, '').trim();
    
    // Ensure proper capitalization
    cleanSegment = cleanSegment.charAt(0).toUpperCase() + cleanSegment.slice(1);
    
    // Keep segments concise (max 100 characters for better narration)
    if (cleanSegment.length > 100) {
      const words = cleanSegment.split(' ');
      const truncated = words.slice(0, 15).join(' ');
      cleanSegment = truncated + (truncated.endsWith('.') ? '' : '.');
    }
    
    return cleanSegment;
  });

  return segments.filter(s => s.trim().length > 5).slice(0, targetSegments);
}