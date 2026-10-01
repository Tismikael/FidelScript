import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/useAuth";
import { useProgress } from "./useProgress";

export function useLessonGuard(lessonId: number) {
    const navigate = useNavigate();
    const { currentUser, isLoading: authLoading } = useAuth();
    const { progress, isLoading: progressLoading, isLessonUnlocked } = useProgress();

    const settled = !authLoading && !!currentUser && !progressLoading;
    const unlocked = isLessonUnlocked(lessonId);

    useEffect(() => {
        if (authLoading) return;
        if (!currentUser) navigate("/login", { replace: true });
    }, [authLoading, currentUser, navigate]);

    useEffect(() => {
        if (!settled) return;
        if (!unlocked) navigate("/dashboard", { replace: true });
    }, [settled, unlocked, navigate]);

    return { currentUser, progress, isReady: settled && unlocked };
}
