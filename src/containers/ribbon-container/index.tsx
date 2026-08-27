"use client";

import React, { useEffect, useRef } from "react";
import "./style.css";

const ribbonItems = [
  "Hair Assets",
  "Animation",
  "3D Modeling",
  "VFX",
  "Character Rigging",
  "Game Assets",
  "Concept Art",
  "Unreal Engine",
  "Environment Design",
  "3D Props",
];

export default function RibbonContainer() {
  const ribbonRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ribbonRef.current) {
      observer.observe(ribbonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ribbonRef}
      className="ribbon-container reveal-element"
      aria-label="Services Showcase"
    >
      <div className="ribbon-track">
        {/* Render group 1 */}
        <div className="ribbon-group">
          {ribbonItems.map((item, index) => (
            <div key={`g1-${index}`} className="ribbon-item">
              <span className="ribbon-bullet" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Duplicate group 2 for seamless infinite loop */}
        <div className="ribbon-group" aria-hidden="true">
          {ribbonItems.map((item, index) => (
            <div key={`g2-${index}`} className="ribbon-item">
              <span className="ribbon-bullet" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
