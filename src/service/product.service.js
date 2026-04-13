const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getTopSellingProducts(limit = 10, token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${BASE_URL}/products/top-selling?limit=${limit}`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Fetch top selling products failed with status ${res.status}`;
      const details = err?.errors;
      const errorDetails = details
        ? Object.entries(details)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : null;
      throw new Error(
        errorDetails ? `${errorMessage} (${errorDetails})` : errorMessage,
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllProducts(page = 1, pageSize = 10, token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(
      `${BASE_URL}/products?page=${page}&pageSize=${pageSize}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Fetch all products failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductsByCategory(
  categoryId,
  page = 1,
  pageSize = 10,
  token = null,
) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(
      `${BASE_URL}/categories/${categoryId}/products?page=${page}&pageSize=${pageSize}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Fetch products by category failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchProducts(
  query,
  page = 1,
  pageSize = 10,
  token = null,
) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Search products failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductById(productId, token = null) {
  try {
    const headers = getAuthHeaders(token);

    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      let errorMessage = `Fetch product failed with status ${res.status}`;

      try {
        const err = await res.json();
        errorMessage = err?.message || err?.title || errorMessage;

        // Handle validation errors if any
        if (err?.errors) {
          const details = Object.entries(err.errors)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
          errorMessage += ` (${details})`;
        }
      } catch (parseErr) {
        // Response body was not JSON
      }

      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
export async function rateProduct(productId, star, token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(
      `${BASE_URL}/products/${productId}/rating?star=${star}`,
      { method: "PATCH", headers },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Rate product failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
export async function createProduct(productData, token = null) {
  try {
    const headers = getAuthHeaders(token);

    // Log what we're sending
    console.log("createProduct payload:", JSON.stringify(productData, null, 2));

    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers,
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      // Log full error so we can see what field is wrong
      console.error("createProduct API error:", JSON.stringify(err, null, 2));
      throw new Error(
        err?.message ||
          err?.title ||
          `Create product failed with status ${res.status}`,
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("createProduct error:", error);
    throw error;
  }
}

export async function updateProduct(productId, productData, token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(
        err?.message ||
          err?.title ||
          `Update product failed with status ${res.status}`,
      );
    }

    const data = await res.json();
    console.log("Updated product:", data);
    return data;
  } catch (error) {
    console.error("updateProduct error:", error);
    throw error;
  }
}

export async function deleteProduct(productId, token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(
        err?.message ||
          err?.title ||
          `Delete product failed with status ${res.status}`,
      );
    }

    console.log("Deleted product:", productId);
    return true;
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw error;
  }
}
