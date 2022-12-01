import InputParser from '../utils/input-parser';

const parser = new InputParser('01');
const depths = parser.toArray().map((str) => parseInt(str));

// process groups of cals into totals per elf
const elves: number[] = [];
let cals: number = 0;

for (let i = 0; i < depths.length; i++) {
    const el = depths[i];
    if (isNaN(el)) {
        elves.push(cals);
        cals = 0;
    } else {
        cals = cals + el;
    }
}

// big elf to small elf sort
elves.sort((a, b) => {
    return b - a;
});

// find max for solution A
const max = Math.max(...elves);

// find sum of top 3 for solution B
const topThree = elves.slice(0, 3).reduce((acc, el) => acc + el, 0);

// log it out
console.log({ max });
console.log({ topThree });
