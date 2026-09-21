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