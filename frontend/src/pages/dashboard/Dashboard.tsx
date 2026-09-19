import { useState } from "react";
import letters from "../../lib/data/letters.json";
import style from "../../styles/dashboard.module.css";
import clsx from "clsx";

type LessonStatus = "LOCKED" | "IN_PROGRESS" | "COMPLETED";

const mockUser = { name: "John", familyId: 4, partNumber: 2 };

function NavBar({ name }: { name: string }) {
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
                        <button className={style.menu_item} onClick={() => setOpen(false)}>Logout</button>
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
    partOneDone: boolean;
    partTwoDone: boolean;
    partThreeDone: boolean;
}

const statusLabel: Record<LessonStatus, string> = {
    LOCKED: "Locked",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
};

function LessonCard({ lessonNumber, amharicName, englishName, status, partOneDone, partTwoDone, partThreeDone }: LessonCardProps) {
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

    const partOneStyle = clsx(style.part, partOneDone && style.part_done);
    const partTwoStyle = clsx(style.part, partTwoDone && style.part_done);
    const partThreeStyle = clsx(style.part, partThreeDone && style.part_done);

    return (
        <div
            className={lessonCardStyle}
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
                    <span className={partOneStyle}>
                        {partOneDone ? "✓ " : ""}Part 1
                    </span>
                    <span className={partTwoStyle}>
                        {partTwoDone ? "✓ " : ""}Part 2
                    </span>
                    <span className={partThreeStyle}>
                        {partThreeDone ?  "✓ " : ""}Part 3
                    </span>
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { name, familyId, partNumber } = mockUser;

    return (
        <>
            <NavBar name={name} />
            <div className={style.container}>
                <ProgressBar completed={familyId - 1} total={letters.length} />
                <div className={style.grid}>
                    {letters.map((lesson) => {
                        const isPast = lesson.id < familyId;
                        const isCurrent = lesson.id === familyId;
                        const status: LessonStatus = isPast ? "COMPLETED" : isCurrent ? "IN_PROGRESS" : "LOCKED";

                        return (
                            <LessonCard
                                key={lesson.id}
                                lessonNumber={lesson.id}
                                amharicName={lesson.amharicName}
                                englishName={lesson.englishName}
                                status={status}
                                partOneDone={isPast || (isCurrent && partNumber === 2)}
                                partTwoDone={isPast}
                                partThreeDone={isPast}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
