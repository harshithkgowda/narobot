import React, { useState, useEffect } from 'react';
import { X, Volume2, Play, Pause } from 'lucide-react';

interface VoiceSettingsProps {
  voiceEnabled: boolean;
  voiceSpeed: number;
  selectedVoice: string;
  onVoiceEnabledChange: (enabled: boolean) => void;
  onVoiceSpeedChange: (speed: number) => void;
  onVoiceChange: (voice: string) => void;
  onClose: () => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  voiceEnabled,
  voiceSpeed,
  selectedVoice,
  onVoiceEnabledChange,
  onVoiceSpeedChange,
  onVoiceChange,
  onClose
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const testVoice = (voice: SpeechSynthesisVoice) => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance('Hello! This is how I sound.');
    utterance.voice = voice;
    utterance.rate = voiceSpeed;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    
    speechSynthesis.speak(utterance);
  };

  const groupedVoices = voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0];
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Voice Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Voice Enable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Enable Voice</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Turn on voice narration for responses
              </p>
            </div>
            <button
              onClick={() => onVoiceEnabledChange(!voiceEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                voiceEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Voice Speed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">Speech Speed</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{voiceSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSpeed}
              onChange={(e) => onVoiceSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Voice Selection */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Voice Selection</h3>
            <div className="max-h-64 overflow-y-auto space-y-4">
              {Object.entries(groupedVoices).map(([lang, langVoices]) => (
                <div key={lang}>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    {lang}
                  </h4>
                  <div className="space-y-2">
                    {langVoices.map((voice) => (
                      <div
                        key={voice.name}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                          selectedVoice === voice.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex-1">
                          <button
                            onClick={() => onVoiceChange(voice.name)}
                            className="text-left w-full"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {voice.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {voice.lang} • {voice.localService ? 'Local' : 'Network'}
                            </div>
                          </button>
                        </div>
                        <button
                          onClick={() => testVoice(voice)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Test voice"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};