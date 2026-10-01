import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ProgressContext, type Progress } from "./ProgressContext";
import { useAuth } from "../auth/useAuth";
import { API_BASE_URL } from "../../api/api.ts";

export function ProgressProvider({ children }: { children: ReactNode }) {
    const { currentUser, isLoading: authLoading } = useAuth();
    const [progress, setProgress] = useState<Progress | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    const refreshProgress = useCallback(async () => {
        if (!currentUser) return;

        const response = await fetch(`${API_BASE_URL}/v1/progress/me`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (!response.ok) throw new Error(`Failed to load progress (${response.status})`);
        const data: Progress = await response.json();
        setProgress(data);
    }, [currentUser]);

    useEffect(() => {
        if (authLoading || !currentUser) return;

        fetch(`${API_BASE_URL}/v1/progress/me`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Failed to load progress (${response.status})`);
                const data: Progress = await response.json();
                setProgress(data);
            })
            .catch(() => setProgress(null))
            .finally(() => setIsFetching(false));
    }, [authLoading, currentUser]);

    const isLessonUnlocked = useCallback(
        (lessonId: number) => progress !== null && lessonId <= progress.familyId,
        [progress]
    );

    const isLoading = authLoading || (!!currentUser && isFetching);

    return (
        <ProgressContext.Provider
            value={{
                progress: currentUser ? progress : null,
                isLoading,
                refreshProgress,
                isLessonUnlocked,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}
