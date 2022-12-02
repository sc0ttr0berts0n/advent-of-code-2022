import InputParser from '../utils/input-parser';

enum EOutcome {
    WIN = 6,
    LOSE = 0,
    DRAW = 3,
}

enum EChoice {
    ROCK = 1,
    PAPER,
    SCISSORS,
}

const parser = new InputParser('02');
const raw = parser.toArray();
const games: Array<[EChoice, EOutcome]> = raw.map((str) => {
    const [them, you] = str.split(' ');
    const outcome = (them: string, you: string) => {
        if (
            (them === 'A' && you === 'Y') ||
            (them === 'B' && you === 'Z') ||
            (them === 'C' && you === 'X')
        ) {
            return EOutcome.WIN;
        } else if (
            (them === 'A' && you === 'Z') ||
            (them === 'B' && you === 'X') ||
            (them === 'C' && you === 'Y')
        ) {
            return EOutcome.LOSE;
        } else {
            return EOutcome.DRAW;
        }
    };
    const choice = (you: string) => {
        if (you === 'X') return EChoice.ROCK;
        if (you === 'Y') return EChoice.PAPER;
        return EChoice.SCISSORS;
    };

    return [choice(you), outcome(them, you)];
});

const tally = games.flat().reduce((acc, el) => acc + el, 0);

console.log(tally);

debugger;
