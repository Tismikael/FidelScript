import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type CurrentUser } from "./AuthContext";
import { API_BASE_URL } from "../api/api";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (user: CurrentUser) => setCurrentUser(user);
    const logout = () => {
        setCurrentUser(null);
        fetch(`${API_BASE_URL}/v1/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {
            // best-effort — the local session is already cleared either way
        });
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/v1/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
            .then(async (response) => {
                if (!response.ok) return;
                const user: CurrentUser = await response.json();
                setCurrentUser(user);
            })
            .catch(() => {
                // no valid refresh cookie (or the backend is unreachable) — stay logged out
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
