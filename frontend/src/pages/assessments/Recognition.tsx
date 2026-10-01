import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import * as helperLesson from "../../lib/utils/assessments/lesson"
import { RecognitionType } from "../../lib/constants/Lesson";
import type { Question } from "../../lib/constants/Lesson";
import { PASS_MARK, calculateScore, generateAssessment } from "../../lib/utils/assessments/recognition";
import style from "../../styles/assessments/recognition.module.css";
import { updateUserProgress } from "../../lib/api/assessment.api";
import { useLessonGuard } from "../../lib/context/progress/useLessonGuard";
import { useProgress } from "../../lib/context/progress/useProgress";
import { BackToNav } from "../../lib/utils/navigation";
import { Navigation } from "../../lib/constants/Navigation";

export default function Recognition() {
    const { id } = useParams();
    const navigate = useNavigate();

    const lessonId = Number(id);
    const lesson = helperLesson.findLessonData(lessonId);
    const lessonExists = lesson !== undefined;

    const { currentUser, progress, isReady } = useLessonGuard(lessonId);
    const { refreshProgress } = useProgress();

    const familyId = progress?.familyId;
    const isCurrentLesson = familyId !== undefined && lessonId === familyId;
    // partCompletion === 2 means Part 1 (Character to Label) is already passed, but Part 2 isn't yet.
    const needsChoice = isCurrentLesson && progress?.partCompletion === 2;

    const [choiceMade, setChoiceMade] = useState(false);
    const showPicker = needsChoice && !choiceMade;

    const [type, setType] = useState<RecognitionType>(RecognitionType.charToLabel);
    const [questions, setQuestions] = useState<Question[]>(
        () => generateAssessment(lessonId, RecognitionType.charToLabel).questions
    );
    const [answers, setAnswers] = useState<string[]>([]);
    const [current, setCurrent] = useState(0);

    const startQuiz = (chosen: RecognitionType) => {
        setType(chosen);
        setQuestions(generateAssessment(lessonId, chosen).questions);
        setAnswers([]);
        setCurrent(0);
    };

    const choosePart = (chosen: RecognitionType) => {
        startQuiz(chosen);
        setChoiceMade(true);
    };

    const chooseOption = (option: string) => {
        if (answers[current] !== undefined) return;
        setAnswers((prev) => {
            const next = [...prev];
            next[current] = option;
            return next;
        });
    };

    const question: Question | undefined = questions[current];
    const answer: string | undefined = answers[current];
    const answered = answer !== undefined;
    const isLastQuestion = current === questions.length - 1;

    const charToLabel = type === RecognitionType.charToLabel;
    const stage = charToLabel ? 1 : 2;
    const sample = lesson?.letters[0];
    const sampleText = sample && (charToLabel ? `${sample.char} → ${sample.label}` : `${sample.label} → ${sample.char}`);
    const score = calculateScore(questions, answers);
    const passed = score >= PASS_MARK;
    const completedAll = passed && !charToLabel;

    const navType = Navigation.lesson;

    useEffect(() => {
        if (passed && isCurrentLesson && currentUser) {
            updateUserProgress(currentUser.token)
                .then(() => refreshProgress())
                .catch((err) => {
                    console.error("Failed to record Recognition completion:", err);
                });
        }
    }, [passed, isCurrentLesson, currentUser, refreshProgress]);

    const resultTitle = completedAll ? "Assessment complete!" : passed ? "Great job!" : "Keep practicing";
    const resultHint = completedAll
        ? "You passed both quizzes."
        : passed
            ? "You passed Character to Label. Next up: Label to Character."
            : `You need ${PASS_MARK} correct to pass.`;

    if (!isReady) {
        return (
            <div className={style.container}>
                <BackToNav navType={navType} onClick={() => navigate(`/lesson/${lessonId}`)}/>
                <div className={style.panel}><p>Loading...</p></div>
            </div>
        );
    }

    return (
        <div className={style.container}>
             <BackToNav navType={navType} onClick={() => navigate(`/lesson/${lessonId}`)}/>

            {lessonExists && !showPicker && (
                <h2 className={style.stage_title}>
                    Part {stage}: From <span className={style.stage_sample}>{sampleText}</span>
                </h2>
            )}

            {!lessonExists ? (
                <div className={style.panel}>Lesson not found.</div>
            ) : showPicker ? (
                <div className={style.panel}>
                    <h2 className={style.instruction}>Welcome back!</h2>
                    <p className={style.result_hint}>
                        You've already passed Part 1 (Character to Label). Retake it, or continue to Part 2.
                    </p>
                    <div className={style.actions}>
                        <button className={style.action_button} onClick={() => choosePart(RecognitionType.labelToChar)}>
                            Continue to Part 2
                        </button>
                        <button
                            className={clsx(style.action_button, style.action_secondary)}
                            onClick={() => choosePart(RecognitionType.charToLabel)}
                        >
                            Retake Part 1
                        </button>
                    </div>
                </div>
            ) : question ? (
                <div className={style.panel}>
                    <p className={style.progress_text}>
                        Question {current + 1} of {questions.length}
                    </p>
                    <div className={style.progress_track}>
                        <div
                            className={style.progress_fill}
                            style={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                        />
                    </div>

                    <p className={style.question_text}>
                        {charToLabel ? "What is the label for this character?" : "Which character matches this label?"}
                    </p>
                    <h1 className={style.prompt}>{question.prompt}</h1>

                    <div className={style.options}>
                        {question.options.map((option) => {
                            const optionStyle = clsx(
                                style.option,
                                !charToLabel && style.option_large,
                                answered && option === question.correctAnswer && style.option_correct,
                                answered && option === answer && option !== question.correctAnswer && style.option_incorrect
                            );
                            return (
                                <button
                                    key={option}
                                    className={optionStyle}
                                    disabled={answered}
                                    onClick={() => chooseOption(option)}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    <div className={style.footer}>
                        <button
                            className={style.action_button}
                            disabled={!answered}
                            onClick={() => setCurrent((prev) => prev + 1)}
                        >
                            {isLastQuestion ? "See Results" : "Next"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className={style.panel}>
                    <h2 className={style.instruction}>{resultTitle}</h2>
                    <p className={style.result}>
                        You got {score} of {questions.length} correct
                    </p>
                    <p className={style.result_hint}>{resultHint}</p>
                    <div className={style.actions}>
                        {passed && charToLabel && (
                            <button className={style.action_button} onClick={() => startQuiz(RecognitionType.labelToChar)}>
                                Continue
                            </button>
                        )}
                        {!passed && (
                            <button className={style.action_button} onClick={() => startQuiz(type)}>
                                Try Again
                            </button>
                        )}
                        {completedAll && (
                            <>
                                <button
                                    className={style.action_button}
                                    onClick={() => navigate(`/lesson/${lessonId}/guess`)}
                                >
                                    Start Guess the Sound
                                </button>
                                <button
                                    className={clsx(style.action_button, style.action_secondary)}
                                    onClick={() => navigate(`/lesson/${lessonId}`)}
                                >
                                    Back to Lesson
                                </button>
                                <button
                                    className={clsx(style.action_button, style.action_secondary)}
                                    onClick={() => startQuiz(RecognitionType.charToLabel)}
                                >
                                    Start Over
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
