import InputParser from '../utils/input-parser';

const parser = new InputParser('02');
const games = parser.toArray();

const scores: number[] = games.map((str) => {
    if (str === 'A X') return 3 + 0;
    if (str === 'A Y') return 1 + 3;
    if (str === 'A Z') return 2 + 6;

    if (str === 'B X') return 1 + 0;
    if (str === 'B Y') return 2 + 3;
    if (str === 'B Z') return 3 + 6;

    if (str === 'C X') return 2 + 0;
    if (str === 'C Y') return 3 + 3;
    if (str === 'C Z') return 1 + 6;
});

const tally = scores.reduce((acc, el) => acc + el, 0);

console.log(tally);

debugger;
