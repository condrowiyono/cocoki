import { useState, useRef } from "react";
import { RefreshCw, CheckCircle } from "lucide-react";
import clsx from "clsx";
import styles from "./LetterTracing.module.scss";
import { ALPHABET_DATA } from "./constants";
import type { Line } from "./type";

function LetterTracing() {
  const [currentChar, setCurrentChar] = useState("1");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]); // Array of { points: [], isCorrect: boolean }
  const [currentLine, setCurrentLine] = useState<Line | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configuration for the "Game"
  const STROKE_WIDTH = 40; // Width of the guide path
  const DRAW_WIDTH = 25; // Width of user's pen
  const TOLERANCE = 35; // How far off the path is allowed

  // --- Geometry Helpers ---

  // Calculate distance between two points
  const getDistance = (p1: number[], p2: number[]) => {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  };

  // Find the distance from a point p to a line segment v-w
  const distToSegment = (p: number[], v: number[], w: number[]) => {
    const l2 = Math.pow(getDistance(v, w), 2);
    if (l2 === 0) return getDistance(p, v);
    let t =
      ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    const projection = [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])];
    return getDistance(p, projection);
  };

  // Check if a point is valid (close enough to ANY segment of the current letter)
  const checkPointValidity = (x: number, y: number) => {
    const letterPaths =
      ALPHABET_DATA[currentChar as keyof typeof ALPHABET_DATA].paths;

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

    // Scale coordinates to match internal 500x500 resolution
    const scaleX = 500 / rect.width;
    const scaleY = 500 / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    const isValid = checkPointValidity(coords.x, coords.y);

    setCurrentLine({
      points: [{ x: coords.x, y: coords.y }],
      isCorrect: isValid, // Stays correct only if they never leave the path
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
      // If they went off track once, the line remains "incorrect" or we can handle segments
      // Simple mode: If you leave the line, this specific stroke is flagged
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

    // Simple scoring logic: count number of correct lines vs total
    // Real apps use "percentage of area covered"
    calculateScore();
  };

  const calculateScore = () => {
    // This is a placeholder for complex coverage logic
    // We just encourage them if they drew mostly correct lines
  };

  const clearCanvas = () => {
    setLines([]);
  };

  // --- Rendering Helpers ---

  // Render the "Guide" (Light gray background letter)
  const renderGuide = () => {
    const letter = ALPHABET_DATA[currentChar as keyof typeof ALPHABET_DATA];
    return letter.paths.map((path, idx) => {
      // Convert points array to SVG path string
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

  // Render the lines drawn by the user
  const renderUserLines = () => {
    const allLines = currentLine ? [...lines, currentLine] : lines;

    return allLines.map((line, idx) => {
      if (line.points.length < 2) return null;

      const d = `M ${line.points.map((p) => `${p.x},${p.y}`).join(" L ")}`;
      const color = line.isCorrect ? "#4ade80" : "#f87171"; // Green if good, Red if bad

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
    <div className={styles.letterTracing}>
      {/* Header */}
      <div className={styles.letterTracingHeader}>
        <div>
          <h1 className={styles.letterTracingTitle}>Belajar Menulis</h1>
          <p className={styles.letterTracingSubtitle}>Mari belajar menulis!</p>
        </div>
      </div>

      {/* Canvas Area */}
      <div className={styles.canvasContainer} ref={containerRef}>
        {/* The Drawing Surface */}
        <svg
          ref={canvasRef}
          viewBox="0 0 500 500"
          className={styles.drawingCanvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        >
          {/* 1. Grid/Background decoration (Optional) */}
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#f0f9ff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 2. The Guide Letter */}
          {renderGuide()}

          {/* 3. Dotted Center Line for guidance */}
          {ALPHABET_DATA[currentChar as keyof typeof ALPHABET_DATA].paths.map(
            (path, idx) => (
              <path
                key={`center-${idx}`}
                d={`M ${path.points.map((p) => p.join(",")).join(" L ")}`}
                stroke="#94a3b8"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10,10"
              />
            )
          )}

          {renderUserLines()}
        </svg>

        {/* Footer Instruction */}
        <div className={styles.instructionText}>
          {
            ALPHABET_DATA[currentChar as keyof typeof ALPHABET_DATA]
              .instructions
          }
        </div>
      </div>

      {/* Letter Selector Controls */}
      <div className={styles.controlsContainer}>
        {/* Letter Buttons */}
        <div className={styles.letterButtons}>
          {Object.keys(ALPHABET_DATA).map((char) => (
            <button
              key={char}
              onClick={() => {
                setCurrentChar(char);
                clearCanvas();
              }}
              className={clsx(styles.letterButton, {
                [styles.letterButtonActive]: currentChar === char,
              })}
            >
              {char}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button onClick={clearCanvas} className={styles.resetButton}>
            <RefreshCw className={styles.buttonIcon} />
            Ulang
          </button>
          {/* A "Check" button isn't strictly needed as we validate real-time, but good for UX flow */}
          <button
            onClick={() => {
              setLines([]);
            }}
            className={styles.doneButton}
          >
            <CheckCircle className={styles.buttonIcon} />
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

export default LetterTracing;
