// src/components/MasonryProducts.jsx
import { useMemo, useState, useEffect } from "react";
import { Join, Button, Input } from "react-daisyui";
import { useTranslation } from "react-i18next";

export default function MasonryProducts({
  products,
  category,
  page,
  setPage,
  highlightId,
  setSearchParams,
  onOpenCategories,
}) {
  const { t } = useTranslation();
  const perPage = 6;
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------- filtering (unchanged) ---------- */
  const filteredSorted = useMemo(() => {
    const normalize = (str) =>
      (str || "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^\p{L}\p{N}]/gu, "");
    const q = normalize(searchTerm);
    let filtered = [];

    if (q) {
      const map = new Map();
      for (const p of products) {
        if (normalize(p.name).includes(q) || normalize(p.cdesc).includes(q)) {
          if (!map.has(p.id)) map.set(p.id, p);
        }
      }
      filtered = Array.from(map.values());
    } else {
      if (category === "__all__") {
        const seen = new Set();
        filtered = products.filter((p) => !seen.has(p.id) && seen.add(p.id));
      } else if (category?.toLowerCase().trim() === "new item") {
        const seen = new Set();
        filtered = products.filter(
          (p) => p.isNew && !seen.has(p.id) && seen.add(p.id)
        );
      } else {
        filtered = products.filter(
          (p) =>
            p.category?.toLowerCase().trim() === category?.toLowerCase().trim()
        );
      }
    }

    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    if (!q && highlightId) {
      const idx = filtered.findIndex((p) => p.id === highlightId);
      if (idx > 0) {
        const [hit] = filtered.splice(idx, 1);
        filtered.unshift(hit);
      }
    }

    return filtered;
  }, [products, category, searchTerm, sortOrder, highlightId]);

  const totalPages = Math.ceil(filteredSorted.length / perPage);
  const slice = filteredSorted.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (highlightId) setPage(1);
  }, [highlightId, setPage]);

  useEffect(() => {
    setSearchTerm("");
    setPage(1);
  }, [category, setPage]);

  /* ---------- helpers: responsive compact pagination ---------- */
  const [maxItems, setMaxItems] = useState(5); // how many items incl. numbers + ellipses (mobile)
  useEffect(() => {
    const mqMd = window.matchMedia("(min-width:768px)");
    const mqLg = window.matchMedia("(min-width:1024px)");
    const update = () => setMaxItems(mqLg.matches ? 9 : mqMd.matches ? 7 : 5);
    update();
    mqMd.addEventListener?.("change", update);
    mqLg.addEventListener?.("change", update);
    return () => {
      mqMd.removeEventListener?.("change", update);
      mqLg.removeEventListener?.("change", update);
    };
  }, []);

  const pageItems = useMemo(() => {
    // returns array like: [1, '…', 6, 7, 8, '…', 20]
    const max = Math.max(5, maxItems);
    if (totalPages <= max)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const side = 1; // always show first & last
    const windowSize = max - side * 2 - 2; // numbers around current, minus two ellipses
    let start = Math.max(2, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages - 1, start + windowSize - 1);
    // shift left if we hit the right edge
    start = Math.max(2, Math.min(start, totalPages - 1 - windowSize + 1));
    const items = [1];
    if (start > 2) items.push("…");
    for (let i = start; i <= end; i++) items.push(i);
    if (end < totalPages - 1) items.push("…");
    items.push(totalPages);
    return items;
  }, [page, totalPages, maxItems]);

  return (
    <>
      {/* Search + Sort + (Mobile) Categories Trigger */}
      <div
        className="grid items-center gap-2 mt-1 mb-3 md:mb-6
                      grid-cols-[minmax(9rem,3fr)_minmax(4.8rem,1fr)_minmax(6.4rem,2fr)]
                      md:grid-cols-[minmax(16rem,1fr)_auto]"
      >
        <Input
          type="text"
          placeholder={`🔍 ${t("searchProduct")}...`}
          className="input input-bordered input-sm  text-base placeholder:text-base leading-tight min-w-0 w-full md:input-md md:max-w-sm lg:input-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value.trimStart());
            setPage(1);
          }}
        />
        <select
          aria-label="Sort"
          className="select select-bordered select-sm text-base leading-tight w-full md:select-md lg:select-sm"
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
        >
          <option value="asc">A–Z</option>
          <option value="desc">Z–A</option>
        </select>
        <button
          type="button"
          className="btn btn-outline btn-sm w-full truncate md:hidden"
          onClick={onOpenCategories}
          aria-haspopup="dialog"
          title={t("categories") || "Categories"}
        >
          {t("categories") || "Categories"}
        </button>
      </div>

      {/* Grid + Pagination: put pagination INSIDE the grid and span all columns */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {slice.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSearchParams({ category: p.category, highlight: p.id });
              setSearchTerm("");
              setPage(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`card h-full flex flex-col text-left shadow hover:shadow-lg transition ${
              p.id === highlightId ? "border-2 border-black" : ""
            }`}
          >
            <figure className="bg-gray-50">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 sm:h-48 md:h-56 object-contain"
                loading="lazy"
              />
            </figure>
            <div className="card-body p-3 sm:p-4 flex flex-col grow !gap-1 sm:!gap-1.5">
              <h3 className="card-title leading-snug text-sm sm:text-base md:text-2xl line-clamp-2 min-h-[2.4rem] sm:min-h-[2.8rem] md:min-h-[3.2rem]">
                {p.name}
              </h3>
              <p className="text-sm sm:text-base md:text-xl leading-tight line-clamp-1 min-h-[1.05rem] sm:min-h-[1.2rem]">
                {p.cdesc}
              </p>
              <p className="text-[11px] sm:text-sm text-gray-600 leading-tight line-clamp-1 min-h-[1.05rem] sm:min-h-[1.2rem]">
                {p.desc}
              </p>
              <p className="text-[10px] text-gray-400 mt-auto">{p.code}</p>
            </div>
          </button>
        ))}

        {/* Pagination aligned with grid */}
        {totalPages > 1 && (
          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="flex justify-center">
                <Join className="join">
                  <Button
                    className="join-item text-2xl md:text-3xl leading-none"
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    aria-label="First"
                  >
                    «
                  </Button>
                  <Button
                    className="join-item text-2xl md:text-3xl leading-none"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    aria-label="Prev"
                  >
                    ‹
                  </Button>

                  {pageItems.map((it, idx) =>
                    it === "…" ? (
                      <Button
                        key={`dots-${idx}`}
                        className="join-item btn-ghost btn-disabled px-2"
                      >
                        …
                      </Button>
                    ) : (
                      <Button
                        key={it}
                        className={`join-item ${
                          page === it ? "btn-active" : ""
                        }`}
                        onClick={() => setPage(it)}
                      >
                        {it}
                      </Button>
                    )
                  )}

                  <Button
                    className="join-item text-2xl md:text-3xl leading-none"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    aria-label="Next"
                  >
                    ›
                  </Button>
                  <Button
                    className="join-item text-2xl md:text-3xl leading-none"
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    aria-label="Last"
                  >
                    »
                  </Button>
                </Join>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
