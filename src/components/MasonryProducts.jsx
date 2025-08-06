import Masonry from "react-masonry-css";
import { useState, useMemo } from "react";
import { Join, Button } from "react-daisyui";

export default function MasonryProducts({ products, category, page, setPage }) {
  const [sortOrder, setSortOrder] = useState("asc");

  const perPage = 6;

  const filteredSorted = useMemo(() => {
    const filtered = products.filter(
      (p) => p.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    return filtered;
  }, [products, category, sortOrder]);

  const totalPages = Math.ceil(filteredSorted.length / perPage);
  const slice = filteredSorted.slice((page - 1) * perPage, page * perPage);

  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{category}</h2>
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

      {/* 🧱 Masonry Layout */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-6 mt-6"
        columnClassName="flex flex-col gap-8"
      >
        {slice.map((p) => (
          <div
            key={p.id}
            className="card shadow-lg hover:shadow-xl transition h-[350px] w-full max-w-sm mx-auto"
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
            </div>
          </div>
        ))}
      </Masonry>

      {/* Pagination */}
      {totalPages > 1 && (
        <Join className="join justify-center mt-8">
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
