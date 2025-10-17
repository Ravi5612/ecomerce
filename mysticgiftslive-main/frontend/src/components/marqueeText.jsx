'use client';

import React, { useRef, useEffect, useState, useMemo, useId } from "react";

const MarqueeText = () => {
  return (
    <div className="w-full font-inter relative overflow-hidden">
      {/* Top Border with Footer Gradient */}
      <div 
        className="w-full h-0.5"
        style={{
          background: "linear-gradient(90deg, #5e066a, #560565, #4e0560, #46045b, #3e0356, #360251, #2e024c, #260147, #1e0042, #1a003d, #170138, #130133, #0f022e, #0b0228, #080223, #04031e, #000319)"
        }}
      />
      
      {/* Marquee Content - No Padding */}
      <div 
        className="py-2 font-inter relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-purple-900 via-indigo-900 to-black"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderTop: "none",
          borderBottom: "none",
          borderLeft: "none",
          borderRight: "none",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <LinearLoop 
          marqueeText="✨ MysticGifts • Spiritual Treasures • Authentic Products • Mystical Wellness • Sacred Artifacts • Energy Cleansing ✨" 
          speed={1} 
          direction="left" 
          interactive={true} 
          className="fill-white/90" 
        />
      </div>
      
      {/* Bottom Border with Footer Gradient */}
      <div 
        className="w-full h-0.5"
        style={{
          background: "linear-gradient(90deg, #5e066a, #560565, #4e0560, #46045b, #3e0356, #360251, #2e024c, #260147, #1e0042, #1a003d, #170138, #130133, #0f022e, #0b0228, #080223, #04031e, #000319)"
        }}
      />
    </div>
  );
};

const LinearLoop = ({
  marqueeText = "",
  speed = 2,
  className,
  direction = "left",
  interactive = true
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    // Add significant spacing between repetitions
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
  }, [marqueeText]);

  const measureRef = useRef(null);
  const tspansRef = useRef([]);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [spacing, setSpacing] = useState(0);
  const uid = useId();
  const pathId = `linear-path-${uid}`;
  const pathD = "M-200,25 L1640,25"; // Extended path for better coverage
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  useEffect(() => {
    if (measureRef.current) {
      const textLength = measureRef.current.getComputedTextLength();
      // Significantly increase spacing to prevent overlap
      setSpacing(textLength + 200); // Increased gap between repetitions
    }
  }, [text, className]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    if (!spacing || spacing <= 0) return;
    
    let frame;
    const step = () => {
      tspansRef.current.forEach((t, index) => {
        if (!t) return;
        
        let x = parseFloat(t.getAttribute("x") || "0");
        
        if (!dragRef.current) {
          const delta = dirRef.current === "right" ? Math.abs(speed) : -Math.abs(speed);
          x += delta;
        }
        
        const totalWidth = spacing * tspansRef.current.length;
        
        // Better wrapping logic - reset position when fully off screen
        if (dirRef.current === "left") {
          if (x < -spacing) {
            x = totalWidth - spacing + (x + spacing);
          }
        } else {
          if (x > totalWidth) {
            x = x - totalWidth;
          }
        }
        
        t.setAttribute("x", x.toString());
      });
      
      frame = requestAnimationFrame(step);
    };
    
    step();
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed]);

  // Calculate repeats based on screen width and spacing
  const repeats = pathLength && spacing ? Math.max(Math.ceil((pathLength + spacing) / spacing), 3) : 3;
  const ready = pathLength > 0 && spacing > 0;

  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.target.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!interactive || !dragRef.current) return;
    
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    
    tspansRef.current.forEach(t => {
      if (!t) return;
      let x = parseFloat(t.getAttribute("x") || "0");
      x += dx;
      t.setAttribute("x", x.toString());
    });
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    if (Math.abs(velRef.current) > 1) {
      dirRef.current = velRef.current > 0 ? "right" : "left";
    }
  };

  const cursorStyle = interactive ? (dragRef.current ? "grabbing" : "grab") : "auto";

  return (
    <div 
      style={{
        visibility: ready ? "visible" : "hidden",
        cursor: cursorStyle
      }} 
      onPointerDown={onPointerDown} 
      onPointerMove={onPointerMove} 
      onPointerUp={endDrag} 
      onPointerLeave={endDrag}
    >
      <svg
        className="select-none w-full overflow-visible block font-bold tracking-[2px] uppercase leading-none
          text-4xl sm:text-4xl md:text-xl lg:text-xl"
        viewBox="0 0 1440 50"
        style={{ overflow: 'hidden' }}
      >
        {/* Hidden text for measurement */}
        <text 
          ref={measureRef} 
          xmlSpace="preserve" 
          className={className ?? "fill-white/90"}
          style={{
            visibility: "hidden",
            opacity: 0,
            pointerEvents: "none",
            fontSize: "1.6rem",
            fontWeight: "bold",
            letterSpacing: "2px"
          }}
        >
          {text}
        </text>
        
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        
        {ready && (
          <text 
            xmlSpace="preserve" 
            className={className ?? "fill-white/90"}
            y="50%"
            dominantBaseline="middle"
          >
            <textPath href={`#${pathId}`} xmlSpace="preserve">
              {Array.from({ length: repeats }).map((_, i) => (
                <tspan 
                  key={i} 
                  x={i * spacing} 
                  ref={(el) => {
                    if (el) tspansRef.current[i] = el;
                  }}
                >
                  {text}
                </tspan>
              ))}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default MarqueeText;