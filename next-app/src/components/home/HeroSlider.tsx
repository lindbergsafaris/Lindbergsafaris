'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { HeroSlide } from '@/types';

interface HeroSliderProps {
  slides: HeroSlide[];
}

const HeroSlider = ({ slides }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden group">
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${typeof slide.image === 'string' ? slide.image : slide.image?.url || ''}")` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <Container className="relative h-full flex items-center justify-center text-center z-20">
            <div className="max-w-4xl mx-auto px-4">
              {index === currentSlide ? (
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up">
                  {slide.title}
                </h1>
              ) : (
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up">
                  {slide.title}
                </h2>
              )}
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-100 animate-fade-in-up delay-100">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                <Link href={slide.primaryButtonLink || '/contact'}>
                  <Button size="lg">{slide.primaryButtonText || 'Start Your Journey'}</Button>
                </Link>
                <Link href={slide.secondaryButtonLink || '/tours'}>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                    {slide.secondaryButtonText || 'View Our Tours'}
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      ))}

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
