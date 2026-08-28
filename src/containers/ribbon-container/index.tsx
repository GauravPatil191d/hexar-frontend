"use client";

import React, { useEffect, useRef } from "react";
import "./style.css";
import { useRibbon } from "@/context/RibbonContext";

export default function RibbonContainer() {
  const { ribbon, isLoading, getRibbon } = useRibbon();
  const ribbonRef = useRef<HTMLElement | null>(null);

  // Fetch on mount if not already loaded
  useEffect(() => {
    getRibbon();
  }, []);

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

  // Split ribbon text into individual items (comma or pipe separated),
  // or fall back to a default list if no data
  const ribbonItems: string[] = ribbon?.ribbon_text
    ? ribbon.ribbon_text
        .split(/[,|]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  if (isLoading || ribbonItems.length === 0) {
    // Render an empty ribbon while loading / no data
    return (
      <section
        ref={ribbonRef}
        className="ribbon-container reveal-element"
        aria-label="Services Showcase"
      />
    );
  }

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
