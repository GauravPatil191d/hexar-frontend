"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import "./style.css";
import { useAbout } from "@/context/AboutContext";

const getOptimizedCloudinaryImageUrl = (
  url: string,
): string => {
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

  const image = new Image();
  image.src =
    getOptimizedCloudinaryImageUrl(url);
};

export default function AboutUsContainer() {
  const {
    about,
    isLoading,
    getAbout,
  } = useAbout();

  const sectionRef =
    useRef<HTMLElement | null>(null);

  const hasFetched =
    useRef(false);

  const [shouldLoad, setShouldLoad] =
    useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: "600px 0px",
          threshold: 0,
        },
      );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      !shouldLoad ||
      hasFetched.current
    ) {
      return;
    }

    hasFetched.current = true;
    getAbout();
  }, [shouldLoad, getAbout]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const elements =
      section.querySelectorAll(
        ".reveal-element",
      );

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "is-revealed",
              );

              observer.unobserve(
                entry.target,
              );
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "100px 0px",
        },
      );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [about, shouldLoad]);

  const title =
    about?.about_title ??
    "About Hexar Family";

  const description =
    about?.about_description ??
    "We bring together exceptional creative talent, advanced production pipelines, and world-class IT infrastructure to deliver stunning 3D visuals for games, films, advertising, and immersive experiences.";

  const image =
    about?.about_image ??
    "/images/about-us-img.png";

  const optimizedImage =
    getOptimizedCloudinaryImageUrl(image);

  useEffect(() => {
    if (about?.about_image) {
      preloadImage(about.about_image);
    }
  }, [about?.about_image]);

  return (
    <section
      ref={sectionRef}
      className="about-us-container"
      id="about-us"
    >
      <div className="about-us-content-wrapper">
        <div className="about-us-text-col reveal-element">
          {isLoading ? (
            <div
              className="about-us-heading"
              style={{ opacity: 0.4 }}
            >
              Loading...
            </div>
          ) : (
            <>
              <h2 className="about-us-heading">
                {title}
              </h2>

              <div className="about-us-subheading">
                Welcome to Hexar Studios
              </div>

              <div className="about-us-paragraphs">
                <p className="about-us-paragraph">
                  {description}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="about-us-image-col reveal-element">
          <img
            src={optimizedImage}
            alt={title}
            className="about-us-character-img"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}