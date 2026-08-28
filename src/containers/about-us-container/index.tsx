"use client";

import React, { useEffect, useRef } from "react";
import "./style.css";
import { useAbout } from "@/context/AboutContext";

export default function AboutUsContainer() {
  const { about, isLoading, getAbout } = useAbout();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Fetch on mount if not already loaded
  useEffect(() => {
    getAbout();
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
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal-element");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [about]); // re-run when data loads so new elements are observed

  if (isLoading) {
    return (
      <section ref={sectionRef} className="about-us-container" id="about-us">
        <div className="about-us-content-wrapper">
          <div className="about-us-text-col reveal-element">
            <div className="about-us-heading" style={{ opacity: 0.4 }}>Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="about-us-container" id="about-us">
      <div className="about-us-content-wrapper">
        {/* Left Column: Text & Information */}
        <div className="about-us-text-col reveal-element">
          <h2 className="about-us-heading">
            {about?.about_title ?? "About Hexar Family"}
          </h2>

          <div className="about-us-subheading">Welcome to Hexar Studios</div>

          <div className="about-us-paragraphs">
            <p className="about-us-paragraph">
              {about?.about_description ??
                "We bring together exceptional creative talent, advanced production pipelines, and world-class IT infrastructure to deliver stunning 3D visuals for games, films, advertising, and immersive experiences."}
            </p>
          </div>
        </div>

        {/* Right Column: Character Image filling full section height */}
        <div className="about-us-image-col reveal-element">
          <img
            src={about?.about_image ?? "/images/about-us-img.png"}
            alt={about?.about_title ?? "Hexar Studios About Us"}
            className="about-us-character-img"
          />
        </div>
      </div>
    </section>
  );
}
