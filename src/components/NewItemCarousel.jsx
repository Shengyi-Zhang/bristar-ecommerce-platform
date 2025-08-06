import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const items = [
  {
    name: "CC BLACK RICE CONGEE",
    img: "/assets/beverage/black-rice-congee.jpeg",
  },
  { name: "CC GRASS JELLY", img: "/assets/beverage/grass-jelly.jpeg" },
  { name: "LOTUS OATMEAL", img: "/assets/beverage/lotus-oatmeal.jpeg" },
  { name: "Lactasoy Drink", img: "/assets/beverage/lactasoy-large.jpeg" },
  { name: "Rock Mountain Soda", img: "/assets/beverage/rock-mountain.jpg" },
  { name: "More Products", img: "/assets/beverage/black-rice-congee.jpeg" },
];

export default function NewItemsCarousel() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId;
    let accumulated = 0; // Sub-pixel scroll tracker
    const SCROLL_SPEED = 0.2;

    const step = () => {
      if (!paused && el) {
        accumulated += SCROLL_SPEED;

        // Scroll by the integer part of accumulated
        const moveBy = Math.floor(accumulated);
        if (moveBy > 0) {
          el.scrollLeft += moveBy;
          accumulated -= moveBy;
        }

        // Looping logic
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
          accumulated = 0;
        }
      }

      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [paused]);

  return (
    <section className="relative px-6 mt-16">
      <h2 className="text-2xl font-bold text-center mb-6 font-serif tracking-wide">
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
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="inline-flex gap-6 px-2 py-4"
          style={{ width: "max-content" }}
        >
          {/* Duplicate items twice for smooth infinite scroll */}
          {[...items, ...items].map((item, i) => (
            <div
              key={i}
              className="min-w-[240px] md:min-w-[300px] bg-base-100 rounded-box shadow hover:shadow-xl transition duration-300 overflow-hidden flex-shrink-0"
            >
              <img
                src={item.img}
                alt={item.name}
                className="h-48 w-full object-contain bg-gray-50"
              />
              <div className="p-3 text-center text-sm font-medium text-gray-700">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
