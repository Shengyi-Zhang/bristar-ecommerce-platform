import { useState, useEffect, useMemo } from "react";
import { productData, categoryOrder } from "../data/products";
import MasonryProducts from "../components/MasonryProducts";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const categoryFromURL = searchParams.get("category") || "New Item";
  const highlightId = searchParams.get("highlight");

  const [category, setCategory] = useState(categoryFromURL);
  const [page, setPage] = useState(1);

  const allCategories = useMemo(() => ["__all__", ...categoryOrder], []);

  useEffect(() => {
    setCategory(categoryFromURL);
    setPage(1);
  }, [categoryFromURL]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-base lg:text-lg">
      {/* 手机：水平 chips */}
      {/* Mobile chips (full width & visible) */}
      <div className="lg:hidden sticky top-16 z-20 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/80">
        <div className="-mx-4 px-4 py-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          <div className="flex gap-2 w-max">
            {allCategories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSearchParams({ category: cat })}
                  className={`btn btn-sm whitespace-nowrap snap-start ${
                    active ? "btn-neutral" : "btn-outline"
                  }`}
                >
                  {cat === "__all__" ? t("all") : t(cat.toLowerCase())}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 桌面：侧栏 */}
      <aside className="hidden lg:block sticky top-24 max-h-[75vh] overflow-auto bg-base-100 rounded-box shadow-xl p-4 w-60">
        <ul className="menu menu-vertical gap-2 text-xl">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchParams({ category: cat })}
              className="w-full text-left px-4 py-2 group"
            >
              <span
                className={`relative inline-block transition-all duration-300
                  ${category === cat ? "text-black" : "text-gray-400 "}
                  group-hover:text-black
                  after:absolute after:bottom-0 after:left-0 after:h-[2px]
                  after:bg-black after:w-full after:transition-transform after:duration-300 
                  after:origin-left
                  ${category === cat ? "after:scale-x-100" : "after:scale-x-0"}
                  group-hover:after:scale-x-100`}
              >
                {cat === "__all__" ? t("all") : t(cat.toLowerCase())}
              </span>
            </button>
          ))}
        </ul>
      </aside>

      <main className="flex-1">
        <MasonryProducts
          category={category}
          products={productData}
          page={page}
          setPage={setPage}
          highlightId={highlightId}
          setSearchParams={setSearchParams}
        />
      </main>
    </div>
  );
}
