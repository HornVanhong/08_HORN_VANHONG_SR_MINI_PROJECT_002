const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getCategories(token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${BASE_URL}/categories`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Fetch categories failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
