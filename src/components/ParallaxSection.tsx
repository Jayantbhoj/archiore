import { useEffect, useRef, useState, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxSection = ({
  children,
  speed = 0.5,
  className = '',
}: ParallaxSectionProps) => {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const { top } = sectionRef.current.getBoundingClientRect();
      const scrollOffset = window.scrollY;
      const elementOffset = top + scrollOffset;
      const windowHeight = window.innerHeight;
      
      // Only update when element is in view
      if (elementOffset < scrollOffset + windowHeight && 
          elementOffset + sectionRef.current.offsetHeight > scrollOffset) {
        // Calculate parallax offset
        const parallaxOffset = (scrollOffset - elementOffset) * speed;
        setOffset(parallaxOffset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return (
    <div 
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};