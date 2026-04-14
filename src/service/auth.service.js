export async function loginService(data) {
  const user = {
    email: data.email,
    password: data.password,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auths/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage =
      payload?.detail || payload?.message || payload?.title || "Login failed";
    const details = payload?.errors;
    const detailText = details
      ? Object.entries(details)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" | ")
      : null;

    const fullMessage = detailText
      ? `${errorMessage} (${detailText})`
      : errorMessage;

    const error = new Error(fullMessage);
    error.status = res.status;
    error.details = details;
    throw error;
  }

  return payload;
}
export async function registerService(data) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auths/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errorMessage =
        err?.message ||
        err?.title ||
        `Registration failed with status ${res.status}`;

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

    const registeredUser = await res.json();
    return registeredUser;
  } catch (error) {
    throw error;
  }
}
