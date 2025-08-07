import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { productData } from "../data/products";
import { Link } from "react-router-dom";

export default function NewItemsCarousel() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const { t } = useTranslation();

  const newItems = productData.filter((item) => item.category === "New Item");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId;
    let accumulated = 0;
    const SCROLL_SPEED = 0.2;

    const step = () => {
      if (!paused && el) {
        accumulated += SCROLL_SPEED;
        const moveBy = Math.floor(accumulated);
        if (moveBy > 0) {
          el.scrollLeft += moveBy;
          accumulated -= moveBy;
        }

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
          {[...newItems, ...newItems].map((item, i) => (
            <Link
              to="/products?category=New%20Item"
              key={i}
              className="min-w-[240px] md:min-w-[300px] flex-shrink-0"
            >
              <div
                key={i}
                className="min-w-[240px] md:min-w-[300px] bg-base-100 rounded-box shadow hover:shadow-xl transition duration-300 overflow-hidden flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-contain bg-gray-50"
                />
                <div className="p-3 text-center text-sm font-medium text-gray-700">
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
