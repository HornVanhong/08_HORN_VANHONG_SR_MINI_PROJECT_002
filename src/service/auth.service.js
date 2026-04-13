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

  if (!res.ok) {
    throw new Error(`Login failed with status: ${res.status}`);
  }

  const loggedUser = await res.json();
  return loggedUser;
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
