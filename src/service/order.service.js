function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function createOrder(orderData, token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.errors
          ? JSON.stringify(data.errors)
          : data?.message ||
              data?.title ||
              `Order failed with status ${res.status}`,
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUserOrders(token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Fetch orders failed with status ${res.status}`;

      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderById(orderId, token = null) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`,
      { method: "GET", headers },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Fetch order failed with status ${res.status}`;

      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
