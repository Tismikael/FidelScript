import { Navigate, Outlet } from "react-router";
import { useAuth } from "./useAuth";

export function RedirectIfAuthed() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) return null;
    if (currentUser) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}
