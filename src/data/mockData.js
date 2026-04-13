/**
 * Mock API-style responses — frontend only, no network calls.
 * Shapes mirror typical REST examples for categories, products, and orders.
 */

export const categoriesResponse = {
  data: [
    {
      categoryId: 1,
      categoryName: "Skincare",
      subtitle: "Serums, creams & treatments",
    },
    {
      categoryId: 2,
      categoryName: "Makeup",
      subtitle: "Color & complexion",
    },
    {
      categoryId: 3,
      categoryName: "Fragrance",
      subtitle: "Signature scents",
    },
    {
      categoryId: 4,
      categoryName: "Haircare",
      subtitle: "Shine & strength",
    },
  ],
};

export const productsResponse = {
  data: [
    {
      productId: 101,
      brand: "Estée Lauder",
      productName: "Revitalizing Night Serum",
      description: "Overnight renewal with peptides for firmer, brighter skin.",
      price: 89,
      categoryId: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
      essentialsTag: "serum",
    },
    {
      productId: 102,
      brand: "La Mer",
      productName: "Hydra Glow Moisturizer",
      description: "24-hour hydration with hyaluronic acid and ceramides.",
      price: 62,
      categoryId: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
      essentialsTag: "moisturizer",
    },
    {
      productId: 103,
      brand: "Chanel",
      productName: "Velvet Matte Lip Color",
      description: "Full-coverage lip color with a soft matte finish.",
      price: 38,
      categoryId: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
      essentialsTag: "toner",
    },
    {
      productId: 104,
      brand: "Dior",
      productName: "Luminous Foundation",
      description: "Buildable coverage with a natural, skin-like radiance.",
      price: 54,
      categoryId: 2,
      imageUrl: null,
      essentialsTag: "moisturizer",
    },
    {
      productId: 105,
      brand: "Tom Ford",
      productName: "Noir Essence Eau de Parfum",
      description: "Warm amber, vanilla, and soft florals for evening wear.",
      price: 125,
      categoryId: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop",
    },
    {
      productId: 106,
      brand: "Oribe",
      productName: "Silk Repair Hair Oil",
      description: "Weightless oil for frizz control and mirror-like shine.",
      price: 44,
      categoryId: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop",
      essentialsTag: "cleanser",
    },
    {
      productId: 107,
      brand: "SkinCeuticals",
      productName: "Vitamin C Brightening Drops",
      description: "Antioxidant serum to even tone and boost luminosity.",
      price: 72,
      categoryId: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
      essentialsTag: "serum",
    },
    {
      productId: 108,
      brand: "Anastasia",
      productName: "Precision Brow Sculpt",
      description: "Dual-ended brow pencil and gel for defined arches.",
      price: 28,
      categoryId: 2,
      imageUrl: null,
    },
  ],
};

export const ordersResponse = {
  data: [
    {
      orderId: 9001,
      customerId: 501,
      totalAmount: 245.5,
      orderDate: "2025-03-12",
      orderDetails: [
        { productId: 101, quantity: 2, lineTotal: 178 },
        { productId: 103, quantity: 1, lineTotal: 38 },
        { productId: 104, quantity: 1, lineTotal: 29.5 },
      ],
    },
    {
      orderId: 9002,
      customerId: 502,
      totalAmount: 189,
      orderDate: "2025-03-14",
      orderDetails: [
        { productId: 105, quantity: 1, lineTotal: 125 },
        { productId: 106, quantity: 1, lineTotal: 44 },
        { productId: 108, quantity: 1, lineTotal: 20 },
      ],
    },
    {
      orderId: 9003,
      customerId: 503,
      totalAmount: 62,
      orderDate: "2025-03-18",
      orderDetails: [{ productId: 102, quantity: 1, lineTotal: 62 }],
    },
    {
      orderId: 9004,
      customerId: 504,
      totalAmount: 116,
      orderDate: "2025-03-20",
      orderDetails: [],
    },
  ],
};

/** Helpers for lookups by id */
export const categories = categoriesResponse.data;
export const products = productsResponse.data;
export const orders = ordersResponse.data;

/** Landing “skincare essentials” filters — lowercase tag on each product, or omit for “All” only */
export const ESSENTIALS_TABS = ["All", "Moisturizer", "Serum", "Cleanser", "Toner"];

export function filterProductsByEssentialsTab(list, tab) {
  if (tab === "All") return list;
  const key = tab.toLowerCase();
  return list.filter((p) => p.essentialsTag === key);
}

export function getCategoryLabel(categoryId) {
  const c = categories.find((x) => x.categoryId === categoryId);
  return c?.categoryName ?? `Category ${categoryId}`;
}

export function getProductById(rawId) {
  const id = Number(rawId);
  if (Number.isNaN(id)) return null;
  return products.find((p) => p.productId === id) ?? null;
}

/**
 * Gallery URLs for the product detail page (main + thumbnails).
 * Falls back to the primary image plus stock shots, or placeholders when empty.
 */
export function getProductGallery(product) {
  if (Array.isArray(product.imageGallery) && product.imageGallery.length > 0) {
    return product.imageGallery;
  }
  if (product.imageUrl) {
    return [
      product.imageUrl,
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=1000&fit=crop",
    ];
  }
  return [null, null, null, null];
}
