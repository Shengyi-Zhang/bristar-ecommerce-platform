// src/components/NewItemCarousel.jsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { productData } from "../data/products";
import { Link } from "react-router-dom";

const isIOS =
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export default function NewItemsCarousel() {
  const scrollRef = useRef(null);
  const rafRef = useRef(0);
  const accRef = useRef(0);
  const { t } = useTranslation();

  // 自动滚动控制
  const [paused, setPaused] = useState(false);
  const [snap, setSnap] = useState(false);
  const [speed, setSpeed] = useState(0.3); // 初始兜底

  // ① 数据：兼容 isNew 与老的 "New Item"
  const baseNewItems = useMemo(() => {
    const dedup = new Map();
    for (const p of productData) {
      const mark = p?.isNew || p?.category === "New Item";
      if (mark && !dedup.has(p.id)) dedup.set(p.id, p);
    }
    return Array.from(dedup.values());
  }, []);
  if (!baseNewItems.length) return null;

  // ② 复制一份用于循环 & 保证溢出
  const itemsForRender = useMemo(() => {
    let arr = [...baseNewItems, ...baseNewItems];
    while (arr.length < 6) arr = [...arr, ...baseNewItems];
    return arr;
  }, [baseNewItems]);

  // ③ 按平台 + 断点 + 无障碍偏好，动态设定速度
  useEffect(() => {
    const mqs = {
      md: window.matchMedia?.("(min-width: 768px)"),
      lg: window.matchMedia?.("(min-width: 1024px)"),
      reduce: window.matchMedia?.("(prefers-reduced-motion: reduce)"),
    };

    const compute = () => {
      if (mqs.reduce?.matches) return 0.12; // 尊重“减少动态”
      // 桌面更慢，移动端更快（iOS 再稍快一点）
      if (mqs.lg?.matches) return isIOS ? 0.35 : 0.18; // ≥1024px
      if (mqs.md?.matches) return isIOS ? 0.45 : 0.22; // ≥768px
      return isIOS ? 0.7 : 0.3; // <768px
    };

    const apply = () => setSpeed(compute());

    apply();
    mqs.md?.addEventListener?.("change", apply);
    mqs.lg?.addEventListener?.("change", apply);
    mqs.reduce?.addEventListener?.("change", apply);
    window.addEventListener("orientationchange", apply);

    return () => {
      mqs.md?.removeEventListener?.("change", apply);
      mqs.lg?.removeEventListener?.("change", apply);
      mqs.reduce?.removeEventListener?.("change", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  // ④ 自动滚动（基于上面的动态速度）
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const step = () => {
      if (!paused) {
        accRef.current += speed;
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
  }, [paused, speed]);

  // ⑤ 惯性滚动结束后再关 snap
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
          WebkitOverflowScrolling: "touch",
          scrollSnapType: snap ? "x mandatory" : "none",
        }}
        onMouseEnter={() => {
          setPaused(true);
          accRef.current = 0;
          setSnap(false);
        }}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => {
          setPaused(true);
          accRef.current = 0;
          setSnap(true);
        }}
        onTouchEnd={() => {
          setPaused(false);
          debounceOffSnap();
        }}
        onWheel={() => {
          setPaused(true);
          accRef.current = 0;
          setSnap(true);
          debounceOffSnap();
        }}
        onScroll={debounceOffSnap}
      >
        {/* 📱 更紧凑：小屏更小卡片 + 更小间距；中/大屏逐步放大 */}
        <div
          className="inline-flex gap-3 md:gap-5 px-2 py-3 md:py-4"
          style={{ width: "max-content" }}
        >
          {itemsForRender.map((item, i) => {
            const eager = i < 6;
            return (
              <Link
                key={`${item.id}-${i}`}
                to={{
                  pathname: "/products",
                  search: `?category=${encodeURIComponent(
                    item.category
                  )}&highlight=${encodeURIComponent(item.id)}`,
                }}
                // 📱 卡片更窄；md/lg 再放大
                className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px] lg:w-[260px]"
                style={{ scrollSnapAlign: snap ? "center" : "none" }}
              >
                <div className="bg-base-100 rounded-box shadow hover:shadow-xl transition duration-300 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-contain bg-gray-50"
                    loading={eager ? "eager" : "lazy"}
                    decoding="async"
                    draggable="false"
                  />
                  <div className="p-1.5 sm:p-2 md:p-3 text-center text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">
                    {item.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
