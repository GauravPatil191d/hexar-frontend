"use client";

import React, { useEffect, useRef } from "react";
import "./style.css";
import { useMissionVision } from "@/context/MissionVisionContext";

export default function MissionVisionContainer() {
  const { missionVision, loading, getMissionVision } = useMissionVision();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Fetch on mount if not already loaded
  useEffect(() => {
    getMissionVision();
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
  }, [missionVision]); // re-run when data loads

  const videoSrc = missionVision?.background_video ?? "/videos/COD-1-min.mp4";
  const missionTitle = missionVision?.mission_title ?? "Our Mission";
  const missionDesc =
    missionVision?.mission_description ??
    "Our mission is to provide cutting-edge 3D arts solutions with exceptional quality and innovation. We bring creativity to life through immersive visuals, pushing artistic boundaries.";
  const visionTitle = missionVision?.vision_title ?? "Our Vision";
  const visionDesc =
    missionVision?.vision_description ??
    "Inspire and empower through transformative 3D arts. We aim to be a trusted partner known for our visionary approach, technical expertise, and commitment to excellence. By embracing creativity and staying at the forefront of technology, we shape the future and leave a lasting impact in the industry.";

  return (
    <section
      ref={sectionRef}
      className="mission-vision-section"
      id="mission-vision"
    >
      <div className="mission-vision-layout">
        {/* Left Side: SVG Video Mask touching very left edge */}
        <div className="mission-vision-svg-col reveal-element">
          <svg
            width="100%"
            height="100%"
            className="mission-vision-svg relative left-0 top-0"
            viewBox="0 0 1200 1200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="roundedMask" x="-10%" y="-10%" width="120%" height="120%">
                <feMorphology operator="dilate" radius="1" in="SourceGraphic" result="dilated" />
                <feGaussianBlur in="dilated" stdDeviation="1" result="blurred" />
                <feMorphology operator="erode" radius="1" in="blurred" result="rounded" />
                <feComposite in="rounded" in2="SourceGraphic" operator="over" />
              </filter>

              <mask id="diamondMask">
                <rect width="1200" height="1200" fill="black" />
                <rect x="-460" y="80" width="1020" height="1020" rx="50" ry="50" fill="white" transform="rotate(45 -80 380)" />
                <rect x="535.5" y="120" width="280" height="280" rx="25" ry="25" fill="white" transform="rotate(45 480 285)" />
                <rect x="650.5" y="500.5" width="280" height="280" rx="25" ry="25" fill="white" transform="rotate(45 480 565)" />
                <rect x="800.5" y="270.5" width="280" height="280" rx="25" ry="25" fill="white" transform="rotate(45 670 455)" />
              </mask>
            </defs>

            <foreignObject x="0" y="0" width="1200" height="1200" mask="url(#diamondMask)">
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </foreignObject>
          </svg>
        </div>

        {/* Right Side: Text Information */}
        <div className="mission-vision-text-col">
          {/* Our Mission */}
          <div className="reveal-element">
            <h2 className="mission-vision-heading">{missionTitle}</h2>
            <p className="mission-vision-paragraph">{missionDesc}</p>
          </div>

          {/* Our Vision */}
          <div className="reveal-element">
            <h2 className="mission-vision-heading">{visionTitle}</h2>
            <p className="mission-vision-paragraph">{visionDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
