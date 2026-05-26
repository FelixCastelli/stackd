import type { LoginCredentials, LoginResponse } from "./types";

export async function loginUser({ identifier, password }: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch("http://localhost:8000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: identifier, password }),
  });

  if (!response.ok) {
    throw new Error("Incorrect Email/Password. Please try again.");
  }

  const data = (await response.json()) as LoginResponse;

  if (!data.access_token) {
    throw new Error("Invalid login response.");
  }

  return data;
}
