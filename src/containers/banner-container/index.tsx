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

const getOptimizedCloudinaryVideoUrl = (url: string): string => {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  if (
    url.includes("/f_auto") ||
    url.includes("/q_auto")
  ) {
    return url;
  }

  return url.replace(
    "/video/upload/",
    "/video/upload/f_auto,q_auto/",
  );
};

const getOptimizedCloudinaryImageUrl = (url: string): string => {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  if (
    url.includes("/f_auto") ||
    url.includes("/q_auto")
  ) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto/",
  );
};

const preloadImage = (url: string) => {
  if (!url) return;

  const img = new Image();
  img.src = getOptimizedCloudinaryImageUrl(url);
};

export default function BannerContainer() {
  const { banners, isLoading } = useBanner();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [animKey, setAnimKey] = useState<number>(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goToNext = useCallback(() => {
    if (banners.length === 0) return;

    setCurrentIndex(
      (prev) => (prev + 1) % banners.length,
    );

    setAnimKey((prev) => prev + 1);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    if (banners.length === 0) return;

    setCurrentIndex(
      (prev) =>
        (prev - 1 + banners.length) % banners.length,
    );

    setAnimKey((prev) => prev + 1);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    if (
      index === currentIndex ||
      index < 0 ||
      index >= banners.length
    ) {
      return;
    }

    setCurrentIndex(index);
    setAnimKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (banners.length === 0) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) =>
      prev >= banners.length ? 0 : prev,
    );
  }, [banners.length]);

  useEffect(() => {
    if (banners.length === 0) return;

    preloadImage(banners[0]?.banner_image);

    if (banners.length > 1) {
      preloadImage(banners[1]?.banner_image);
    }
  }, [banners]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const nextIndex =
      (currentIndex + 1) % banners.length;

    preloadImage(
      banners[nextIndex]?.banner_image,
    );
  }, [currentIndex, banners]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = window.setInterval(() => {
      goToNext();
    }, AUTO_SCROLL_DURATION);

    return () => {
      window.clearInterval(timer);
    };
  }, [goToNext, banners.length]);

  useEffect(() => {
    const videos = videoRefs.current;

    videos.forEach((video, index) => {
      if (!video) return;

      if (index === currentIndex) {
        const startVideo = async () => {
          try {
            video.currentTime = 0;
            await video.play();
          } catch {
            // Autoplay may be blocked by the browser.
          }
        };

        if (video.readyState >= 2) {
          startVideo();
        } else {
          video.addEventListener(
            "canplay",
            startVideo,
            { once: true },
          );
        }
      } else {
        video.pause();

        try {
          video.currentTime = 0;
        } catch {
          // Ignore unloaded video reset errors.
        }
      }
    });

    return () => {
      videos.forEach((video) => {
        if (!video) return;
        video.pause();
      });
    };
  }, [currentIndex, banners]);

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

  const handleTouchStart = (
    e: React.TouchEvent,
  ) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
  ) => {
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

  const currentSlide = banners[currentIndex];

  const nextIndex =
    (currentIndex + 1) % banners.length;

  return (
    <div
      className={`banner-container ${
        isDragging ? "grabbing" : "grab"
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
        {banners.map((slide, index) => {
          const isCurrent = index === currentIndex;
          const isNext = index === nextIndex;

          if (!isCurrent && !isNext) {
            return null;
          }

          return (
            <video
              key={
                slide.banner_generated_id ??
                slide._id ??
                index
              }
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              src={getOptimizedCloudinaryVideoUrl(
                slide.banner_video,
              )}
              className={`banner-video ${
                isCurrent ? "active" : ""
              }`}
              preload={
                isCurrent ? "auto" : "metadata"
              }
              loop
              muted
              playsInline
              aria-hidden="true"
            />
          );
        })}
      </div>

      <div className="banner-overlay" />

      <div className="banner-content-container">
        <div
          key={`text-${animKey}`}
          className="banner-text-section banner-text-anim"
        >
          <h1 className="banner-title">
            {currentSlide.banner_title}
          </h1>

          <div className="banner-subtitle-wrapper">
            <div className="banner-subtitle">
              {currentSlide.banner_small_tag}
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
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="banner-image-section">
          <img
            key={`img-${animKey}`}
            src={getOptimizedCloudinaryImageUrl(
              currentSlide.banner_image,
            )}
            alt={currentSlide.banner_title}
            className="banner-fg-image anim-enter"
            loading={
              currentIndex === 0 ? "eager" : "lazy"
            }
            fetchPriority={
              currentIndex === 0 ? "high" : "auto"
            }
            decoding="async"
          />
        </div>
      </div>

      <div className="banner-progress-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`banner-dot ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}