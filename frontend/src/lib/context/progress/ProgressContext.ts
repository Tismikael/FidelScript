import { createContext } from "react";

export interface Progress {
    familyId: number;
    partCompletion: number;
}

export interface ProgressContextValue {
    progress: Progress | null;
    isLoading: boolean;
    refreshProgress: () => Promise<void>;
    isLessonUnlocked: (lessonId: number) => boolean;
}

export const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);
