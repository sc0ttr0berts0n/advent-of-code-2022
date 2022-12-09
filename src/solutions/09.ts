import InputParser from '../utils/input-parser';

enum EDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

type Command = [EDirection, number];

interface Vec2 {
    x: number;
    y: number;
}

const parser = new InputParser('09');
const instructions = parser.toArray();

class SegmentWorld {
    private _debug = false;
    private _instructionSet: Command[];
    private _segments: Segment[] = [];
    private _tailLocations: Set<string> = new Set();

    constructor(instructions: string[]) {
        this._instructionSet = this._parseInstructions(instructions);
        this._addHead();
    }

    get head() {
        return this._segments.find((seg) => seg.isHead);
    }

    set debug(val: boolean) {
        this._debug = val;
    }

    /**
     * Break string instructions down to parseable commands
     * @param instructions new line split array of instructions
     * @returns
     */
    private _parseInstructions(instructions: string[]): Command[] {
        return instructions.map((command): Command => {
            const [dirString, number] = command.split(' ');
            const dirMap: { [key: string]: EDirection } = {
                R: EDirection.RIGHT,
                D: EDirection.DOWN,
                L: EDirection.LEFT,
                U: EDirection.UP,
            };
            return [dirMap[dirString], parseInt(number)];
        });
    }

    /**
     * Perform the commands in the instruction set
     */
    runInstructions() {
        this._instructionSet.forEach((cmd) => {
            // do mini steps to keep the tail close
            const [dir, amt] = cmd;
            for (let i = 0; i < amt; i++) {
                this._moveHead(dir);
                this._segments.slice(1).forEach((seg) => seg.followParent());
                this._tailLocations.add(
                    `x${this._segments.at(-1).pos.x},y${
                        this._segments.at(-1).pos.y
                    }`
                );
                if (this._debug) this._logPosList();
            }
        });
    }

    private _addHead() {
        this._segments.push(new Segment(null));
    }

    private _addSegment() {
        this._segments.push(new Segment(this._segments.at(-1)));
    }

    addSegments(count: number) {
        for (let i = 0; i < count; i++) {
            this._addSegment();
        }
    }

    private _moveHead(dir: EDirection) {
        if (dir === EDirection.UP) this.head.moveY(-1);
        if (dir === EDirection.DOWN) this.head.moveY(1);
        if (dir === EDirection.LEFT) this.head.moveX(-1);
        if (dir === EDirection.RIGHT) this.head.moveX(1);
    }

    get tailLocationCount() {
        return this._tailLocations.size;
    }

    private _logPosList() {
        console.log('\n');
        const xSet = this._segments.map((el) => el.pos.x);
        const ySet = this._segments.map((el) => el.pos.y);
        const xMin = Math.min(...xSet);
        const xMax = Math.max(...xSet);
        const yMin = Math.min(...ySet);
        const yMax = Math.max(...ySet);
        const grid = Array(Math.max(yMax - yMin + 1))
            .fill(0)
            .map((_el) => Array(Math.max(xMax - xMin + 1)).fill('.'));

        // place segments
        [...this._segments].reverse().forEach((el, index) => {
            const num = this._segments.length - index - 1;
            grid[el.pos.y - yMin][el.pos.x - xMin] =
                num === 0 ? 'H' : num.toLocaleString();
        });

        // print grid
        let output = '';
        for (const row of grid) {
            let line = '';
            for (const cell of row) {
                line = `${line}${cell}`;
            }
            output = `${output}\n${line}`;
        }
        console.log(output);
        this._segments.forEach((seg, index) =>
            console.log(
                `${index === 0 ? 'H' : index}: {x:${seg.pos.x}, y:${seg.pos.y}`
            )
        );
    }
}

class Segment {
    private _parent: null | Segment = null;
    private _pos: Vec2 = { x: undefined, y: undefined };
    constructor(parent: null | Segment) {
        this._parent = parent ?? null;
        this._pos = this._parent
            ? { x: this._parent.pos.x, y: this._parent.pos.y }
            : { x: 0, y: 0 };
    }

    get isHead() {
        return this._parent === null;
    }

    get pos() {
        return this._pos;
    }

    moveX(num: number) {
        // set pos
        this._pos.x += num;
    }

    moveY(num: number) {
        // set pos
        this._pos.y += num;
    }

    setPos(vec: Vec2) {
        this._pos.x = vec.x;
        this._pos.y = vec.y;
    }

    distanceToParent(): Vec2 {
        if (this.isHead) throw Error('No Parent, this is the head');
        const xDist = this.pos.x - this._parent.pos.x;
        const yDist = this.pos.y - this._parent.pos.y;
        return { x: xDist, y: yDist };
    }

    followParent() {
        if (this.isHead) throw Error('No Parent, this is the head');
        const dist = this.distanceToParent();
        const absDist = { x: Math.abs(dist.x), y: Math.abs(dist.y) };

        // Action is only needed if abs dist is greater than 1
        if (absDist.x <= 1 && absDist.y <= 1) return;

        // correct on the greater axis
        if (absDist.x > absDist.y) {
            // if x is greater
            const x = this._parent.pos.x + Math.sign(dist.x);
            const y = this._parent.pos.y;
            this.setPos({ x, y });
        } else if (absDist.x < absDist.y) {
            // if y is greater
            const x = this._parent.pos.x;
            const y = this._parent.pos.y + Math.sign(dist.y);
            this.setPos({ x, y });
        } else {
            // if both are the same, move diagonally
            const x = this._parent.pos.x + Math.sign(dist.x);
            const y = this._parent.pos.y + Math.sign(dist.y);
            this.setPos({ x, y });
        }
    }
}

// model segment world with head / tail only
const swht = new SegmentWorld(instructions);
swht.addSegments(1);
swht.runInstructions();
const countHT = swht.tailLocationCount;
console.log({ countHT });

// model segment world with ten segments
const sw10 = new SegmentWorld(instructions);
sw10.addSegments(9);
sw10.runInstructions();
const count10 = sw10.tailLocationCount;
console.log({ count10 });

debugger;
