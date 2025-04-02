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
  const interval = 50;
  const containerRef = useRef<HTMLDivElement>(null);

  // 创建正方形元素的函数
  const createSquare = (x: number, y: number) => {
    const colors = ['#f9f383', '#eb125f', '#6eff8a', '#66ffff'];
    const quantity = 10;
    const distanceMin = 20;
    const distanceMax = 100;

    for (let i = 0; i < quantity; i++) {
      const square = document.createElement('div');
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomTranslateValue = () => 
        (Math.random() < 0.5 ? -1 : 1) * (distanceMin + Math.random() * (distanceMax - distanceMin));
      const randomSize = 10 + Math.random() * 15; // 随机大小
      const randomRotation = Math.random() * 360; // 随机旋转角度

      square.className = 'square';
      containerRef.current?.appendChild(square);
      
      setTimeout(() => {
        square.style.cssText = `
          background-color: ${randomColor};
          left: ${x}px;
          top: ${y}px;
          width: ${randomSize}px;
          height: ${randomSize}px;
          z-index: 999;
          transform: translate(${randomTranslateValue()}px, ${randomTranslateValue()}px) scale(0) rotate(${randomRotation}deg);
        `;
      }, 0);

      setTimeout(() => {
        square.remove();
      }, 700);
    }
  };

  // 处理鼠标移动和点击事件
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

    const handleClick = (e: MouseEvent) => {
      createSquare(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

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
      window.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
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
      <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998 }} />
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
        }
        body {
          background: #c27ecf;
        }
        .square {
          position: absolute;
          transform: translate(0px, 0px) scale(1);
          transition: all 0.7s ease-out;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default MouseTrail;