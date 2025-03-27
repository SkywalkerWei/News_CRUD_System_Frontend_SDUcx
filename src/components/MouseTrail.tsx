import React, { useState, useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  size: number;
  color: string;
  opacity: number;
}

const MouseTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const counterRef = useRef(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const interval = 50; // 间隔时间(毫秒)，增大此值会增加间隔

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current < interval) return;
      
      lastTimeRef.current = now;
      counterRef.current += 1;
      
      const colors = ['#62a452', '#9dd791', '#92bd89', '#d0f1c6'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomSize = 5 + Math.random() * 6;
      
      setTrail(prev => [
        ...prev,
        {
          x: e.clientX,
          y: e.clientY,
          id: counterRef.current,
          size: randomSize,
          color: randomColor,
          opacity: 1
        }
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      setTrail(prev => {
        const updated = prev.map(point => ({
          ...point,
          opacity: point.opacity - 0.02
        }));
        return updated.filter(point => point.opacity > 0);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {trail.map(point => (
        <div
          key={point.id}
          style={{
            position: 'absolute',
            left: point.x,
            top: point.y,
            width: `${point.size}px`,
            height: `${point.size}px`,
            borderRadius: '50%',
            backgroundColor: point.color,
            transform: 'translate(-50%, -50%)',
            opacity: point.opacity,
            transition: 'opacity 0.1s ease'
          }}
        />
      ))}
    </div>
  );
};

export default MouseTrail;