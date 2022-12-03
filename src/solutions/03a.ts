import InputParser from '../utils/input-parser';

const parser = new InputParser('03');
const backpacks = parser.toArray();

const splitpacks = backpacks.map((el) => {
    const midpoint = el.length / 2;
    if (!Number.isInteger(midpoint)) debugger;
    const halfA = el.slice(0, midpoint);
    const halfB = el.slice(midpoint);

    return [halfA, halfB];
});

const getMatch = (backpack: string[]) => {
    const arrA = backpack[0].split('');
    const arrB = backpack[1].split('');
    return arrA.find((el) => arrB.includes(el));
};

const getLetterScore = (letter: string) => {
    const code = letter.charCodeAt(0);

    if (code >= 97) {
        return code - 96;
    } else {
        return code - 38;
    }
};

const matches = splitpacks.map(getMatch);

const scores = matches.map(getLetterScore);

const tally = scores.reduce((acc, el) => acc + el, 0);

console.log(tally);

debugger;
