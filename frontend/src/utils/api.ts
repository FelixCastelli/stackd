export async function fetchBackend(endpoint: string, options = {}) {
    const response = await fetch(`http://localhost:8000/${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}