"use client";

import { MoreHorizontal, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getCategories } from "../../../service/category.service";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../../service/product.service";

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ value = 0, max = 5 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < value ? "#f59e0b" : "none"}
          stroke={i < value ? "#f59e0b" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
      {value > 0 && (
        <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>
          {value}
        </span>
      )}
      {value === 0 && (
        <span style={{ fontSize: 13, color: "#d1d5db", marginLeft: 4 }}>—</span>
      )}
    </div>
  );
}

// ─── Dropdown Menu ────────────────────────────────────────────────────────────
function ProductMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#6b7280",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            zIndex: 50,
            minWidth: 130,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              width: "100%",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
              textAlign: "left",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              width: "100%",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "#ef4444",
              textAlign: "left",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const COLOR_OPTIONS = ["green", "gray", "red", "blue", "white"];
const SIZE_OPTIONS = ["s", "m", "l", "xl", "xxl", "xxxl"];

function ProductModal({ mode, product, onClose, onSave, categories }) {
  const CATEGORY_OPTIONS = [
    {
      value: "",
      label: categories.length === 0 ? "Loading categories..." : "Select...",
    },
    ...(categories.length > 0
      ? categories.map((cat) => {
          return { value: cat.categoryId, label: cat.name };
        })
      : [
          {
            value: "98aacd8f-9311-4272-b565-0a48cb6e41cc",
            label: "Default Category",
          },
        ]),
  ];
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.categoryId || "",
    imageUrl: product?.imageUrl || "",
    colors: product?.colors?.filter((c) => c !== "string") || [],
    sizes: product?.sizes?.filter((s) => s !== "string") || [],
    description:
      product?.description === "string" ? "" : product?.description || "",
  });
  const [saving, setSaving] = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleColor = (color) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(color)
        ? f.colors.filter((c) => c !== color)
        : [...f.colors, color],
    }));
  };

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  };

  const submit = async () => {
    if (!form.name || !form.price)
      return toast.error("Name and price are required");
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    color: "#111827",
    boxSizing: "border-box",
    background: "white",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {mode === "create" ? "Create product" : "Edit product"}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>
                Demo CRUD only (local state). Refresh resets changes.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 8,
                marginTop: -2,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "18px 24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Row 1: Name + Price */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Name</label>
              <input
                value={form.name}
                onChange={handle("name")}
                placeholder="e.g. Tea-Trica BHA Foam"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
            <div>
              <label style={labelStyle}>Price</label>
              <input
                type="number"
                value={form.price}
                onChange={handle("price")}
                placeholder="e.g. 62"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          {/* Row 2: Category + Image URL */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={handle("category")}
                disabled={categories.length === 0}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  paddingRight: 32,
                  cursor: categories.length === 0 ? "not-allowed" : "pointer",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "calc(100% - 10px) center",
                  opacity: categories.length === 0 ? 0.6 : 1,
                }}
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Image URL (optional)</label>
              <input
                value={form.imageUrl}
                onChange={handle("imageUrl")}
                placeholder="https://..."
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label style={labelStyle}>Colors</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {COLOR_OPTIONS.map((color) => {
                const selected = form.colors.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1.5px solid ${selected ? "#22c55e" : "#e5e7eb"}`,
                      background: selected ? "#f0fdf4" : "white",
                      cursor: "pointer",
                      fontSize: 13,
                      color: selected ? "#16a34a" : "#6b7280",
                      fontWeight: selected ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: selected
                          ? "2px solid #22c55e"
                          : "2px solid #d1d5db",
                        background: selected ? "#22c55e" : "transparent",
                        flexShrink: 0,
                      }}
                    />
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label style={labelStyle}>Sizes</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SIZE_OPTIONS.map((size) => {
                const selected = form.sizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: `1.5px solid ${selected ? "#22c55e" : "#e5e7eb"}`,
                      background: selected ? "#f0fdf4" : "white",
                      cursor: "pointer",
                      fontSize: 13,
                      color: selected ? "#16a34a" : "#6b7280",
                      fontWeight: selected ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: selected
                          ? "2px solid #22c55e"
                          : "2px solid #d1d5db",
                        background: selected ? "#22c55e" : "transparent",
                        flexShrink: 0,
                      }}
                    />
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={handle("description")}
              placeholder="Short description shown on the product card..."
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
              onFocus={(e) => (e.target.style.borderColor = "#22c55e")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: "14px 24px",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "white",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "none",
              background: "#22c55e",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "Saving…"
              : mode === "create"
                ? "Create product"
                : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onEdit, onDelete, onQuickAdd }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 18,
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)")
      }
    >
      {/* Image */}
      <div style={{ position: "relative", background: "#f9fafb", height: 220 }}>
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
          <ProductMenu
            onEdit={() => onEdit(product)}
            onDelete={() => onDelete(product)}
          />
        </div>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "contain", padding: 16 }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d1d5db",
              fontSize: 40,
            }}
          >
            ◇
          </div>
        )}
      </div>

      {/* Info */}
      <div
        style={{
          padding: "14px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <StarRating value={product.star || 0} />
        <p
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => onQuickAdd(product)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#22c55e",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 2px 8px rgba(34,197,94,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(34,197,94,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(34,197,94,0.35)";
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({ product, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "24px" }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: 17,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Delete Product?
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "#6b7280" }}>
            Are you sure you want to delete <strong>{product.name}</strong>?
            This action cannot be undone.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: "14px 24px",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "white",
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "none",
              background: "#ef4444",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("name-asc");
  const [modal, setModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const token = session?.accessToken ?? null;

  const fetchCategories = async (t) => {
    try {
      const data = await getCategories(t);
      setCategories(data?.payload || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const fetchProducts = async (t) => {
    setLoading(true);
    try {
      const data = await getAllProducts(1, 100, t);
      setProducts(data?.payload || []);
    } catch (err) {
      toast.error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!token) {
      toast.error("Please log in to manage products");
      setLoading(false);
      return;
    }
    fetchCategories(token);
    fetchProducts(token);
  }, [token, status]);

  const sorted = [...products].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const handleSave = async (form) => {
    if (!token) return toast.error("Please log in to manage products");
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description || "string",
        imageUrl: form.imageUrl || "string",
        colors: form.colors?.length > 0 ? form.colors : ["string"],
        sizes: form.sizes?.length > 0 ? form.sizes : ["string"],
        categoryId: form.category || null, // Include categoryId
      };

      if (modal.mode === "create") {
        await createProduct(payload, token);
        toast.success("Product created!");
      } else {
        await updateProduct(modal.product.productId, payload, token);
        toast.success("Product updated!");
      }
      setModal(null);
      fetchProducts(token);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (product) => {
    if (!token) return toast.error("Please log in to manage products");
    setDeleteModal(product);
  };

  const handleConfirmDelete = async () => {
    if (!token || !deleteModal) return;

    try {
      await deleteProduct(deleteModal.productId, token);
      toast.success("Product deleted");
      setDeleteModal(null);
      fetchProducts(token);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
      setDeleteModal(null);
    }
  };

  const handleQuickAdd = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            Manage Products
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#9ca3af" }}>
            Create, update, and delete products in this demo (local state only).
          </p>
        </div>

        {/* Card wrapper */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #f0f0f0",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Products
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label
                  style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}
                >
                  Sort
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{
                    padding: "7px 32px 7px 12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 13,
                    color: "#374151",
                    background: "white",
                    cursor: "pointer",
                    outline: "none",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "calc(100% - 10px) center",
                  }}
                >
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                  <option value="price-asc">Price (Low–High)</option>
                  <option value="price-desc">Price (High–Low)</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (categories.length === 0) {
                    toast.error("Loading categories, please wait...");
                    return;
                  }
                  setModal({ mode: "create" });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "#22c55e",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: categories.length === 0 ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
                  transition: "opacity 0.15s",
                  opacity: categories.length === 0 ? 0.6 : 1,
                }}
                onMouseEnter={(e) =>
                  categories.length > 0 &&
                  (e.currentTarget.style.opacity = "0.88")
                }
                onMouseLeave={(e) =>
                  categories.length > 0 && (e.currentTarget.style.opacity = "1")
                }
                disabled={categories.length === 0}
              >
                <Plus size={16} strokeWidth={2.5} />
                Create product
              </button>
            </div>
          </div>

          {/* Grid */}
          <div style={{ padding: 24 }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "60px 0",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "3px solid #e5e7eb",
                    borderTopColor: "#22c55e",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : sorted.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#9ca3af",
                  fontSize: 15,
                }}
              >
                No products yet. Create one!
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 20,
                }}
              >
                {sorted.map((p) => (
                  <ProductCard
                    key={p.productId}
                    product={p}
                    onEdit={(p) => setModal({ mode: "edit", product: p })}
                    onDelete={handleDelete}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          onClose={() => setModal(null)}
          onSave={handleSave}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <ConfirmDeleteModal
          product={deleteModal}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal(null)}
        />
      )}
    </div>
  );
}
