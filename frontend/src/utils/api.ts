import { getToken, logOut } from "../auth";

export async function fetchBackend(endpoint: string, options: RequestInit = {}) {
    const token = getToken();

    const response = await fetch(`http://localhost:8000/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json', 
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        logOut();
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.")
    }

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}