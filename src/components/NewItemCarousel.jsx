// src/components/NewItemCarousel.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { productData } from "../data/products";
import { Link } from "react-router-dom";

export default function NewItemsCarousel() {
  const scrollRef = useRef(null);
  const rafRef = useRef(0);
  const accRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [snap, setSnap] = useState(false);
  const { t } = useTranslation();

  const baseNewItems = useMemo(() => {
    const dedup = new Map();
    for (const p of productData) {
      const isNew = p?.isNew || p?.category === "New Item";
      if (isNew && !dedup.has(p.id)) dedup.set(p.id, p);
    }
    return Array.from(dedup.values());
  }, []);

  if (!baseNewItems.length) return null;

  const itemsForRender = useMemo(() => {
    let arr = [...baseNewItems, ...baseNewItems];
    while (arr.length < 6) arr = [...arr, ...baseNewItems];
    return arr;
  }, [baseNewItems]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const SPEED = 0.25;

    const step = () => {
      if (!paused) {
        accRef.current += SPEED;
        const dx = Math.floor(accRef.current);
        if (dx > 0) {
          el.scrollLeft += dx;
          accRef.current -= dx;
        }
        const half = Math.floor(el.scrollWidth / 2);
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft = 0;
          accRef.current = 0;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  const debounceOffSnap = (() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => setSnap(false), 250);
    };
  })();

  return (
    <section className="relative px-4 md:px-6 mt-10 md:mt-16 bg-white">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 font-serif tracking-wide text-black">
        {t("newItem")}
      </h2>

      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar"
        style={{
          width: "100%",
          maxWidth: "100vw",
          whiteSpace: "nowrap",
          position: "relative",

          scrollSnapType: snap ? "x mandatory" : "none",
        }}
        onMouseEnter={() => {
          setPaused(true);
          accRef.current = 0;
          setSnap(false);
        }}
        onMouseLeave={() => {
          setPaused(false);
        }}
        onTouchStart={() => {
          setPaused(true);
          accRef.current = 0;
          setSnap(true);
        }}
        onTouchEnd={() => {
          setPaused(false);
          setSnap(false);
        }}
        onWheel={() => {
          setPaused(true);
          accRef.current = 0;
          setSnap(true);
          debounceOffSnap();
        }}
      >
        <div
          className="inline-flex gap-4 md:gap-6 px-2 py-3 md:py-4"
          style={{ width: "max-content" }}
        >
          {itemsForRender.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              to={{
                pathname: "/products",
                search: `?category=${encodeURIComponent(
                  item.category
                )}&highlight=${encodeURIComponent(item.id)}`,
              }}
              className="min-w-[200px] md:min-w-[260px] flex-shrink-0"
              style={{ scrollSnapAlign: snap ? "center" : "none" }}
            >
              <div className="bg-base-100 rounded-box shadow hover:shadow-xl transition duration-300 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 md:h-48 w-full object-contain bg-gray-50"
                  loading="lazy"
                />
                <div className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-gray-700">
                  {item.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
