import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import letters from "../../lib/data/letters.json";
import { RecognitionType } from "../../lib/constants/Lesson";
import type { Question } from "../../lib/constants/Lesson";
import { PASS_MARK, calculateScore, generateRecognitionAssessment } from "../../lib/assessments/recognition";
import style from "../../styles/assessments/recognition.module.css";

export default function Recognition() {
    const { id } = useParams();
    const navigate = useNavigate();

    const lessonId = Number(id);
    const lesson = letters.find((item) => item.id === lessonId);
    const lessonExists = lesson !== undefined;

    const [type, setType] = useState<RecognitionType>(RecognitionType.charToLabel);
    const [questions, setQuestions] = useState<Question[]>(
        () => generateRecognitionAssessment(lessonId, RecognitionType.charToLabel).questions
    );
    const [answers, setAnswers] = useState<string[]>([]);
    const [current, setCurrent] = useState(0);

    const startQuiz = (chosen: RecognitionType) => {
        setType(chosen);
        setQuestions(generateRecognitionAssessment(lessonId, chosen).questions);
        setAnswers([]);
        setCurrent(0);
    };

    const chooseOption = (option: string) => {
        if (answers[current] !== undefined) return;
        setAnswers((prev) => {
            const next = [...prev];
            console.log('next has', next);
            next[current] = option;
            console.log('now next has', next);
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

    const resultTitle = completedAll ? "Assessment complete!" : passed ? "Great job!" : "Keep practicing";
    const resultHint = completedAll
        ? "You passed both quizzes."
        : passed
            ? "You passed Character to Label. Next up: Label to Character."
            : `You need ${PASS_MARK} correct to pass.`;

    return (
        <div className={style.container}>
            <button className={style.back_button} onClick={() => navigate("/dashboard")}>
                ⬅ Back to Dashboard
            </button>

            {lessonExists && (
                <h2 className={style.stage_title}>
                    Part {stage}: From <span className={style.stage_sample}>{sampleText}</span>
                </h2>
            )}

            {!lessonExists ? (
                <div className={style.panel}>Lesson not found.</div>
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
                                <button className={style.action_button} onClick={() => navigate(`/lesson/${lessonId}`)}>
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
