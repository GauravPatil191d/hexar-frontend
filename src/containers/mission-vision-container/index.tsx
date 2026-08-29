"use client";

import React, {
  useEffect,
  useRef,
  useMemo,
} from "react";

import "./style.css";

import { useMissionVision } from "@/context/MissionVisionContext";

const getOptimizedCloudinaryVideoUrl = (
  url: string,
): string => {
  if (!url) {
    return "";
  }

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

export default function MissionVisionContainer() {
  const {
    missionVision,
    loading,
    getMissionVision,
  } = useMissionVision();

  const sectionRef =
    useRef<HTMLElement | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const hasFetched =
    useRef(false);

  const hasStartedVideo =
    useRef(false);

  /*
   * Fetch Mission & Vision only once.
   *
   * We intentionally do not put getMissionVision
   * in the dependency array because some context
   * implementations recreate that function.
   */
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    hasFetched.current = true;

    getMissionVision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Reveal animation.
   */
  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    const elements =
      section.querySelectorAll(
        ".reveal-element",
      );

    if (!elements.length) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "is-revealed",
                );

                observer.unobserve(
                  entry.target,
                );
              }
            },
          );
        },
        {
          threshold: 0.15,
        },
      );

    elements.forEach(
      (element) => {
        observer.observe(
          element,
        );
      },
    );

    return () => {
      observer.disconnect();
    };
  }, [missionVision]);

  /*
   * Cloudinary video URL.
   */
  const videoSrc = useMemo(() => {
    const source =
      missionVision?.background_video;

    if (!source) {
      return "/videos/COD-1-min.mp4";
    }

    return getOptimizedCloudinaryVideoUrl(
      source,
    );
  }, [
    missionVision?.background_video,
  ]);

  const missionTitle =
    missionVision?.mission_title ??
    "Our Mission";

  const missionDesc =
    missionVision?.mission_description ??
    "Our mission is to provide cutting-edge 3D arts solutions with exceptional quality and innovation. We bring creativity to life through immersive visuals, pushing artistic boundaries.";

  const visionTitle =
    missionVision?.vision_title ??
    "Our Vision";

  const visionDesc =
    missionVision?.vision_description ??
    "Inspire and empower through transformative 3D arts. We aim to be a trusted partner known for our visionary approach, technical expertise, and commitment to excellence. By embracing creativity and staying at the forefront of technology, we shape the future and leave a lasting impact in the industry.";

  /*
   * Start the video when the section is
   * approaching the viewport.
   *
   * The video plays only once.
   */
  useEffect(() => {
    const video =
      videoRef.current;

    const section =
      sectionRef.current;

    if (!video || !section) {
      return;
    }

    hasStartedVideo.current = false;

    const startVideo =
      async () => {
        if (
          hasStartedVideo.current
        ) {
          return;
        }

        hasStartedVideo.current =
          true;

        try {
          await video.play();
        } catch {
          /*
           * Browser autoplay restrictions
           * are safely ignored.
           */
        }
      };

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting
          ) {
            startVideo();

            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin:
            "500px 0px",
          threshold: 0,
        },
      );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [videoSrc]);

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <section
        ref={sectionRef}
        className="mission-vision-section"
        id="mission-vision"
      >
        <div className="mission-vision-layout">
          <div className="mission-vision-svg-col">
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: "500px",
              }}
            />
          </div>

          <div className="mission-vision-text-col">
            <div>
              <h2 className="mission-vision-heading">
                Our Mission
              </h2>

              <p className="mission-vision-paragraph">
                Loading...
              </p>
            </div>

            <div>
              <h2 className="mission-vision-heading">
                Our Vision
              </h2>

              <p className="mission-vision-paragraph">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="mission-vision-section"
      id="mission-vision"
    >
      <div className="mission-vision-layout">

        <div className="mission-vision-svg-col reveal-element">
          <svg
            width="100%"
            height="100%"
            className="mission-vision-svg relative left-0 top-0"
            viewBox="0 0 1200 1200"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>

              <filter
                id="roundedMask"
                x="-10%"
                y="-10%"
                width="120%"
                height="120%"
              >
                <feMorphology
                  operator="dilate"
                  radius="1"
                  in="SourceGraphic"
                  result="dilated"
                />

                <feGaussianBlur
                  in="dilated"
                  stdDeviation="1"
                  result="blurred"
                />

                <feMorphology
                  operator="erode"
                  radius="1"
                  in="blurred"
                  result="rounded"
                />

                <feComposite
                  in="rounded"
                  in2="SourceGraphic"
                  operator="over"
                />
              </filter>

              <mask id="diamondMask">
                <rect
                  width="1200"
                  height="1200"
                  fill="black"
                />

                <rect
                  x="-460"
                  y="80"
                  width="1020"
                  height="1020"
                  rx="50"
                  ry="50"
                  fill="white"
                  transform="rotate(45 -80 380)"
                />

                <rect
                  x="535.5"
                  y="120"
                  width="280"
                  height="280"
                  rx="25"
                  ry="25"
                  fill="white"
                  transform="rotate(45 480 285)"
                />

                <rect
                  x="650.5"
                  y="500.5"
                  width="280"
                  height="280"
                  rx="25"
                  ry="25"
                  fill="white"
                  transform="rotate(45 480 565)"
                />

                <rect
                  x="800.5"
                  y="270.5"
                  width="280"
                  height="280"
                  rx="25"
                  ry="25"
                  fill="white"
                  transform="rotate(45 670 455)"
                />
              </mask>
            </defs>

            <foreignObject
              x="0"
              y="0"
              width="1200"
              height="1200"
              mask="url(#diamondMask)"
            >
              <video
                ref={videoRef}
                src={videoSrc}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-hidden="true"
              />
            </foreignObject>
          </svg>
        </div>

        <div className="mission-vision-text-col">

          <div className="reveal-element">
            <h2 className="mission-vision-heading">
              {missionTitle}
            </h2>

            <p className="mission-vision-paragraph">
              {missionDesc}
            </p>
          </div>

          <div className="reveal-element">
            <h2 className="mission-vision-heading">
              {visionTitle}
            </h2>

            <p className="mission-vision-paragraph">
              {visionDesc}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}