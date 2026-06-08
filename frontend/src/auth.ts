export function isLoggedIn(): boolean {
    return !!localStorage.getItem("token"); 
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function logOut(): void {
    localStorage.removeItem("token");
}