import { useState, useEffect, useMemo } from "react";
import { productData, categoryOrder } from "../data/products";
import MasonryProducts from "../components/MasonryProducts";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const categoryFromURL = searchParams.get("category") || "beverage";
  const highlightId = searchParams.get("highlight");

  const allCategories = useMemo(() => {
    return [t("all"), ...categoryOrder];
  }, []);

  const [category, setCategory] = useState(categoryFromURL);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCategory(categoryFromURL);
    setPage(1);
  }, [categoryFromURL]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="sticky top-4 max-h-[65vh] overflow-auto bg-base-100 rounded-box shadow-xl p-4 w-60">
        <ul className="menu menu-vertical gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSearchParams({ category: cat });
              }}
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
                {t(cat.toLowerCase())}
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
