import InputParser from '../utils/input-parser';

enum ECrateMoverModel {
    MODEL_9000,
    MODEL_9001,
}

const parser = new InputParser('05');
const lines = parser.toArray();

const rawState = lines.splice(0, lines.indexOf(''));

// build a map with each number, and an array of crates
const state: Map<number, string[]> = new Map();
const count = Math.max(...rawState.at(-1).split('').map(Number));
const height = rawState.length - 1;

for (let i = 0; i < count; i++) {
    // for each crate stack
    const stack: string[] = [];
    for (let j = height - 1; j >= 0; j--) {
        // go up until you hit 'air' (an empty string)
        const char = rawState[j].charAt(1 + i * 4);
        if (!char.match(/[A-Z]/i)) break;

        // otherwise, shove that shit on the stack
        stack.push(char);
    }
    // after you hit air or reach max height, log you result
    state.set(i + 1, stack);
}

/**
 * state debug visualizer
 */
const showMeState = () => {
    console.log('\n');
    state.forEach((value, key) => console.log(`${key}: ${value.join('|')}`));
};

showMeState();

/**
 * clear off the empty string at the top of the instruction set with slice
 * map the string statement into easily parsable variables => move, set, to
 */
const instructions = lines.slice(1).map((el) => {
    const [, move, from, to] = el.match(/(\d+).*(\d).*(\d)/).map(Number);
    return { move, from, to };
});

/**
 * moveCrates is the algorithm performer, takes a model number for fun.
 * @param {ECrateMoverModelenum} modelNumber  model number of cratemover (used for reverse check)
 */
const moveCrates = (modelNumber: ECrateMoverModel) => {
    for (let { move, from, to } of instructions) {
        // imports in the move, from, and to values

        // get an end and start stack for processing
        const end = state.get(to);
        const start = state.get(from);

        // yoink the crate count requested by move of the start stack
        const payload = start.splice(start.length - move, move);

        // place them (reversed if needed) onto the end stack
        end.push(
            ...(modelNumber === ECrateMoverModel.MODEL_9000
                ? payload.reverse()
                : payload)
        );
    }
};

// do the damn thing
moveCrates(ECrateMoverModel.MODEL_9001);

// check in on the state
showMeState();

// one liner to see the end result code for AoC
console.log(
    `\nResult:\n${Array.from(state.values())
        .map((el) => el.pop())
        .join('')}`
);
