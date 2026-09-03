import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const email = localStorage.getItem("currentUserEmail");

        return email ? { email } : null;
    });

    function signup(email, password) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        const existingUser = users.find((u) => u.email === email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        users.push({
            email,
            password,
        });

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUserEmail", email);

        setUser({ email });
    }

    function login(email, password) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        const existingUser = users.find(
            (u) => u.email === email && u.password === password
        );

        if (!existingUser) {
            throw new Error("Invalid email or password");
        }

        localStorage.setItem("currentUserEmail", email);

        setUser({ email });
    }

    function logout() {
        localStorage.removeItem("currentUserEmail");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                signup,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}