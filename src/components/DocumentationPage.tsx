import React, { useState } from 'react';
import { X, BookOpen, Search, ChevronRight, Code, Zap, MessageCircle, Settings, Globe, Mic, Palette, BarChart3, Download, HelpCircle } from 'lucide-react';

interface DocumentationPageProps {
  onClose: () => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-4 h-4" />,
      content: {
        title: 'Getting Started with Narobot',
        description: 'Learn how to use Narobot AI assistant effectively',
        items: [
          {
            title: 'Quick Start Guide',
            content: `Welcome to Narobot! Here's how to get started:

1. **Start a Conversation**: Simply type your question or request in the input field at the bottom of the screen.

2. **Use Voice Input**: Click the microphone button to speak your question instead of typing.

3. **Choose Your Language**: Click the language button in the header to select from 12+ supported languages.

4. **Customize Your Experience**: Use the theme customizer to personalize the interface colors and appearance.

5. **Access Advanced Features**: Upgrade to Pro or Enterprise for unlimited conversations and premium features.`
          },
          {
            title: 'Basic Features',
            content: `Narobot offers several core features:

• **Smart Conversations**: Get intelligent responses to your questions
• **Visual Learning**: Receive slideshow presentations for complex topics
• **Voice Synthesis**: Listen to responses in your preferred language
• **Conversation History**: Access your previous conversations anytime
• **Export Options**: Download your conversations for future reference`
          }
        ]
      }
    },
    {
      id: 'features',
      title: 'Features',
      icon: <MessageCircle className="w-4 h-4" />,
      content: {
        title: 'Narobot Features',
        description: 'Comprehensive guide to all available features',
        items: [
          {
            title: 'AI Conversations',
            content: `Narobot uses advanced AI to provide intelligent responses:

• **Natural Language Processing**: Understands context and nuance
• **Multi-turn Conversations**: Maintains context across multiple exchanges
• **Smart Suggestions**: Get relevant prompts based on your needs
• **Real-time Responses**: Fast, accurate answers to your questions`
          },
          {
            title: 'Visual Learning',
            content: `Learn with interactive slideshows:

• **Automatic Slideshow Generation**: Visual guides for complex topics
• **Image Integration**: Relevant images from Pixabay
• **Voice Narration**: Listen to explanations while viewing slides
• **Interactive Controls**: Play, pause, and navigate at your own pace`
          },
          {
            title: 'Voice Features',
            content: `Advanced voice capabilities:

• **Speech Recognition**: Speak your questions naturally
• **Text-to-Speech**: Listen to responses in multiple languages
• **Voice Settings**: Customize speed, pitch, and voice selection
• **Multi-language Support**: Native pronunciation for each language`
          }
        ]
      }
    },
    {
      id: 'languages',
      title: 'Languages',
      icon: <Globe className="w-4 h-4" />,
      content: {
        title: 'Multi-language Support',
        description: 'Use Narobot in your preferred language',
        items: [
          {
            title: 'Supported Languages',
            content: `Narobot supports 12+ languages:

• **English** (en) - Full feature support
• **Spanish** (es) - Español
• **French** (fr) - Français  
• **German** (de) - Deutsch
• **Chinese** (zh) - 中文
• **Japanese** (ja) - 日本語
• **Korean** (ko) - 한국어
• **Italian** (it) - Italiano
• **Portuguese** (pt) - Português
• **Russian** (ru) - Русский
• **Arabic** (ar) - العربية
• **Hindi** (hi) - हिन्दी`
          },
          {
            title: 'Language Features',
            content: `Each language includes:

• **Interface Translation**: Complete UI in your language
• **Voice Synthesis**: Native pronunciation and intonation
• **Speech Recognition**: Understand your spoken input
• **Cultural Context**: Responses adapted to cultural norms
• **Conversation History**: Language-specific organization`
          }
        ]
      }
    },
    {
      id: 'customization',
      title: 'Customization',
      icon: <Palette className="w-4 h-4" />,
      content: {
        title: 'Customize Your Experience',
        description: 'Personalize Narobot to match your preferences',
        items: [
          {
            title: 'Theme Customization',
            content: `Personalize your interface:

• **Color Themes**: Choose from 6 preset themes or create custom colors
• **Dark/Light Mode**: Toggle between dark and light interfaces
• **Live Preview**: See changes in real-time
• **Custom Colors**: Set primary, secondary, accent, background, and surface colors
• **Gradient Support**: Beautiful gradient backgrounds and elements`
          },
          {
            title: 'Voice Settings',
            content: `Customize voice features:

• **Voice Selection**: Choose from available system voices
• **Speech Speed**: Adjust from 0.5x to 2x speed
• **Language-specific Voices**: Native voices for each supported language
• **Voice Testing**: Preview voices before selection
• **Enable/Disable**: Turn voice features on or off`
          }
        ]
      }
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      content: {
        title: 'Conversation Analytics',
        description: 'Track your usage and conversation patterns',
        items: [
          {
            title: 'Usage Statistics',
            content: `Monitor your Narobot usage:

• **Message Count**: Total messages sent and received
• **Conversation Tracking**: Number of conversations started
• **Response Time**: Average AI response times
• **Satisfaction Rate**: Track your experience quality
• **Language Usage**: See which languages you use most`
          },
          {
            title: 'Conversation Management',
            content: `Organize your conversations:

• **Star Important Chats**: Mark conversations for easy access
• **Search History**: Find specific conversations quickly
• **Language Filtering**: Filter by conversation language
• **Export Data**: Download conversation history
• **Delete Management**: Remove unwanted conversations`
          }
        ]
      }
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: <Settings className="w-4 h-4" />,
      content: {
        title: 'Subscription Plans',
        description: 'Choose the right plan for your needs',
        items: [
          {
            title: 'Free Plan',
            content: `Get started with basic features:

• **10 conversations per day**
• **Basic AI responses**
• **Standard voice synthesis**
• **Email support**
• **1 language support**
• **Basic themes**

Perfect for trying out Narobot and light usage.`
          },
          {
            title: 'Pro Plan ($19/month)',
            content: `Unlock advanced features:

• **Unlimited conversations**
• **Advanced AI responses**
• **Premium voice synthesis**
• **Priority support**
• **12+ language support**
• **Custom themes**
• **Conversation analytics**
• **Export conversations**
• **Advanced search**
• **Voice input/output**

Best for professionals and power users.`
          },
          {
            title: 'Enterprise Plan ($49/month)',
            content: `For teams and organizations:

• **Everything in Pro**
• **Team collaboration**
• **Admin dashboard**
• **Custom integrations**
• **API access**
• **White-label options**
• **Dedicated support**
• **Custom AI training**
• **Advanced security**
• **SLA guarantee**
• **Custom deployment**
• **Unlimited team members**`
          }
        ]
      }
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: <Code className="w-4 h-4" />,
      content: {
        title: 'API Documentation',
        description: 'Integrate Narobot into your applications (Enterprise only)',
        items: [
          {
            title: 'Authentication',
            content: `API authentication using Bearer tokens:

\`\`\`javascript
const response = await fetch('https://api.narobot.com/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Hello, Narobot!',
    language: 'en'
  })
});
\`\`\`

Get your API key from the Enterprise dashboard.`
          },
          {
            title: 'Chat Endpoint',
            content: `Send messages to Narobot:

**POST** \`/v1/chat\`

Request body:
\`\`\`json
{
  "message": "Your question here",
  "language": "en",
  "voice_enabled": true,
  "user_id": "optional_user_id"
}
\`\`\`

Response:
\`\`\`json
{
  "response": "AI response text",
  "slideshow": [...],
  "audio_url": "https://...",
  "conversation_id": "uuid"
}
\`\`\``
          }
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <HelpCircle className="w-4 h-4" />,
      content: {
        title: 'Common Issues & Solutions',
        description: 'Resolve common problems quickly',
        items: [
          {
            title: 'Voice Not Working',
            content: `If voice features aren't working:

1. **Check Browser Permissions**: Ensure microphone access is allowed
2. **Update Browser**: Use the latest version of Chrome, Firefox, or Safari
3. **Check Voice Settings**: Verify voice synthesis is enabled
4. **Test Different Voices**: Try selecting a different voice option
5. **Restart Browser**: Close and reopen your browser

If issues persist, contact support.`
          },
          {
            title: 'Slow Responses',
            content: `If AI responses are slow:

1. **Check Internet Connection**: Ensure stable internet connectivity
2. **Clear Browser Cache**: Clear cache and cookies
3. **Disable Extensions**: Temporarily disable browser extensions
4. **Try Different Browser**: Test with another browser
5. **Check Server Status**: Visit our status page for updates

Response times are typically under 3 seconds.`
          },
          {
            title: 'Theme Not Applying',
            content: `If custom themes aren't working:

1. **Refresh Page**: Hard refresh with Ctrl+F5 (Cmd+Shift+R on Mac)
2. **Clear Cache**: Clear browser cache and cookies
3. **Check Browser Support**: Ensure CSS custom properties are supported
4. **Reset Theme**: Try resetting to default theme
5. **Update Browser**: Use the latest browser version

Custom themes require modern browser support.`
          }
        ]
      }
    }
  ];

  const currentSection = sections.find(s => s.id === selectedSection);
  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.items.some(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Documentation
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.icon}
                  <span className="text-sm font-medium">{section.title}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentSection?.content.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentSection?.content.description}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl space-y-8">
              {currentSection?.content.items.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Need more help? Contact our support team.
              </div>
              <div className="flex items-center gap-4">
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Contact Support
                </button>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};