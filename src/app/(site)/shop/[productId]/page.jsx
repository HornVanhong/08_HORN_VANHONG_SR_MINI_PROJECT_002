"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, use } from "react";
import { ShoppingCart } from "lucide-react";
import {
  getProductById,
  getAllProducts,
  rateProduct,
} from "../../../../service/product.service";
import { useCart } from "../../../../context/CartContext";

export default function ProductDetailPage({ params }) {
  const { productId } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToCart, isLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [thumbStart, setThumbStart] = useState(0);
  const [star, setStar] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [rating, setRating] = useState(false);
  const VISIBLE = 3;

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      const token = session?.accessToken ?? null;
      const data = await getProductById(productId, token);
      const p = data?.payload ?? data;
      setProduct(p);
      setStar(p?.star || 0);
      const colors = (p?.colors || []).filter((c) => c !== "string");
      const sizes = (p?.sizes || []).filter((s) => s !== "string");
      if (colors.length > 0) setSelectedColor(colors[0]);
      if (sizes.length > 0) setSelectedSize(sizes[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productId, session?.accessToken]);

  const fetchAllProducts = useCallback(async () => {
    try {
      const token = session?.accessToken ?? null;
      const data = await getAllProducts(1, 100, token);
      const list = data?.payload || [];
      setAllProducts(list);
      const idx = list.findIndex((p) => p.productId === productId);
      setCurrentIndex(idx);
      setThumbStart(Math.max(0, idx - 1));
    } catch (err) {
      console.error(err);
    }
  }, [productId, session?.accessToken]);

  useEffect(() => {
    if (status === "loading") return;
    fetchProduct();
    fetchAllProducts();
  }, [fetchProduct, fetchAllProducts, status]);

  const thumbPrev = () => setThumbStart((s) => Math.max(0, s - 1));
  const thumbNext = () =>
    setThumbStart((s) => Math.min(allProducts.length - VISIBLE, s + 1));

  const visibleThumbs = allProducts.slice(thumbStart, thumbStart + VISIBLE);

  const handleRate = async (s) => {
    try {
      setRating(true);
      const token = session?.accessToken ?? null;
      await rateProduct(product.productId, s, token);
      setStar(s);
    } catch (err) {
      console.error(err);
    } finally {
      setRating(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.productId,
      productName: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
          <p className="text-sm text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <button
          onClick={() => router.push("/shop")}
          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const colors = (product.colors || []).filter((c) => c !== "string");
  const sizes = (product.sizes || []).filter((s) => s !== "string");
  const description =
    product.description === "string" ? null : product.description;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/home" className="hover:text-gray-700 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gray-700 transition">
            Shop
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* LEFT: Image + Thumbnails */}
          <div>
            {/* Main Image */}
            <div
              className="bg-gray-50 rounded-3xl overflow-hidden"
              style={{ height: 500 }}
            >
              <Image
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.name}
                width={600}
                height={500}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 mt-5">
              {/* Left arrow */}
              <button
                onClick={thumbPrev}
                disabled={thumbStart === 0}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 text-lg transition hover:bg-gray-100 disabled:opacity-20"
              >
                ‹
              </button>

              {/* 3 visible thumbnails */}
              <div className="flex gap-3 flex-1 justify-start">
                {visibleThumbs.map((p) => (
                  <button
                    key={p.productId}
                    onClick={() => router.push(`/shop/${p.productId}`)}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-gray-50 ${
                      p.productId === productId
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={p.imageUrl || "/placeholder.jpg"}
                      alt={p.name}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>

              {/* Right arrow */}
              <button
                onClick={thumbNext}
                disabled={thumbStart + VISIBLE >= allProducts.length}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 text-lg transition hover:bg-gray-100 disabled:opacity-20"
              >
                ›
              </button>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-6">
            {/* Name & Stars */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Clickable Stars */}
              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    disabled={rating}
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRate(s)}
                    className="text-2xl transition-transform hover:scale-125 disabled:cursor-not-allowed"
                  >
                    <span
                      className={
                        s <= (hoveredStar || star)
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
                {star > 0 && (
                  <span className="text-sm text-gray-400 ml-1">({star}.0)</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-600">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Choose a color
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        selectedColor === color
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-xs text-gray-400 mt-2">
                    Selected: {selectedColor}
                  </p>
                )}
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Choose a size
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          selectedSize === size ? "bg-white" : "bg-gray-400"
                        }`}
                      />
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-sm text-gray-500 leading-relaxed">
                {description}
              </p>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border-2 border-gray-200 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition text-lg"
                >
                  -
                </button>
                <span className="px-4 text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {isLoading ? "Adding..." : "Add to cart"}
              </button>
            </div>

            {/* Free Returns */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-3 items-center">
              <span className="text-xl">↩︎</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Free 30-day returns
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  See return policy details in cart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
