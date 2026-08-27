"use client";

import React, { useEffect, useRef } from "react";
import "./style.css";

export default function AboutUsContainer() {
  const sectionRef = useRef<HTMLElement | null>(null);

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
  }, []);

  return (
    <section ref={sectionRef} className="about-us-container" id="about-us">
      <div className="about-us-content-wrapper">
        {/* Left Column: Text & Information */}
        <div className="about-us-text-col reveal-element">
          <h2 className="about-us-heading">About Hexar Family</h2>

          <div className="about-us-subheading">Welcome to Hexar Studios</div>

          <div className="about-us-paragraphs">
            <p className="about-us-paragraph">
              We bring together exceptional creative talent, advanced production
              pipelines, and world-class IT infrastructure to deliver stunning 3D
              visuals for games, films, advertising, and immersive experiences.
            </p>

            <p className="about-us-paragraph">
              With Hexar, you're not just working with a studio — you're partnering
              with a creative powerhouse trusted by global brands.
            </p>
          </div>
        </div>

        {/* Right Column: Character Image filling full section height */}
        <div className="about-us-image-col reveal-element">
          <img
            src="/images/about-us-img.png"
            alt="Hexar Studios About Us"
            className="about-us-character-img"
          />
        </div>
      </div>
    </section>
  );
}
