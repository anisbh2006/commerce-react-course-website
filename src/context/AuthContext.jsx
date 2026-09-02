import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const AUTH_API_URL = "/api/auth";

async function getResponseData(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Authentication request failed");
    }

    return data;
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let isActive = true;

        async function restoreSession() {
            try {
                const response = await fetch(`${AUTH_API_URL}/session`, {
                    credentials: "include",
                });
                const data = await getResponseData(response);

                if (isActive) {
                    setUser(data.user || null);
                }
            } catch {
                if (isActive) {
                    setUser(null);
                }
            }
        }

        restoreSession();

        return () => {
            isActive = false;
        };
    }, []);

    async function authenticate(endpoint, email, password) {
        try {
            const response = await fetch(`${AUTH_API_URL}/${endpoint}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await getResponseData(response);

            setUser(data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "Authentication request failed",
            };
        }
    }

    function signup(email, password) {
        return authenticate("signup", email, password);
    }

    function login(email, password) {
        return authenticate("login", email, password);
    }

    async function logout() {
        try {
            const response = await fetch(`${AUTH_API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });
            await getResponseData(response);
            setUser(null);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : "Logout failed",
            };
        }
    }

    return (
        <AuthContext.Provider value={{ signup, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
