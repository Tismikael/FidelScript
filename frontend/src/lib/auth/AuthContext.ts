import { createContext } from "react";

export interface CurrentUser {
    userId: number;
    username: string;
    email: string;
    token: string;
}

export interface AuthContextValue {
    currentUser: CurrentUser | null;
    isLoading: boolean;
    login: (user: CurrentUser) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
