import { useState, useRef } from "react";
import styles from "./NumberTracing.module.scss";
import { NUMBER_DATA } from "./constants";
import type { Line } from "./type";
import { Link } from "react-router-dom";

interface NumberTracingProps {
  number: number;
}

function NumberTracing({ number }: NumberTracingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);

  const numberData = NUMBER_DATA[number];

  if (!numberData) {
    return <div>Number not found</div>;
  }

  // Configuration
  const STROKE_WIDTH = 40;
  const DRAW_WIDTH = 25;
  const TOLERANCE = 35;

  // --- Geometry Helpers ---
  const getDistance = (p1: number[], p2: number[]) => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  };

  const distToSegment = (p: number[], v: number[], w: number[]) => {
    const l2 = Math.pow(getDistance(v, w), 2);
    if (l2 === 0) return getDistance(p, v);
    let t =
      ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    const projection = [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])];
    return getDistance(p, projection);
  };

  const checkPointValidity = (x: number, y: number) => {
    const letterPaths = numberData.paths;

    for (const path of letterPaths) {
      for (let i = 0; i < path.points.length - 1; i++) {
        const start = path.points[i];
        const end = path.points[i + 1];
        const dist = distToSegment([x, y], start, end);

        if (dist < TOLERANCE) {
          return true;
        }
      }
    }
    return false;
  };

  // --- Input Handlers ---
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = 500 / rect.width;
    const scaleY = 500 / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    const isValid = checkPointValidity(coords.x, coords.y);

    setCurrentLine({
      points: [{ x: coords.x, y: coords.y }],
      isCorrect: isValid,
    });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentLine) return;
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const isValid = checkPointValidity(coords.x, coords.y);

    setCurrentLine((prev) => {
      if (!prev) return prev;
      const newPoints = [...prev.points, { x: coords.x, y: coords.y }];
      return {
        points: newPoints,
        isCorrect: prev.isCorrect && isValid,
      };
    });
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentLine) return;

    setIsDrawing(false);
    setLines((prev) => [...prev, currentLine]);
    setCurrentLine(null);
  };

  const clearCanvas = () => {
    setLines([]);
  };

  // --- Rendering Helpers ---
  const renderGuide = () => {
    return numberData.paths.map((path, idx) => {
      const d = `M ${path.points.map((p) => p.join(",")).join(" L ")}`;
      return (
        <path
          key={idx}
          d={d}
          stroke="#e5e7eb"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    });
  };

  const renderUserLines = () => {
    const allLines = currentLine ? [...lines, currentLine] : lines;

    return allLines.map((line, idx) => {
      if (line.points.length < 2) return null;

      const d = `M ${line.points.map((p) => `${p.x},${p.y}`).join(" L ")}`;
      const color = line.isCorrect ? "#4ade80" : "#f87171";

      return (
        <path
          key={idx}
          d={d}
          stroke={color}
          strokeWidth={DRAW_WIDTH}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      );
    });
  };

  return (
    <div className={styles.numberTracing}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>Modul Hitung A1 -{number}</div>
        <Link to="/" className={styles.badge}>
          Kembali
        </Link>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.displaySection}>
          <div className={styles.illustration}>{numberData.illustration}</div>
          <div className={styles.equals}>=</div>
          <div className={styles.bigNumber}>{number}</div>
          <div className={styles.word}>{numberData.word}</div>
        </div>

        {/* Tracing Canvas */}
        <div className={styles.tracingSection}>
          <svg
            ref={canvasRef}
            viewBox="0 0 500 500"
            className={styles.canvas}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          >
            <defs>
              <pattern
                id="dots"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1.5" fill="#d1d5db" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />

            {renderGuide()}

            {numberData.paths.map((path, idx) => (
              <path
                key={`center-${idx}`}
                d={`M ${path.points.map((p) => p.join(",")).join(" L ")}`}
                stroke="#94a3b8"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10,10"
              />
            ))}

            {renderUserLines()}
          </svg>

          <button onClick={clearCanvas} className={styles.resetButton}>
            Ulang
          </button>
        </div>
      </div>
    </div>
  );
}

export default NumberTracing;
