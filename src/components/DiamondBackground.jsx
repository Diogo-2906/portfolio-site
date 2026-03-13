import { useEffect, useRef } from "react";

function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}

export default function DiamondBackground({ lightMode }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const lightRef = useRef(lightMode);

  useEffect(() => {
    lightRef.current = lightMode;
  }, [lightMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const DIAMOND_SIZE = 54;
    let hoveredDiamonds = new Map();
    let rafId;

    const getDiamondAt = (col, row) => ({
      cx: col * DIAMOND_SIZE + (row % 2 === 0 ? 0 : DIAMOND_SIZE / 2),
      cy: row * (DIAMOND_SIZE * 0.5),
    });

    const getCloseDiamonds = (mx, my, radius) => {
      const cols = Math.ceil(canvas.width / DIAMOND_SIZE) + 2;
      const rows = Math.ceil(canvas.height / (DIAMOND_SIZE * 0.5)) + 2;
      const result = [];
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols; col++) {
          const { cx, cy } = getDiamondAt(col, row);
          const dist = Math.hypot(cx - mx, cy - my);
          if (dist < radius) result.push({ col, row, dist });
        }
      return result;
    };

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const near = getCloseDiamonds(mouseRef.current.x, mouseRef.current.y, 160);
      const newMap = new Map();
      near.forEach(({ col, row, dist }) => {
        const key = `${col}_${row}`;
        newMap.set(key, { col, row, intensity: 1 - dist / 160, decay: 1 });
      });
      hoveredDiamonds.forEach((val, key) => {
        if (!newMap.has(key)) newMap.set(key, { ...val, decay: val.decay * 0.85 });
      });
      hoveredDiamonds = newMap;
    };

    window.addEventListener("mousemove", handleMove);

    const draw = () => {
      const isLight = lightRef.current;

      // Theme colors
      const BASE    = isLight ? "#f0ece6" : "#0e0e0e";
      const FILL    = isLight ? "#e8e2d9" : "#111111";
      const BORDER  = isLight ? "#d6cfc4" : "#1a1a1a";
      const HOVER1  = isLight ? "#d4c4ae" : "#1c1812";
      const HOVER2  = isLight ? "#c2a882" : "#2a2318";
      const HBORDER = isLight ? "#b89870" : "#2e261a";

      ctx.fillStyle = BASE;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / DIAMOND_SIZE) + 2;
      const rows = Math.ceil(canvas.height / (DIAMOND_SIZE * 0.5)) + 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const { cx, cy } = getDiamondAt(col, row);
          const key = `${col}_${row}`;
          const hovered = hoveredDiamonds.get(key);
          const h = (DIAMOND_SIZE - 1) * 0.52;

          ctx.beginPath();
          ctx.moveTo(cx, cy - h);
          ctx.lineTo(cx + (DIAMOND_SIZE - 1) / 2, cy);
          ctx.lineTo(cx, cy + h);
          ctx.lineTo(cx - (DIAMOND_SIZE - 1) / 2, cy);
          ctx.closePath();

          if (hovered && hovered.intensity > 0.01) {
            const t = hovered.intensity * (hovered.decay ?? 1);
            ctx.fillStyle = t > 0.5
              ? lerpColor(HOVER1, HOVER2, (t - 0.5) * 2)
              : lerpColor(FILL, HOVER1, t * 2);
            ctx.strokeStyle = t > 0.3 ? HBORDER : BORDER;
          } else {
            ctx.fillStyle = FILL;
            ctx.strokeStyle = BORDER;
          }

          ctx.fill();
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      hoveredDiamonds.forEach((val, key) => {
        val.decay *= 0.92;
        if (val.decay < 0.01) hoveredDiamonds.delete(key);
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        display: "block",
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
