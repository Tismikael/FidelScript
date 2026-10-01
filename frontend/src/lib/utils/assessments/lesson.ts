// file containing helper functions for lesson assessment
import type { Lesson } from "../../constants/Lesson";
import lettersData from "../../../lib/data/letters.json";

const findLessonData = (id: number): Lesson | undefined => {
    const lesson: Lesson | undefined = lettersData.find((ld) => ld.id === id);
    return lesson;
}

const generateCharArray = (lesson: Lesson | undefined): string[] => {
    return lesson?.letters.map((letter) => letter.char) ?? [];
};

const generateLabelArray = (lesson: Lesson | undefined): string[] => {
    return lesson?.letters.map((letter) => letter.label) ?? [];
};
const generateCharToPositionMap = (id: number): Map<string, number> => {

    const resMap: Map<string, number> = new Map();

    const lessonData: Lesson | undefined = findLessonData(id);

    const charArray: string[] = generateCharArray(lessonData);

    charArray.map((char, index) => {
        resMap.set(char, index + 1);
    })

    return resMap;
};

export {
    findLessonData,
    generateCharArray,
    generateLabelArray,
    generateCharToPositionMap,
}