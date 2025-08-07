import Masonry from "react-masonry-css";
import { useState, useMemo, useEffect } from "react";
import { Join, Button } from "react-daisyui";
import { useTranslation } from "react-i18next";

export default function MasonryProducts({
  products,
  category,
  page,
  setPage,
  highlightId,
  setSearchParams,
}) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const perPage = 6;
  const { t } = useTranslation();
  const filteredSorted = useMemo(() => {
    const normalizedSearch = searchTerm
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    let filtered =
      category === t("all")
        ? products
        : products.filter((p) => p.category === category);

    if (normalizedSearch) {
      filtered = products.filter((p) =>
        [p.name, p.desc, p.cdesc, p.code].some((field) =>
          field.toLowerCase().includes(normalizedSearch)
        )
      );
    }

    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    if (highlightId) {
      const idx = filtered.findIndex((p) => p.id === highlightId);
      if (idx > 0) {
        const [h] = filtered.splice(idx, 1);
        filtered.unshift(h);
      }
    }
    return filtered;
  }, [products, category, sortOrder, searchTerm, highlightId]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, category]);

  const slice = filteredSorted.slice((page - 1) * perPage, page * perPage);
  const cols = { default: 3, 1024: 2, 640: 1 };

  return (
    <>
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">
          {searchTerm.trim()
            ? `${t("searchResultFor")} "${searchTerm.trim()}", ${
                filteredSorted.length
              } ${t("itemFound")}`
            : category}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchParams({ category: t("all") });
            }}
            className="input input-bordered input-sm w-full sm:w-64"
          />
          <select
            className="select select-bordered select-sm"
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
      </div>

      {/* Masonry */}
      <Masonry
        breakpointCols={cols}
        className="flex gap-6 mt-6"
        columnClassName="flex flex-col gap-8"
      >
        {slice.map((p) => (
          <div
            key={p.id}
            className={`card cursor-pointer transition shadow-lg hover:shadow-xl h-[350px] w-full max-w-sm mx-auto ${
              p.id === highlightId ? "ring-2 ring-black" : ""
            }`}
            onClick={() => {
              setSearchTerm("");
              setPage(1);
              setSearchParams({ category: p.category, highlight: p.id });
            }}
          >
            <figure>
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-contain"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.desc}</p>
              <p className="text-xs italic text-gray-400">{p.cdesc}</p>
              <p className="text-xs text-gray-400">{p.code}</p>
              <p className="text-xs text-black font-semibold">{p.category}</p>
            </div>
          </div>
        ))}
      </Masonry>

      {/* No Results */}
      {filteredSorted.length === 0 && (
        <p className="text-center mt-10 text-gray-500">No products found.</p>
      )}

      {/* Pagination */}
      {filteredSorted.length > perPage && (
        <Join className="join justify-center mt-8">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            «
          </Button>
          {Array.from({
            length: Math.ceil(filteredSorted.length / perPage),
          }).map((_, i) => (
            <Button
              key={i}
              className={`join-item ${page === i + 1 ? "btn-active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            disabled={page === Math.ceil(filteredSorted.length / perPage)}
            onClick={() => setPage((p) => p + 1)}
          >
            »
          </Button>
        </Join>
      )}
    </>
  );
}
