export type CLPair = {
    char: string;
    label: string;
};

export type Lesson = {
    id: number;
    englishName: string;
    amharicName: string;
    letters: CLPair[];
}


export type Question = {
    index: number;
    prompt: string;
    correctAnswer: string;
    options: string[];
};

export type QuestionsList = {
    questions: Question[];
};

export enum RecognitionType {
    charToLabel,
    labelToChar,
}
