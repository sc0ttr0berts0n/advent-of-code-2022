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
const games: number[] = raw.map((line) => {
    const [them, outcome] = line.split(' ');

    const learnHowToWin = (letter: string) => {
        if (letter === 'A') return 'paper';
        if (letter === 'B') return 'scissors';
        return 'rock';
    };

    const learnHowToTie = (letter: string) => {
        if (letter === 'A') return 'rock';
        if (letter === 'B') return 'paper';
        return 'scissors';
    };

    const learnHowToLose = (letter: string) => {
        if (letter === 'A') return 'scissors';
        if (letter === 'B') return 'rock';
        return 'paper';
    };

    const getDesiredOutcome = (letter: string, outcome: string) => {
        // x = lose; y = draw; z = win
        if (outcome === 'X') return learnHowToLose(letter);
        if (outcome === 'Y') return learnHowToTie(letter);
        return learnHowToWin(letter);
    };

    const getChoicePoints = (desiredOutcome: string) => {
        if (desiredOutcome === 'rock') return 1;
        if (desiredOutcome === 'paper') return 2;
        return 3;
    };

    const getOutcomePoints = (outcome: string) => {
        if (outcome === 'X') return 0;
        if (outcome === 'Y') return 3;
        return 6;
    };

    return (
        getChoicePoints(getDesiredOutcome(them, outcome)) +
        getOutcomePoints(outcome)
    );
});

const tally = games.reduce((acc, el) => acc + el, 0);

console.log(tally);

debugger;
