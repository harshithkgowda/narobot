import React from 'react';
import { X, Palette, RotateCcw } from 'lucide-react';

interface ThemeCustomizerProps {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  onThemeChange: (theme: any) => void;
  onClose: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme,
  onThemeChange,
  onClose
}) => {
  const presetThemes = [
    {
      name: 'Ocean Blue',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f8fafc'
      }
    },
    {
      name: 'Forest Green',
      colors: {
        primary: '#10b981',
        secondary: '#047857',
        accent: '#34d399',
        background: '#ffffff',
        surface: '#f0fdf4'
      }
    },
    {
      name: 'Sunset Orange',
      colors: {
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        background: '#ffffff',
        surface: '#fff7ed'
      }
    },
    {
      name: 'Purple Dream',
      colors: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        accent: '#a78bfa',
        background: '#ffffff',
        surface: '#faf5ff'
      }
    },
    {
      name: 'Rose Gold',
      colors: {
        primary: '#f43f5e',
        secondary: '#e11d48',
        accent: '#fb7185',
        background: '#ffffff',
        surface: '#fff1f2'
      }
    },
    {
      name: 'Dark Mode',
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        accent: '#06b6d4',
        background: '#111827',
        surface: '#1f2937'
      }
    }
  ];

  const resetToDefault = () => {
    onThemeChange(presetThemes[0].colors);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Theme Customizer
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
          {/* Preset Themes */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preset Themes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onThemeChange(preset.colors)}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all hover:scale-105"
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Custom Colors</h3>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(theme).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {key}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => onThemeChange({ ...theme, [key]: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onThemeChange({ ...theme, [key]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
            <div 
              className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600"
              style={{ backgroundColor: theme.surface }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: theme.primary }}>
                    Sample Message
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This is how your theme will look
                  </p>
                </div>
              </div>
              <div 
                className="px-4 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: theme.secondary }}
              >
                User message with custom theme
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};