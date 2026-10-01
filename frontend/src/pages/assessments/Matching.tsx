import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import letters from "../../lib/data/letters.json";
import type { Lesson } from "../../lib/constants/Lesson";
import style from "../../styles/assessments/matching.module.css";
import * as helperLesson from "../../lib/utils/assessments/lesson"
import { updateUserProgress } from "../../lib/api/assessment.api";
import { useLessonGuard } from "../../lib/context/progress/useLessonGuard";
import { useProgress } from "../../lib/context/progress/useProgress";
import { BackToNav } from "../../lib/utils/navigation";
import { Navigation } from "../../lib/constants/Navigation";


const shuffle = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

export default function Matching() {
    const { id } = useParams();
    const navigate = useNavigate();

    const lessonId = Number(id);
    const { currentUser, progress, isReady } = useLessonGuard(lessonId);
    const { refreshProgress } = useProgress();

    const familyId = progress?.familyId;
    const isCurrentLesson = familyId !== undefined && lessonId === familyId;

    const lesson: Lesson | undefined = letters.find((item) => item.id === lessonId);
    const getShuffledChars = () => shuffle(helperLesson.generateCharArray(lesson));
    const getShuffledLabels = () => shuffle(helperLesson.generateLabelArray(lesson));

    const [shuffledChars, setShuffledChars] = useState(getShuffledChars);
    const [shuffledLabels, setShuffledLabels] = useState(getShuffledLabels);
    const [selectedChar, setSelectedChar] = useState<string | null>(null);
    const [pairs, setPairs] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);


    const entering = true;

    const enterStyle = (order: number) => (entering ? { animationDelay: `${order * 0.1}s` } : undefined);

    const total = lesson?.letters.length ?? 0;
    const allPaired = Object.keys(pairs).length === total;
    const score = lesson?.letters.filter((letter) => pairs[letter.char] === letter.label).length ?? 0;

    const passed = score === total;
    const navType = Navigation.lesson;

    const truePairs: Record<string, string> = useMemo(
        () => Object.fromEntries(lesson?.letters.map((letter) => [letter.char, letter.label]) ?? []),
        [lesson]
    );


    const pickChar = (char: string) => {
        if (submitted) return;
        setPairs((prev) => Object.fromEntries(Object.entries(prev).filter(([paired]) => paired !== char)));
        setSelectedChar(selectedChar === char ? null : char);
    };

    const pickLabel = (label: string) => {
        if (submitted || !selectedChar) return;
        setPairs((prev) => {
            const withoutLabel = Object.fromEntries(Object.entries(prev).filter(([, taken]) => taken !== label));
            return { ...withoutLabel, [selectedChar]: label };
        });
        setSelectedChar(null);
    };

    const retry = () => {
        setPairs({});
        setSelectedChar(null);
        setSubmitted(false);
        setShuffledChars(getShuffledChars());
        setShuffledLabels(getShuffledLabels());
    };

    const submit = () => {
        setSubmitted(true);

        if (passed && isCurrentLesson && currentUser) {
            updateUserProgress(currentUser.token)
                .then(() => refreshProgress())
                .catch((err) => {
                    console.error("Failed to record Matching completion:", err);
                });
        }
    };

    if (!isReady) {
        return <div className={style.container}><p>Loading...</p></div>;
    }

    return (
        <div className={style.container}>

            <BackToNav navType={navType} onClick={() => navigate(`/lesson/${lessonId}`)}/>
            {!lesson ? (
                <div className={style.panel}>Lesson not found.</div>
            ) : (
                <div className={style.panel}>
                    <h2 className={style.instruction}>Match each character to its label</h2>

                    {/* character column */}
                    <div className={style.columns}>
                        <div className={style.column}>
                            {shuffledChars.map((char, index) => {
                                const paired = pairs[char];
                                const charStyle = clsx(
                                    style.option,
                                    entering && style.option_enter,
                                    selectedChar === char && style.option_selected,
                                    paired && !submitted && style.option_paired,
                                    submitted && (paired === truePairs[char] ? style.option_correct : style.option_incorrect)
                                );
                                return (
                                    <button
                                        key={char}
                                        className={charStyle}
                                        style={enterStyle(index * 2)}
                                        disabled={submitted}
                                        onClick={() => pickChar(char)}
                                    >
                                        <span className={style.option_char}>{char}</span>
                                        {paired && <span className={style.pair_tag}>{paired}</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* english label column */}
                        <div className={style.column}>
                            {shuffledLabels.map((label, index) => {
                                const pairedChar = Object.keys(pairs).find((char) => pairs[char] === label);
                                const labelStyle = clsx(
                                    style.option,
                                    entering && style.option_enter,
                                    pairedChar && style.option_paired
                                );
                                return (
                                    <button
                                        key={label}
                                        className={labelStyle}
                                        style={enterStyle(index * 2 + 1)}
                                        disabled={submitted || !selectedChar}
                                        onClick={() => pickLabel(label)}
                                    >
                                        <span>{label}</span>
                                        {pairedChar && <span className={style.pair_tag}>{pairedChar}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={style.footer}>
                        {submitted && (
                            <p className={style.result}>
                                You matched {score} of {total} correctly
                            </p>
                        )}
                        <div className={style.actions}>
                            <button
                                className={style.submit_button}
                                disabled={!submitted && !allPaired}
                                onClick={submitted ? retry : submit}
                            >
                                {submitted ? "Try Again" : "Submit"}
                            </button>
                            {submitted && passed && (
                                <button
                                    className={style.continue_button}
                                    onClick={() => navigate(`/lesson/${lessonId}/recognition`)}
                                >
                                    Start Recognition
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
