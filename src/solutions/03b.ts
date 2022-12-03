import InputParser from '../utils/input-parser';

const parser = new InputParser('03');
const backpacks = parser.toArray();

const size = 3;
const groups = Array.from(
    { length: Math.ceil(backpacks.length / size) },
    (_v, i) => {
        return backpacks.slice(i * size, i * size + size);
    }
);

const getCommonElement = (group: string[]) => {
    group = group.sort((a, b) => a.length - b.length);
    return group[0]
        .split('')
        .find((el: string) => group[1].includes(el) && group[2].includes(el));
};

const getLetterScore = (letter: string) => {
    const code = letter.charCodeAt(0);

    if (code >= 97) {
        return code - 96;
    } else {
        return code - 38;
    }
};

const badgeLetters = groups.map(getCommonElement);

const tally: number = badgeLetters.reduce(
    (acc, el) => acc + getLetterScore(el),
    0
);

console.log(tally);

debugger;
