"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLang } from "@/lib/i18n";

export default function ProductGallery({ images, productName }) {
  const { t } = useLang();
  const carouselRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const frameRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const imageKey = images.join("|");

  const goToImage = useCallback((index, behavior = "smooth") => {
    const carousel = carouselRef.current;
    if (!carousel || images.length === 0) return;

    const nextIndex = Math.max(0, Math.min(index, images.length - 1));
    setActiveIndex(nextIndex);
    carousel.scrollTo({ left: nextIndex * carousel.clientWidth, behavior });
  }, [images.length]);

  useEffect(() => {
    setActiveIndex(0);
    carouselRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [imageKey]);

  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const handleScroll = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const carousel = carouselRef.current;
      if (!carousel?.clientWidth) return;
      const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
      setActiveIndex(Math.max(0, Math.min(nextIndex, images.length - 1)));
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToImage(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToImage(activeIndex + 1);
    }
  };

  if (images.length === 0) return null;

  return (
    <div aria-label={t("product.galleryLabel")} role="region">
      <div className="group relative overflow-hidden bg-[#E9EAEC]">
        <div
          ref={carouselRef}
          className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-roledescription="carousel"
        >
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative min-w-full snap-center snap-always"
              aria-label={t("product.imageCount", { current: index + 1, total: images.length })}
              role="group"
              aria-roledescription="slide"
            >
              <Image
                src={src}
                alt={`${productName} — ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="h-full w-full select-none object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goToImage(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/95 text-[#1A1C1E] shadow-lg transition hover:bg-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-0 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              aria-label={t("product.previousImage")}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToImage(activeIndex + 1)}
              disabled={activeIndex === images.length - 1}
              className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/95 text-[#1A1C1E] shadow-lg transition hover:bg-[#F5A623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-0 sm:flex sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              aria-label={t("product.nextImage")}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="pointer-events-none absolute bottom-3 right-3 bg-[#1A1C1E]/85 px-2.5 py-1 text-xs font-semibold text-white">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth overscroll-x-contain pb-1 [scrollbar-color:#F5A623_#E9EAEC] [scrollbar-width:thin]"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
          aria-label={t("product.thumbnailLabel")}
        >
          {images.map((src, index) => {
            const selected = index === activeIndex;
            return (
              <button
                ref={(node) => { thumbnailRefs.current[index] = node; }}
                key={`${src}-thumbnail-${index}`}
                type="button"
                onClick={() => goToImage(index)}
                className={`relative aspect-[4/3] w-24 shrink-0 snap-start overflow-hidden bg-[#E9EAEC] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623] focus-visible:ring-offset-2 sm:w-28 ${
                  selected ? "ring-2 ring-[#F5A623] ring-offset-2" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={t("product.chooseImage", { number: index + 1 })}
                aria-current={selected ? "true" : undefined}
              >
                <Image
                  src={src}
                  alt=""
                  width={224}
                  height={168}
                  sizes="112px"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
