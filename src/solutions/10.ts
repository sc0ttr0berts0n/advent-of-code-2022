import InputParser from '../utils/input-parser';

const parser = new InputParser('10');
const instructions = parser.toArray();

enum EInstructionType {
    ADD_X,
    NOOP,
}

interface IInstruction {
    type: EInstructionType;
    cycles: number;
    value: number | undefined;
}

class Computer {
    private _instructions: IInstruction[] = [];
    private _clock = 0;
    private _register = 1;
    private _registerRecords: number[] = [];
    private readonly SPRITE_SIZE = 3;
    private readonly CRT_LINE_LENGTH = 40;
    private _crt: boolean[] = [];

    constructor(rawInstructions: string[]) {
        this._instructions = this._parseInstructions(rawInstructions);
    }

    private _parseInstructions(rawLines: string[]): IInstruction[] {
        return rawLines.map((line): IInstruction => {
            const [cmd, value] = line.split(' ');

            if (cmd === 'addx') {
                return {
                    type: EInstructionType.ADD_X,
                    cycles: 2,
                    value: parseInt(value),
                };
            }
            if (cmd === 'noop') {
                return {
                    type: EInstructionType.NOOP,
                    cycles: 1,
                    value: undefined,
                };
            }
        });
    }

    runInstructions() {
        const _incrementClockAndRecordIfNeeded = () => {
            this._clock++;
            this._crt.push(this._pixelHit());
            if ((this._clock - 20) % this.CRT_LINE_LENGTH == 0) {
                this._recordRegister();
            }
        };
        this._instructions.forEach((cmd) => {
            _incrementClockAndRecordIfNeeded();
            if (cmd.type === EInstructionType.ADD_X) {
                _incrementClockAndRecordIfNeeded();
                this._addx(cmd.value);
            }
        });
    }

    private _recordRegister() {
        this._registerRecords.push(this._register);
    }

    scoreRegister() {
        return this._registerRecords
            .slice(0, 7)
            .map((val, index) => {
                const multiplier = Math.abs(index * this.CRT_LINE_LENGTH + 20);
                return val * multiplier;
            })
            .reduce((acc, el) => acc + el, 0);
    }

    private _addx(value: number) {
        this._register = this._register + value;
    }

    private _noop() {
        return;
    }

    private _pixelHit() {
        const pos = this._clock % this.CRT_LINE_LENGTH;
        const pxpos = this._register;
        const pxsize = this.SPRITE_SIZE;
        return pos >= pxpos && pos < pxpos + pxsize;
    }

    renderCrt() {
        return this._crt.reduce((output, el, index) => {
            const px = el ? '#' : '.';
            const crtlen = this.CRT_LINE_LENGTH;
            const newLine = (index + 1) % crtlen === 0 ? '\n' : '';
            return `${output}${px}${newLine}`;
        }, '');
    }
}

const comp = new Computer(instructions);
comp.runInstructions();
const result = comp.scoreRegister();
console.log({ result });

console.log(comp.renderCrt());

debugger;
