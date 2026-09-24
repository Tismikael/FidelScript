import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import letters from "../../lib/data/letters.json";
import style from "../../styles/dashboard.module.css";
import clsx from "clsx";
import { useAuth } from "../../lib/auth/useAuth";
import { API_BASE_URL } from "../../lib/api/api";
import CircularProgress from "@mui/material/CircularProgress";

type LessonStatus = "LOCKED" | "IN_PROGRESS" | "COMPLETED";

const PARTS_PER_LESSON = 4;

interface Progress {
    familyId: number;
    partCompletion: number;
}

function NavBar({ name, onLogout }: { name: string; onLogout: () => void }) {
    const [open, setOpen] = useState(false);
    const navbarAvatarStyle = clsx(style.avatar, open && style.avatar_open);

    return (
        <nav className={style.navbar}>
            <div className={style.navbar_title}>
                <span className={style.navbar_foreign}>ፊደል</span>
                <div className={style.navbar_english}>
                    <span>Fidel</span>
                    <span>Learn </span>
                </div>
                <span className={style.navbar_welcome}>Welcome {name}</span>
            </div>

            <div  className={style.avatar_wrapper}>
                <button
                    className={navbarAvatarStyle}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {name[0]}
                </button>
                {open && (
                    <div className={style.menu}>
                        <button className={style.menu_item} onClick={() => setOpen(false)}>Profile</button>
                        <button className={style.menu_item} onClick={onLogout}>Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
    return (
        <div className={style.progress}>
            <div className={style.progress_labels}>
                <span>Overall Progress</span>
                <span>{completed} / {total} lessons</span>
            </div>
            <div className={style.progress_track}>
                <div className={style.progress_fill} style={{ width: `${(completed / total) * 100}%` }} />
            </div>
        </div>
    );
}

interface LessonCardProps {
    lessonNumber: number;
    amharicName: string;
    englishName: string;
    status: LessonStatus;
    partsCompleted: number;
    onClick: () => void;
}

const statusLabel: Record<LessonStatus, string> = {
    LOCKED: "Locked",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
};

function LessonCard({ lessonNumber, amharicName, englishName, status, partsCompleted, onClick }: LessonCardProps) {
    const locked = status === "LOCKED";
    const lessonCardStyle = clsx(
        style.card,
        status === "IN_PROGRESS" && style.card_current,
        locked && style.card_locked
    );
    const lessonBadgeStyle = clsx(
        style.badge,
        status === "COMPLETED" && style.badge_completed
    );

    return (
        <div
            className={lessonCardStyle}
            onClick={locked ? undefined : onClick}
        >
            <div className={style.card_header}>
                <span>Lesson {lessonNumber}</span>
                <span className={lessonBadgeStyle}>
                    {statusLabel[status]}
                </span>
            </div>
            <h2 className={style.card_letter}>{amharicName}</h2>
            <span className={style.card_name}>{englishName} family</span>
            {locked ? (
                <small>Complete lesson {lessonNumber - 1} to unlock</small>
            ) : (
                <div className={style.parts}>
                    {Array.from({ length: PARTS_PER_LESSON }, (_, i) => i < partsCompleted).map((done, i) => (
                        <span key={i} className={clsx(style.part, done && style.part_done)}>
                            {done ? "✓ " : ""}Part {i + 1}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { currentUser, isLoading: authLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [progress, setProgress] = useState<Progress | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!currentUser) {
            navigate("/login", { replace: true });
            return;
        }

        fetch(`${API_BASE_URL}/v1/progress/me`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Failed to load progress (${response.status})`);
                return response.json();
            })
            .then((data: Progress) => setProgress(data))
            .catch(() => setError("Couldn't load your progress. Please try logging in again."));
    }, [currentUser, authLoading, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!currentUser) return null;

    if (error) {
        return (
            <>
                <NavBar name={currentUser.username} onLogout={handleLogout} />
                <div className={style.container}><p>{error}</p></div>
            </>
        );
    }

    if (!progress) {
        return (
            <>
                <NavBar name={currentUser.username} onLogout={handleLogout} />
                <div className={style.container}>
                        <CircularProgress size={70} aria-label="Loading" sx={{ color: 'var(--navbar-bg)'}}/>
                </div>
            </>
        );
    }

    const { familyId, partCompletion } = progress;

    return (
        <>
            <NavBar name={currentUser.username} onLogout={handleLogout} />
            <div className={style.container}>
                <ProgressBar completed={familyId - 1} total={letters.length} />
                <div className={style.grid}>
                    {letters.map((lesson) => {
                        const isPast = lesson.id < familyId;
                        const isCurrent = lesson.id === familyId;
                        const isFullyDone = isPast || (isCurrent && partCompletion === PARTS_PER_LESSON);
                        const status: LessonStatus = isFullyDone ? "COMPLETED" : isCurrent ? "IN_PROGRESS" : "LOCKED";
                        const partsCompleted = isFullyDone ? PARTS_PER_LESSON : isCurrent ? partCompletion : 0;

                        return (
                            <LessonCard
                                key={lesson.id}
                                lessonNumber={lesson.id}
                                amharicName={lesson.amharicName}
                                englishName={lesson.englishName}
                                status={status}
                                partsCompleted={partsCompleted}
                                onClick={() => navigate(`/lesson/${lesson.id}`, { state: { recognitionDone: isFullyDone } })}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
