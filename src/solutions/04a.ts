import InputParser from '../utils/input-parser';

const parser = new InputParser('04');
const sectors = parser.toArray();

const overlaps = sectors.filter((sector) => {
    const ranges = sector
        .split(',')
        .map((half) => half.split('-').map((el) => parseInt(el)));

    const [[lowA, highA], [lowB, highB]] = ranges;

    const testForOverlap = (
        lowA: number,
        highA: number,
        lowB: number,
        highB: number
    ) => {
        return lowA <= lowB && highA >= highB;
    };

    return (
        testForOverlap(lowA, highA, lowB, highB) ||
        testForOverlap(lowB, highB, lowA, highA)
    );
});

console.log(overlaps.length);

debugger;
