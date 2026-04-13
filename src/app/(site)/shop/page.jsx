"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCategories } from "../../../service/category.service";
import { getAllProducts } from "../../../service/product.service";

const MAX_PRICE = 300;

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill={star <= Math.round(rating) ? "#F5A623" : "none"}
            stroke={star <= Math.round(rating) ? "#F5A623" : "#D1D5DB"}
            strokeWidth="1.2"
          >
            <polygon points="7,1 8.8,5.2 13.4,5.6 10,8.6 11,13.2 7,10.8 3,13.2 4,8.6 0.6,5.6 5.2,5.2" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-400">{count > 0 ? count : "—"}</span>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
      <div className="h-52 w-full bg-gray-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-8 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

function ProductCard({ product, categoryName }) {
  const productId = product.productId ?? product.id;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="flex items-center justify-center bg-gray-50 h-52 w-full">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`Product image of ${product.name}`}
            width={160}
            height={160}
            className="object-contain h-40 w-40"
          />
        ) : (
          <div
            role="img"
            aria-label={`No image available for ${product.name}`}
            className="flex items-center justify-center h-40 w-40"
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="8" width="48" height="48" rx="8" fill="#F3F4F6" />
              <path
                d="M24 32 Q32 20 40 32 Q48 44 56 32"
                stroke="#D1D5DB"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="22" cy="26" r="4" fill="#D1D5DB" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <StarRating
          rating={product.star ?? 0}
          count={product.reviewCount ?? 0}
        />

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>
          {categoryName && (
            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full font-medium">
              {categoryName}
            </span>
          )}
        </div>

        {/*Routes to /shop/[productId] */}
        <Link
          href={`/shop/${productId}`}
          className="mt-2 w-full rounded-xl bg-gray-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          View Product
        </Link>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { data: session, status } = useSession();
  const isSessionReady = status !== "loading";
  const token = session?.accessToken ?? null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 9;

  // Filters
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [searchInput, setSearchInput] = useState("");

  // Categories
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // categoryId -> name lookup
  const categoryMap = useMemo(() => {
    return Object.fromEntries(categoryList.map((c) => [c.categoryId, c.name]));
  }, [categoryList]);

  // Fetch categories — wait for session
  useEffect(() => {
    if (!isSessionReady) return;
    const fetchCategories = async () => {
      try {
        const data = await getCategories(token);
        const cats = Array.isArray(data) ? data : (data.payload ?? []);
        setCategoryList(cats);
      } catch (err) {
        // Silently fail if categories cannot be fetched
      }
    };
    fetchCategories();
  }, [isSessionReady, token]);

  // Fetch products — wait for session
  const fetchProducts = useCallback(async () => {
    if (!isSessionReady) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts(page, PAGE_SIZE, token);
      const items = Array.isArray(data) ? data : (data.payload ?? []);
      setProducts(items);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, token, isSessionReady]);

  useEffect(() => {
    if (!isSessionReady) return;
    fetchProducts();
  }, [fetchProducts, isSessionReady]);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.length === 0) {
        return categoryList
          .map((c) => c.categoryId)
          .filter((id) => id !== categoryId);
      }
      const next = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      return next.length === categoryList.length ? [] : next;
    });
  };

  const resetFilters = () => {
    setMaxPrice(MAX_PRICE);
    setSelectedCategories([]);
    setSearchInput("");
    setPage(1);
  };

  // Client-side filter
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchPrice = p.price <= maxPrice;
      const pCategoryId =
        p.categoryId ||
        categoryList.find((c) => c.name === p.category)?.categoryId;
      const matchCat =
        selectedCategories.length === 0 ||
        (pCategoryId && selectedCategories.includes(pCategoryId));
      const matchSearch = p.name
        ?.toLowerCase()
        .includes(searchInput.toLowerCase());
      return matchPrice && matchCat && matchSearch;
    });
  }, [products, maxPrice, selectedCategories, searchInput, categoryList]);

  const quickSelects = [
    { label: "Under $50", value: 50 },
    { label: "Under $100", value: 100 },
    { label: "Under $150", value: 150 },
    { label: "All prices", value: MAX_PRICE },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Luxury beauty products
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Use the filters to narrow by price and brand.
            </p>
          </div>
          <div className="sm:w-72 w-full">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchInput}
              onChange={handleSearchInput}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 transition"
            />
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0 rounded-2xl border border-gray-100 bg-white p-5 sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-gray-900 text-sm">
                Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition"
              >
                Reset filters
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
                Price Range
              </p>
              <p className="text-sm text-gray-600 mb-3">
                $0 –{" "}
                {maxPrice === MAX_PRICE
                  ? `$${MAX_PRICE} (no limit)`
                  : `$${maxPrice}`}
              </p>
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gray-900"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$0</span>
                <span>${MAX_PRICE}</span>
              </div>
            </div>

            {/* Quick Select */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
                Quick Select
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickSelects.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => setMaxPrice(q.value)}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                      maxPrice === q.value
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            {categoryList.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
                  Categories
                </p>
                <div className="flex flex-col gap-2">
                  {categoryList.map((cat) => (
                    <label
                      key={cat.categoryId}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedCategories.length === 0 ||
                            selectedCategories.includes(cat.categoryId)
                          }
                          onChange={() => toggleCategory(cat.categoryId)}
                          className="accent-gray-900 h-3.5 w-3.5"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {
                          products.filter(
                            (p) => p.categoryId === cat.categoryId,
                          ).length
                        }
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  Select none to include all categories.
                </p>
              </div>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {!loading && !error && (
              <p className="text-sm text-gray-500 mb-4">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filtered.length}
                </span>{" "}
                product{filtered.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center mb-4">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-3 text-xs text-red-400 underline hover:text-red-600 transition"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-24 text-center">
                <p className="text-gray-400 text-sm">
                  No products match your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-xs text-gray-500 underline hover:text-gray-900 transition"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Products */}
            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.productId ?? product.id}
                    product={product}
                    categoryName={
                      categoryMap[product.categoryId] ??
                      product.category ??
                      null
                    }
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`rounded-xl border px-4 py-2 text-sm transition ${
                        p === page
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
