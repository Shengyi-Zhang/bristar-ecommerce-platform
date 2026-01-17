// src/pages/Products.jsx
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

  // 🆕 抽屉开关上提到这里，方便别的组件触发
  const [catOpen, setCatOpen] = useState(false);

  const allCategories = useMemo(() => ["__all__", ...categoryOrder], []);

  useEffect(() => {
    setCategory(categoryFromURL);
    setPage(1);
  }, [categoryFromURL]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-base lg:text-lg">
      {/* 📱 Mobile 顶部：仅显示当前分类（不再放按钮） */}
      <MobileCategoryBar
        category={category}
        allCategories={allCategories}
        setSearchParams={setSearchParams}
        setPage={setPage}
        t={t}
        open={catOpen}
        setOpen={setCatOpen}
        hideTrigger // ← 隐藏顶部的“categories”按钮
      />

      {/* 💻 Desktop: 左侧侧栏 */}
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
                  ${category === cat ? "text-black" : "text-gray-400"}
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
          onOpenCategories={() => setCatOpen(true)}
        />
      </main>
    </div>
  );
}

/* ============ Mobile Category Bar + Bottom Sheet ============ */
function MobileCategoryBar({
  category,
  allCategories,
  setSearchParams,
  setPage,
  t,
  open,
  setOpen,
  hideTrigger = false, // true 时隐藏顶部触发按钮
}) {
  // 防止抽屉打开时背景滚动
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = original);
  }, [open]);

  const label = (cat) => (cat === "__all__" ? t("all") : t(cat.toLowerCase()));

  return (
    <>
      {/* 底部抽屉 */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label={t("categories") || "Categories"}
            className="absolute left-0 right-0 bottom-0 rounded-t-2xl bg-base-100 shadow-2xl p-4 pb-6 max-h-[75vh] overflow-y-auto"
          >
            <div className="mx-auto h-1.5 w-10 bg-gray-300 rounded-full mb-3" />
            {/* 🆕 抽屉标题字号可调 */}
            <h3 className="text-center font-semibold mb-3 text-base sm:text-lg">
              {t("categories") || "Categories"}
            </h3>

            {/* 3列网格按钮：字号可调，英文保持小写 */}
            <div className="grid grid-cols-3 gap-2">
              {allCategories.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchParams({ category: cat });
                      setPage(1);
                      setOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`btn whitespace-nowrap normal-case
                      btn-sm sm:btn-md          /* ← 调整按钮高度 */
                      text-[12px] sm:text-sm     /* ← 调整按钮文字大小 */
                      ${active ? "btn-neutral" : "btn-outline"}`}
                  >
                    {label(cat)}
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-block btn-ghost mt-4 text-sm"
              onClick={() => setOpen(false)}
            >
              {t("close") || "Close"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
