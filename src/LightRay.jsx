import React, { useEffect, useRef } from 'react';

const LightRay = ({ onHeadMove }) => {
  const canvasRef = useRef(null);
  const callbackRef = useRef(onHeadMove);
  useEffect(() => { callbackRef.current = onHeadMove; }, [onHeadMove]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const header = document.querySelector('.header');

    // The bottom edge of the header acts as a solid floor the ray can't cross.
    const getTopBound = () => {
      if (!header) return 0;
      const rect = header.getBoundingClientRect();
      return Math.max(0, rect.bottom);
    };

    const speed = 6;
    let x = width * 0.3;
    let y = Math.max(getTopBound() + 40, height * 0.35);
    let angle = Math.PI / 5;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    let t = 0;

    const TRAIL_LENGTH = 70;
    const trail = [];

    let raf;

    const draw = () => {
      // Gently oscillate the turn rate so the path curves organically
      t += 0.012;
      const turnRate = Math.sin(t) * 0.022 + Math.sin(t * 0.37) * 0.01;
      angle += turnRate;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;

      x += vx;
      y += vy;

      // Reflect off walls and flip the angle accordingly.
      // The top wall is the bottom of the header, so the ray never goes above it.
      const topBound = getTopBound();
      if (x <= 0)          { angle = Math.PI - angle; vx = Math.abs(vx); x = 0; }
      if (x >= width)      { angle = Math.PI - angle; vx = -Math.abs(vx); x = width; }
      if (y <= topBound)   { angle = -angle; vy = Math.abs(vy); y = topBound; }
      if (y >= height)     { angle = -angle; vy = -Math.abs(vy); y = height; }

      trail.push({ x, y });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      ctx.clearRect(0, 0, width, height);

      if (trail.length > 1) {
        const tail = trail[0];
        const head = trail[trail.length - 1];

        // Outer glow — wide, soft, purple
        const glowGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        glowGrad.addColorStop(0,    'rgba(194, 166, 239, 0)');
        glowGrad.addColorStop(0.8,  'rgba(194, 166, 239, 0.1)');
        glowGrad.addColorStop(1,    'rgba(194, 166, 239, 0.55)');

        ctx.save();
        ctx.shadowBlur = 28;
        ctx.shadowColor = 'rgba(194, 166, 239, 0.5)';
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
        ctx.restore();

        // Core — thin, bright white
        const coreGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        coreGrad.addColorStop(0,    'rgba(255, 255, 255, 0)');
        coreGrad.addColorStop(0.7,  'rgba(255, 255, 255, 0.12)');
        coreGrad.addColorStop(1,    'rgba(255, 255, 255, 0.9)');

        ctx.save();
        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
        ctx.restore();
      }

      // Head: white core dot
      ctx.save();
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(255, 255, 255, 1)';
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Head: purple halo
      ctx.shadowBlur = 55;
      ctx.shadowColor = 'rgba(194, 166, 239, 0.9)';
      ctx.fillStyle = 'rgba(194, 166, 239, 0.35)';
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      callbackRef.current?.(x, y);
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  );
};

export default LightRay;
