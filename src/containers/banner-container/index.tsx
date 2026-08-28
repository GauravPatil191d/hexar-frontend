"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import "./style.css";

import { useBanner } from "@/context/BannerContext";

const AUTO_SCROLL_DURATION = 7000;

export default function BannerContainer() {
  const { banners, isLoading } = useBanner();

  const [currentIndex, setCurrentIndex] =
    useState<number>(0);

  const [isDragging, setIsDragging] =
    useState<boolean>(false);

  const [startX, setStartX] =
    useState<number>(0);

  const [animKey, setAnimKey] =
    useState<number>(0);

  const videoRefs =
    useRef<(HTMLVideoElement | null)[]>([]);

  const goToNext = useCallback(() => {
    if (banners.length === 0) return;

    setCurrentIndex(
      (prev) =>
        (prev + 1) % banners.length,
    );

    setAnimKey((prev) => prev + 1);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    if (banners.length === 0) return;

    setCurrentIndex(
      (prev) =>
        (prev - 1 + banners.length) %
        banners.length,
    );

    setAnimKey((prev) => prev + 1);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;

    setCurrentIndex(index);

    setAnimKey((prev) => prev + 1);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, AUTO_SCROLL_DURATION);

    return () => {
      clearInterval(timer);
    };
  }, [
    goToNext,
    banners.length,
  ]);

  useEffect(() => {
    videoRefs.current.forEach(
      (video, index) => {
        if (!video) return;

        if (index === currentIndex) {
          const startVideo = async () => {
            try {
              video.currentTime = 0;

              await video.play();
            } catch (error) {
              console.error(
                "Unable to play video:",
                banners[index]?.banner_title,
                error,
              );
            }
          };

          if (video.readyState >= 2) {
            startVideo();
          } else {
            video.addEventListener(
              "canplay",
              startVideo,
              {
                once: true,
              },
            );
          }
        } else {
          video.pause();

          video.currentTime = 0;
        }
      },
    );
  }, [
    currentIndex,
    banners,
  ]);

  const handleMouseDown = (
    e: React.MouseEvent,
  ) => {
    setIsDragging(true);

    setStartX(e.clientX);
  };

  const handleMouseUp = (
    e: React.MouseEvent,
  ) => {
    if (!isDragging) return;

    setIsDragging(false);

    const diffX =
      e.clientX - startX;

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

  const handleTouchStart = (
    e: React.TouchEvent,
  ) => {
    setIsDragging(true);

    setStartX(
      e.touches[0].clientX,
    );
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
  ) => {
    if (!isDragging) return;

    setIsDragging(false);

    const endX =
      e.changedTouches[0].clientX;

    const diffX =
      endX - startX;

    if (diffX < -40) {
      goToNext();
    } else if (diffX > 40) {
      goToPrev();
    }
  };

  if (isLoading) {
    return (
      <div
        className="banner-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="banner-logo-wrapper">
          <img
            src="/images/hexar-logo.png"
            alt="HEXAR Studios Logo"
            className="banner-logo"
          />
        </div>

        <p
          style={{
            color: "#fff",
            fontSize: "1.2rem",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div
        className="banner-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="banner-logo-wrapper">
          <img
            src="/images/hexar-logo.png"
            alt="HEXAR Studios Logo"
            className="banner-logo"
          />
        </div>

        <p
          style={{
            color: "#fff",
            fontSize: "1.2rem",
          }}
        >
          No banners available.
        </p>
      </div>
    );
  }

  const currentSlide =
    banners[currentIndex];

  return (
    <div
      className={`banner-container ${isDragging
          ? "grabbing"
          : "grab"
        }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="banner-logo-wrapper">
        <img
          src="/images/hexar-logo.png"
          alt="HEXAR Studios Logo"
          className="banner-logo"
        />
      </div>

      <div className="banner-video-wrapper">
        {banners.map(
          (slide, index) => (
            <video
              key={
                slide.banner_generated_id ??
                index
              }
              ref={(element) => {
                videoRefs.current[index] =
                  element;
              }}
              src={slide.banner_video}
              className={`banner-video ${index === currentIndex
                  ? "active"
                  : ""
                }`}
              preload="auto"
              loop
              muted
              playsInline
            />
          ),
        )}
      </div>

      <div className="banner-overlay" />

      <div className="banner-content-container">
        <div
          key={`text-${animKey}`}
          className="
            banner-text-section
            banner-text-anim
          "
        >
          <h1 className="banner-title">
            {currentSlide.banner_title}
          </h1>

          <div className="banner-subtitle-wrapper">
            <div className="banner-subtitle">
              {
                currentSlide.banner_small_tag
              }
            </div>

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

        <div className="banner-image-section">
          <img
            key={`img-${animKey}`}
            src={currentSlide.banner_image}
            alt={currentSlide.banner_title}
            className="
              banner-fg-image
              anim-enter
            "
          />
        </div>
      </div>

      <div className="banner-progress-dots">
        {banners.map(
          (_, index) => (
            <button
              key={index}
              type="button"
              className={`banner-dot ${index === currentIndex
                  ? "active"
                  : ""
                }`}
              onClick={(e) => {
                e.stopPropagation();

                goToSlide(index);
              }}
              aria-label={`Go to slide ${index + 1
                }`}
            />
          ),
        )}
      </div>
    </div>
  );
}