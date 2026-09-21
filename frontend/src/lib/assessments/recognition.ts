// file for calculations regarding recognition calculations
import lettersData from "../data/letters.json";
import { RecognitionType } from "../constants/Lesson";
import type { CLPair, Question, QuestionsList, Lesson } from "../constants/Lesson";


export const OPTION_COUNT = 4;
export const PASS_MARK = 8;

const shuffle = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};


const createCorrectList = <T,>(lessonList: T[]): T[] => {
    const randomSet: Set<number> = new Set();
    const tempList: T[] = shuffle(lessonList);

    while (randomSet.size !== 3){
        const randNum: number = Math.floor(Math.random() * (7 - 1 + 1) + 1);
        const candidate: T = lessonList[randNum - 1];
        if (!randomSet.has(randNum) && candidate !== tempList[tempList.length - 1]){
            randomSet.add(randNum);
            tempList.push(candidate);
        }
    }
    return tempList;
};


export const generateAssessment = (id: number, type: RecognitionType): QuestionsList => {
    const lesson: Lesson | undefined = lettersData.find((ld) => ld.id === id);
    if (!lesson) return { questions: [] };

    const idChars: string[] = lesson.letters.map((letter) => letter.char);
    const idLabels: string[] = lesson.letters.map((letter) => letter.label);

    const charToLabel = type === RecognitionType.charToLabel;
    const answerPool: string[] = [...new Set(charToLabel ? idLabels : idChars)];

    const askedLetters: CLPair[] = createCorrectList(lesson.letters);

    const questions: Question[] = askedLetters.map((letter, index) => {
        const correctAnswer: string = charToLabel ? letter.label : letter.char;
        const wrongAnswers: string[] = shuffle(answerPool.filter((answer) => answer !== correctAnswer))
            .slice(0, OPTION_COUNT - 1);

        return {
            index,
            prompt: charToLabel ? letter.char : letter.label,
            correctAnswer,
            options: shuffle([correctAnswer, ...wrongAnswers]),
        };
    });

    return { questions };
}

export const calculateScore = (questions: Question[], answers: string[]): number =>
    questions.filter((question) => answers[question.index] === question.correctAnswer).length;
