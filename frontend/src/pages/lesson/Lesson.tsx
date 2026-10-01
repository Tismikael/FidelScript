import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import style from "../../styles/lesson.module.css";
import { playSound } from "../../lib/audio/generateAudio";
import type { Lesson } from "../../lib/constants/Lesson";
import * as helperLesson from "../../lib/utils/assessments/lesson";
import { useLessonGuard } from "../../lib/context/progress/useLessonGuard";
import { BackToNav } from "../../lib/utils/navigation";
import { Navigation } from "../../lib/constants/Navigation";

const PARTS_PER_LESSON = 4;

interface LetterCardProps {
    char: string;
    label: string;
    onClick: () => void;
}

function LetterCard({ char, label, onClick }: LetterCardProps) {
    return (
        <div className={style.letter_card}>
            <h3 className={style.letter_char}>{char}</h3>
            <span className={style.letter_label}>{label}</span>
            <button
                className={style.play_button}
                onClick={onClick}
            >
                Play
            </button>
        </div>
    );
}

interface AssessmentCardProps {
    title: string;
    description: string;
    completed?: boolean;
    locked?: boolean;
    lockedText?: string;
    onStart?: () => void;
}

function AssessmentCard({ title, description, completed, locked, lockedText, onStart }: AssessmentCardProps) {
    const AssessmentCardStyle = clsx(style.panel, style.assessment_card, locked && style.assessment_locked);

    return (
        <div className={AssessmentCardStyle}>
            <div className={style.assessment_header}>
                <h2 className={style.assessment_title}>{title}</h2>
                {completed && <span className={style.badge}>Completed</span>}
            </div>
            <p className={style.assessment_text}>{description}</p>
            <div className={style.assessment_footer}>
                {locked ? (
                    <p className={style.assessment_text}>{lockedText}</p>
                ) : (
                    <button className={style.start_button} onClick={onStart}>Start Assessment</button>
                )}
            </div>
        </div>
    );
}

export default function Lesson() {
    const { id } = useParams();
    const navigate = useNavigate();

    const lessonId = Number(id);
    const lesson: Lesson | undefined = helperLesson.findLessonData(lessonId);

    const { progress, isReady } = useLessonGuard(lessonId);

    if (!isReady) {
        return <div className={style.container}><p>Loading...</p></div>;
    }

    const familyId = progress?.familyId;
    const isPast = familyId !== undefined && lessonId < familyId;
    const isCurrent = familyId !== undefined && lessonId === familyId;

    const partsDone = isPast ? PARTS_PER_LESSON : isCurrent ? (progress?.partCompletion ?? 0) : 0;
    const matchingDone = partsDone >= 1;
    const recognitionDone = partsDone >= 3;
    const guessDone = partsDone >= PARTS_PER_LESSON;

    const navType = Navigation.dashboard;

    const goToAssessment = (path: string) => navigate(path);

    return (
        <div className={style.container}>
       
            <BackToNav navType={navType} onClick={() => navigate("/dashboard")}/>

            {!lesson ? (
                <div className={style.panel}>Lesson not found.</div>
            ) : (
                <>
                    <div className={clsx(style.panel, style.header)}>
                        <h1 className={style.header_letter}>{lesson.amharicName}</h1>
                        <div>
                            <h3 className={style.header_title}>
                                Lesson {lesson.id}: {lesson.englishName} family
                            </h3>
                            <span className={style.header_subtitle}>
                                Learn the seven forms of the {lesson.englishName} family
                            </span>
                        </div>
                    </div>

                    <div className={style.panel}>
                        <h2 className={style.section_title}>Learn the Letters</h2>
                        <div className={style.letters_grid}>
                            {lesson.letters.map((letter, index) => (
                                <LetterCard
                                    key={letter.char}
                                    char={letter.char}
                                    label={letter.label}
                                    onClick={() => {
                                        playSound(lesson.id, index + 1, letter.char)
                                        console.log(`clicked button with familyid: ${lesson.id}, position: ${index + 1}, char: ${letter.char}`);
                                    }
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div className={style.assessment_layout}>
                        <AssessmentCard
                            title="Matching"
                            description="Match the characters to their labels"
                            completed={matchingDone}
                            onStart={() => goToAssessment(`/lesson/${lesson.id}/matching`)}
                        />
                        <AssessmentCard
                            title="Recognition"
                            description="Multiple choice style assessment. Consists of two parts."
                            completed={recognitionDone}
                            onStart={() => goToAssessment(`/lesson/${lesson.id}/recognition`)}
                            locked={!matchingDone}
                            lockedText="Complete Matching first"
                        />
                        <AssessmentCard
                            title="Guess the Sound"
                            description="Hear the character, guess it right"
                            onStart={() => goToAssessment(`/lesson/${lesson.id}/guess`)}
                            completed={guessDone}
                            locked={!recognitionDone}
                            lockedText="Complete Recognition first"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
