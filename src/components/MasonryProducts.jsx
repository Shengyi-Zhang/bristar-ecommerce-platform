// src/components/MasonryProducts.jsx
import { useMemo, useState, useEffect } from "react";
import { Join, Button, Input } from "react-daisyui";

export default function MasonryProducts({
  products,
  category,
  page,
  setPage,
  highlightId,
  setSearchParams,
}) {
  const perPage = 6;
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <>
      {/* Search + Sort */}
      {/* Search + Sort in one row */}
      {/* Search + Sort (responsive sizes) */}
      <div className="flex items-center gap-2 mb-4 md:mb-6 md:justify-end">
        <Input
          type="text"
          placeholder="🔍 Search products..."
          className="
      input input-bordered
      input-sm                      
      flex-1                        
      md:flex-none md:input-md      
      md:max-w-sm lg:input-sm      
    "
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value.trimStart());
            setPage(1);
          }}
        />

        <select
          aria-label="Sort"
          className="
      select select-bordered
      select-sm                    
      md:select-md lg:select-sm     
      shrink-0 w-[5.5rem] sm:w-[6rem]
    "
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
        >
          <option value="asc">A–Z</option>
          <option value="desc">Z–A</option>
        </select>
      </div>

      {/* Grid: base 2 cols → md:2 → lg:3 */}
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

            {/* Normalize text heights so rows look clean */}
            <div className="card-body p-3 sm:p-4 flex flex-col grow !gap-1 sm:!gap-1.5">
              {/* Title */}
              <h3 className="card-title leading-snug text-sm sm:text-base md:text-2xl line-clamp-2 min-h-[2.4rem] sm:min-h-[2.8rem] md:min-h-[3.2rem]">
                {p.name}
              </h3>

              {/* cdesc (Chinese) */}
              <p className="text-sm sm:text-base md:text-xl leading-tight line-clamp-1 min-h-[1.05rem] sm:min-h-[1.2rem]">
                {p.cdesc}
              </p>

              {/* desc (size/pack) */}
              <p className="text-[11px] sm:text-sm text-gray-600 leading-tight line-clamp-1 min-h-[1.05rem] sm:min-h-[1.2rem]">
                {p.desc}
              </p>

              {/* code pinned at bottom */}
              <p className="text-[10px] text-gray-400 mt-auto">{p.code}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Join className="join justify-center mt-6">
          <Button
            className="join-item"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            «
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              className={`join-item ${page === i + 1 ? "btn-active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            className="join-item"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            »
          </Button>
        </Join>
      )}
    </>
  );
}
