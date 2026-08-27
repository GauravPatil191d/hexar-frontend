"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./style.css";

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  videoSrc: string;
  imageSrc: string;
  altText: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    title: "Call of Duty: Modern Warfare",
    subtitle: "— Take A Look",
    videoSrc: "/videos/COD-1-min.mp4",
    imageSrc: "/images/cod-img.png",
    altText: "Call of Duty Character",
  },
  {
    id: 2,
    title: "Counter-Strike: Global Offensive",
    subtitle: "— Take A Look",
    videoSrc: "/videos/CSGO-1-min.mp4",
    imageSrc: "/images/cs-g0.png",
    altText: "CSGO Character",
  },
  {
    id: 3,
    title: "Elden Ring: Shadow of the Erdtree",
    subtitle: "— Take A Look",
    videoSrc: "/videos/ELDEN-1-min(2nd).mp4",
    imageSrc: "/images/eldeb-ring.png",
    altText: "Elden Ring Character",
  },
];

const AUTO_SCROLL_DURATION = 7000; // 7 seconds auto-scroll

export default function BannerContainer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [animKey, setAnimKey] = useState<number>(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);
    setAnimKey((prev) => prev + 1);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setAnimKey((prev) => prev + 1);
  }, []);

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setAnimKey((prev) => prev + 1);
    }
  };

  // 7-second Auto-scroll timer
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, AUTO_SCROLL_DURATION);

    return () => clearInterval(timer);
  }, [goToNext]);

  // Sync active background video playback
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === currentIndex) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diffX = e.clientX - startX;
    if (diffX < -50) {
      goToNext();
    } else if (diffX > 50) {
      goToPrev();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    if (diffX < -40) {
      goToNext();
    } else if (diffX > 40) {
      goToPrev();
    }
  };

  const currentSlide = bannerSlides[currentIndex];

  return (
    <div
      className={`banner-container ${isDragging ? "grabbing" : "grab"}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sticked Top Left Logo */}
      <div className="banner-logo-wrapper">
        <img
          src="/images/hexar-logo.png"
          alt="HEXAR Studios Logo"
          className="banner-logo"
        />
      </div>

      {/* Background Videos with high brightness */}
      <div className="banner-video-wrapper">
        {bannerSlides.map((slide, index) => (
          <video
            key={slide.id}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            src={slide.videoSrc}
            className={`banner-video ${index === currentIndex ? "active" : ""}`}
            loop
            muted
            playsInline
          />
        ))}
      </div>

      {/* Balanced Overlay for bright video visibility & text legibility */}
      <div className="banner-overlay" />

      {/* Main Content Layout */}
      <div className="banner-content-container">
        {/* Text Section (Middle on mobile, left on desktop) */}
        <div key={`text-${animKey}`} className="banner-text-section banner-text-anim">
          <h1 className="banner-title">{currentSlide.title}</h1>

          <div className="banner-subtitle-wrapper">
            <div className="banner-subtitle">{currentSlide.subtitle}</div>

            {/* Prev/Next Buttons (Hidden on mobile) */}
            <div className="banner-controls">
              <button
                type="button"
                className="banner-nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                aria-label="Previous Slide"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                className="banner-nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next Slide"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Foreground Character Image (Very bottom on mobile, right on desktop) */}
        <div className="banner-image-section">
          <img
            key={`img-${animKey}`}
            src={currentSlide.imageSrc}
            alt={currentSlide.altText}
            className="banner-fg-image anim-enter"
          />
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="banner-progress-dots">
        {bannerSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`banner-dot ${idx === currentIndex ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
