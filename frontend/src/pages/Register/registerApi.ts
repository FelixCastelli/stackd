import type {
  ApiErrorResponse,
  LoginResponse,
  RegisterCredentials,
} from "./types";

export async function registerUser(credentials: RegisterCredentials) {
  const response = await fetch("http://localhost:8000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errData = await readApiError(response);
    throw new Error(errData.detail || "Registration failed. Please try again.");
  }
}

export async function loginRegisteredUser({
  email,
  password,
}: RegisterCredentials): Promise<LoginResponse> {
  const response = await fetch("http://localhost:8000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });

  if (!response.ok) {
    const errData = await readApiError(response);
    throw new Error(errData.detail || "Login failed after registration.");
  }

  const data = (await response.json()) as LoginResponse;

  if (!data.access_token) {
    throw new Error("Invalid login response.");
  }

  return data;
}

async function readApiError(response: Response): Promise<ApiErrorResponse> {
  try {
    return (await response.json()) as ApiErrorResponse;
  } catch {
    return {};
  }
}
