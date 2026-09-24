import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import clsx from "clsx";
import letters from "../../lib/data/letters.json";
import { RecognitionType } from "../../lib/constants/Lesson";
import type { Question } from "../../lib/constants/Lesson";
import { PASS_MARK, calculateScore, generateAssessment } from "../../lib/assessments/recognition";
import speakerImage from "../../assets/_.jpeg";
import style from "../../styles/assessments/guess.module.css";
import { playSound } from "../../lib/audio/generateAudio";
import * as helperLesson from "../../lib/assessments/lesson"
import { updateUserProgress } from "../../lib/api/assessment.api";
import { useAuth } from "../../lib/auth/useAuth";
import { BackToNav } from "../../lib/utils/navigation";
import { Navigation } from "../../lib/constants/Navigation";



export default function GuessTheSound() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();

    const lessonId = Number(id);
    const familyId = location.state?.familyId as number | undefined;
    const isCurrentLesson = familyId !== undefined && lessonId === familyId;

    const lessonExists = letters.some((item) => item.id === lessonId);

    const charToPosMap: Map<string, number> = helperLesson.generateCharToPositionMap(lessonId);

    const [questions, setQuestions] = useState<Question[]>(
        () => generateAssessment(lessonId, RecognitionType.labelToChar).questions
    );
    const [answers, setAnswers] = useState<string[]>([]);
    const [current, setCurrent] = useState(0);

    const startQuiz = () => {
        setQuestions(generateAssessment(lessonId, RecognitionType.labelToChar).questions);
        setAnswers([]);
        setCurrent(0);
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

    const score = calculateScore(questions, answers);
    const passed = score >= PASS_MARK;

    const navType = Navigation.lesson;


    useEffect(() => {
        if (passed && isCurrentLesson && currentUser) {
            updateUserProgress(currentUser.token).catch((err) => {
                console.error("Failed to record Guess the Sound completion:", err);
            });
        }
    }, [passed, isCurrentLesson, currentUser]);

    return (
        <div className={style.container}>

            <BackToNav navType={navType} onClick={() => navigate(`/lesson/${lessonId}`)}/>
            {lessonExists && <h2 className={style.stage_title}>Guess the Sound</h2>}

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

                    <p className={style.question_text}>Listen, then pick the character you heard</p>
                    <button 
                        className={style.sound_button} 
                        onClick={() => playSound(lessonId, charToPosMap.get(question.correctAnswer) ?? 1, question.correctAnswer)} 
                        aria-label="Play sound"
                    >
                        <img className={style.sound_image} src={speakerImage} alt="" />
                    </button>
                    <p className={style.sound_hint}>
                        {answered ? (
                            <>
                                That sound was <span className={style.sound_reveal}>{question.prompt}</span>
                            </>
                        ) : (
                            "Tap the speaker to listen"
                        )}
                    </p>

                    <div className={style.options}>
                        {question.options.map((option) => {
                            const optionStyle = clsx(
                                style.option,
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
                    <h2 className={style.instruction}>{passed ? "Great job!" : "Keep practicing"}</h2>
                    <p className={style.result}>
                        You got {score} of {questions.length} correct
                    </p>
                    <p className={style.result_hint}>
                        {passed ? "You passed this assessment." : `You need ${PASS_MARK} correct to pass.`}
                    </p>
                    <div className={style.actions}>
                        {passed ? (
                            <>
                                <button className={style.action_button} onClick={() => navigate(`/lesson/${lessonId}`)}>
                                    Back to Lesson
                                </button>
                                <button className={clsx(style.action_button, style.action_secondary)} onClick={startQuiz}>
                                    Start Over
                                </button>
                            </>
                        ) : (
                            <button className={style.action_button} onClick={startQuiz}>
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
