import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { SlideContent } from '../types';
import { speechService } from '../services/speechService';

interface SlideshowViewerProps {
  slides: SlideContent[];
  autoStart?: boolean;
}

export const SlideshowViewer: React.FC<SlideshowViewerProps> = ({ slides, autoStart = true }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      if (next >= slides.length) {
        setIsPlaying(false);
        return prev;
      }
      return next;
    });
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const startSlideshow = useCallback(() => {
    setIsPlaying(true);
    setHasStarted(true);
    setCurrentSlide(0);
  }, []);

  const stopSlideshow = useCallback(() => {
    setIsPlaying(false);
    speechService.stop();
    setIsSpeaking(false);
  }, []);

  const restartSlideshow = useCallback(() => {
    setCurrentSlide(0);
    setIsPlaying(true);
    setHasStarted(true);
  }, []);

  const speakCurrentSlide = useCallback(() => {
    if (currentSlide < slides.length) {
      const currentText = slides[currentSlide]?.caption || '';
      if (currentText) {
        speechService.speak(currentText, () => {
          setIsSpeaking(false);
          if (isPlaying) {
            setTimeout(() => {
              nextSlide();
            }, 800); // Reduced delay for 10-second total
          }
        });
        setIsSpeaking(true);
      }
    }
  }, [currentSlide, slides, isPlaying, nextSlide]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (autoStart && slides.length > 0 && !hasStarted) {
      setTimeout(() => {
        startSlideshow();
      }, 500);
    }
  }, [autoStart, slides.length, hasStarted, startSlideshow]);

  useEffect(() => {
    if (isPlaying && currentSlide < slides.length) {
      speakCurrentSlide();
    }
  }, [currentSlide, isPlaying, speakCurrentSlide]);

  useEffect(() => {
    if (currentSlide >= slides.length - 1 && !isSpeaking && isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
      }, 1000);
    }
  }, [currentSlide, slides.length, isSpeaking, isPlaying]);

  if (slides.length === 0) {
    return (
      <div className="slideshow-container p-8 text-center">
        <p className="text-gray-400">No slides available</p>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className={`slideshow-container transition-all duration-500 ${
      isFullscreen ? 'fixed inset-4 z-50' : 'max-w-4xl mx-auto'
    }`}>
      {/* Progress Bar */}
      <div className="slide-progress">
        <div 
          className="slide-progress-fill transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide Content */}
      <div className="relative group">
        <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'aspect-video'} bg-gray-800 flex items-center justify-center relative overflow-hidden`}>
          {currentSlideData.image ? (
            <div className="relative w-full h-full">
              <img
                src={currentSlideData.image}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          ) : (
            <div className="text-gray-400 text-center animate-pulse">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium">Loading visual content...</p>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          disabled={currentSlide >= slides.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </div>
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-pulse">
            <Volume2 className="w-4 h-4" />
            <span className="font-medium">Narrating...</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Caption and Controls */}
      <div className="p-6 bg-gray-800">
        <p className="text-gray-200 leading-relaxed mb-4 text-base">
          {currentSlideData.caption}
        </p>

        {/* Keywords */}
        {currentSlideData.keywords && currentSlideData.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentSlideData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="keyword-tag"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? stopSlideshow : startSlideshow}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={restartSlideshow}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>

            <button
              onClick={() => {
                if (isSpeaking) {
                  speechService.stop();
                  setIsSpeaking(false);
                } else {
                  speakCurrentSlide();
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isSpeaking
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isSpeaking ? 'Stop' : 'Narrate'}
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-blue-500 scale-125'
                    : index < currentSlide
                    ? 'bg-green-500'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};