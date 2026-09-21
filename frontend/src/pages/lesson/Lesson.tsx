import { useLocation, useNavigate, useParams } from "react-router";
import clsx from "clsx";
import letters from "../../lib/data/letters.json";
import style from "../../styles/lesson.module.css";

interface LetterCardProps {
    char: string;
    label: string;
}

function LetterCard({ char, label }: LetterCardProps) {
    return (
        <div className={style.letter_card}>
            <h3 className={style.letter_char}>{char}</h3>
            <span className={style.letter_label}>{label}</span>
            <button className={style.play_button}>Play</button>
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
    const AssessmentCardStyle = clsx(style.panel, locked && style.assessment_locked);

    return (
        <div className={AssessmentCardStyle}>
            <div className={style.assessment_header}>
                <h2 className={style.assessment_title}>{title}</h2>
                {completed && <span className={style.badge}>Completed</span>}
            </div>
            <p className={style.assessment_text}>{description}</p>
            {locked ? (
                <p className={style.assessment_text}>{lockedText}</p>
            ) : (
                <button className={style.start_button} onClick={onStart}>Start Assessment</button>
            )}
        </div>
    );
}

export default function Lesson() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const lesson = letters.find((item) => item.id === Number(id));
    const recognitionDone: boolean = location.state?.recognitionDone ?? false;

    return (
        <div className={style.container}>
            <button className={style.back_button} onClick={() => navigate("/dashboard")}>
                ⬅ Back to Dashboard
            </button>

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
                            {lesson.letters.map((letter) => (
                                <LetterCard key={letter.char} char={letter.char} label={letter.label} />
                            ))}
                        </div>
                    </div>
                    <div className={style.assessment_layout}>
                        <AssessmentCard
                            title="Matching"
                            description="Match the characters to their labels"
                            completed={recognitionDone}
                            onStart={() => navigate(`/lesson/${lesson.id}/matching`)}
                        />
                        <AssessmentCard
                            title="Recognition"
                            description="Multiple choice style assessment"
                            completed={recognitionDone}
                            locked={!recognitionDone}
                            lockedText="Complete previous assessment first"
                        />
                        <AssessmentCard 
                            title="Guess the Sound"
                            description="Hear the character, guess it right"
                            completed={recognitionDone}
                            locked={!recognitionDone}
                            lockedText="Complete previous assessment first"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
