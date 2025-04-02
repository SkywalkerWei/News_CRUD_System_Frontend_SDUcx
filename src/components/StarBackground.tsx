import React, { useEffect, useRef } from 'react';

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Constants
  const STAR_COLOR = '#fff';
  const STAR_SIZE = 3;
  const STAR_MIN_SCALE = 0.2;
  const OVERFLOW_THRESHOLD = 50;
  
  // State variables
  const stateRef = useRef({
    scale: 1,
    width: 0,
    height: 0,
    stars: [] as Array<{ x: number; y: number; z: number }>,
    pointerX: null as number | null,
    pointerY: null as number | null,
    velocity: { x: 0, y: 0, tx: 0, ty: 0, z: 0.0009 },
    touchInput: false,
    starCount: 0,
  });

  // Generate stars
  const generate = () => {
    const state = stateRef.current;
    state.stars = [];
    for (let i = 0; i < state.starCount; i++) {
      state.stars.push({
        x: 0,
        y: 0,
        z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
      });
    }
  };

  // Place a star at random position
  const placeStar = (star: { x: number; y: number }) => {
    const state = stateRef.current;
    star.x = Math.random() * state.width;
    star.y = Math.random() * state.height;
  };

  // Recycle star to new position
  const recycleStar = (star: { x: number; y: number; z: number }) => {
    const state = stateRef.current;
    let direction = 'z';
    const vx = Math.abs(state.velocity.x);
    const vy = Math.abs(state.velocity.y);

    if (vx > 1 || vy > 1) {
      let axis;
      if (vx > vy) {
        axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
      } else {
        axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
      }

      if (axis === 'h') {
        direction = state.velocity.x > 0 ? 'l' : 'r';
      } else {
        direction = state.velocity.y > 0 ? 't' : 'b';
      }
    }

    star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

    if (direction === 'z') {
      star.z = 0.1;
      star.x = Math.random() * state.width;
      star.y = Math.random() * state.height;
    } else if (direction === 'l') {
      star.x = -OVERFLOW_THRESHOLD;
      star.y = state.height * Math.random();
    } else if (direction === 'r') {
      star.x = state.width + OVERFLOW_THRESHOLD;
      star.y = state.height * Math.random();
    } else if (direction === 't') {
      star.x = state.width * Math.random();
      star.y = -OVERFLOW_THRESHOLD;
    } else if (direction === 'b') {
      star.x = state.width * Math.random();
      star.y = state.height + OVERFLOW_THRESHOLD;
    }
  };

  // Resize handler
  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    state.scale = window.devicePixelRatio || 1;
    state.width = window.innerWidth * state.scale;
    state.height = window.innerHeight * state.scale;
    state.starCount = (window.innerWidth + window.innerHeight) / 8;
    
    canvas.width = state.width;
    canvas.height = state.height;
    
    generate();
    state.stars.forEach(placeStar);
  };

  // Update stars positions
  const update = () => {
    const state = stateRef.current;
    const { velocity } = state;

    velocity.tx *= 0.96;
    velocity.ty *= 0.96;
    velocity.x += (velocity.tx - velocity.x) * 0.8;
    velocity.y += (velocity.ty - velocity.y) * 0.8;

    state.stars.forEach((star) => {
      star.x += velocity.x * star.z;
      star.y += velocity.y * star.z;
      star.x += (star.x - state.width / 2) * velocity.z * star.z;
      star.y += (star.y - state.height / 2) * velocity.z * star.z;
      star.z += velocity.z;

      if (
        star.x < -OVERFLOW_THRESHOLD ||
        star.x > state.width + OVERFLOW_THRESHOLD ||
        star.y < -OVERFLOW_THRESHOLD ||
        star.y > state.height + OVERFLOW_THRESHOLD
      ) {
        recycleStar(star);
      }
    });
  };

  // Render stars
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;

    ctx.clearRect(0, 0, state.width, state.height);

    state.stars.forEach((star) => {
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineWidth = STAR_SIZE * star.z * state.scale;
      ctx.globalAlpha = 0.5 + 0.5 * Math.random();
      ctx.strokeStyle = STAR_COLOR;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);

      let tailX = state.velocity.x * 2;
      let tailY = state.velocity.y * 2;
      if (Math.abs(tailX) < 0.1) tailX = 0.5;
      if (Math.abs(tailY) < 0.1) tailY = 0.5;

      ctx.lineTo(star.x + tailX, star.y + tailY);
      ctx.stroke();
    });
  };

  // Animation step
  const step = () => {
    update();
    render();
    requestAnimationFrame(step);
  };

  // Pointer movement
  const movePointer = (x: number, y: number) => {
    const state = stateRef.current;
    if (typeof state.pointerX === 'number' && typeof state.pointerY === 'number') {
      const ox = x - state.pointerX;
      const oy = y - state.pointerY;
      state.velocity.tx = state.velocity.tx + (ox / 8) * state.scale * (state.touchInput ? 1 : -1);
      state.velocity.ty = state.velocity.ty + (oy / 8) * state.scale * (state.touchInput ? 1 : -1);
    }
    state.pointerX = x;
    state.pointerY = y;
  };

  // Event handlers
  const onMouseMove = (e: MouseEvent) => {
    stateRef.current.touchInput = false;
    movePointer(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    stateRef.current.touchInput = true;
    movePointer(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onMouseLeave = () => {
    stateRef.current.pointerX = null;
    stateRef.current.pointerY = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    // Initialize
    resize();
    step();
  
    // 修改这里：将事件监听从 canvas 改为 window
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove); // 改为 window
    window.addEventListener('touchmove', onTouchMove, { passive: false }); // 改为 window
    window.addEventListener('touchend', onMouseLeave); // 改为 window
    document.addEventListener('mouseleave', onMouseLeave);
  
    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove); // 改为 window
      window.removeEventListener('touchmove', onTouchMove); // 改为 window
      window.removeEventListener('touchend', onMouseLeave); // 改为 window
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundImage: 'linear-gradient(-225deg, #231557 0%, #43107a 29%, #2e31eb 100%)',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
    }}>
        <canvas
            ref={canvasRef}
            style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // 允许鼠标事件穿透
            }}
        />
    </div>
  );
};

export default StarBackground;