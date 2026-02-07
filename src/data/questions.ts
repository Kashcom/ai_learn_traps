export interface Question {
    id: string;
    text: string;
    topic: string;
    options: { id: string; text: string; isCorrect?: boolean; isTrap?: boolean; feedback?: string }[];
    explanation: string;
}

export const questions: Question[] = [
    {
        id: 'q1',
        topic: 'cs',
        text: "In Python, what is the output of `print(3 * '3')`?",
        options: [
            { id: 'opt1', text: "9", isTrap: true, feedback: "Ah! The 'Trap of Type'. In Python, multiplying a string repeats it. It doesn't perform arithmetic." },
            { id: 'opt2', text: "'333'", isCorrect: true },
            { id: 'opt3', text: "Error", isTrap: false, feedback: "It's a valid operation in Python!" },
            { id: 'opt4', text: "33", isTrap: false }
        ],
        explanation: "Multiplying a string by an integer n repeats the string n times."
    },
    {
        id: 'q2',
        topic: 'science',
        text: "Which falls faster in a vacuum: a feather or a hammer?",
        options: [
            { id: 'opt1', text: "The Hammer", isTrap: true, feedback: "Caught by the 'Intuitive Physics Trap'. On Earth with air, yes. But in a vacuum, gravity acts equally on all mass." },
            { id: 'opt2', text: "They fall at the same rate", isCorrect: true },
            { id: 'opt3', text: "The Feather", isTrap: false },
        ],
        explanation: "In a vacuum, air resistance is absent, so gravity accelerates all objects at approximately 9.8 m/s² regardless of mass."
    },
    {
        id: 'q3',
        topic: 'math',
        text: "What is the result of 0.1 + 0.2 in JavaScript?",
        options: [
            { id: 'opt1', text: "0.3", isTrap: true, feedback: "The 'Floating Point Trap'! Computers use binary floating point, which cannot exactly represent 0.1. The result is slightly more than 0.3." },
            { id: 'opt2', text: "0.30000000000000004", isCorrect: true },
            { id: 'opt3', text: "0.12", isTrap: false },
        ],
        explanation: "Standard IEEE 754 floating point arithmetic causes 0.1 + 0.2 to result in 0.30000000000000004."
    },
    {
        id: 'q4',
        topic: 'history',
        text: "Did Napoleon shoot the nose off the Sphinx?",
        options: [
            { id: 'opt1', text: "Yes, with a cannon", isTrap: true, feedback: "A common myth! Drawings from before Napoleon's campaign show the nose was already missing." },
            { id: 'opt2', text: "No, it was already missing", isCorrect: true },
            { id: 'opt3', text: "No, it fell off due to erosion", isTrap: false, feedback: "Erosion played a part, but it was likely chiseled off centuries earlier." },
        ],
        explanation: "Sketches by Frederic Louis Norden in 1737 show the Sphinx without a nose, long before Napoleon arrived in Egypt in 1798."
    }
];
