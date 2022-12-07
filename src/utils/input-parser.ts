import path = require('path');
import fs = require('fs');

interface InputParserOptions {
    separator?: string;
    path?: string;
}

export default class InputParser {
    private separator: string;
    private filename: string;
    private path: string;
    public file: string;

    constructor(filename: string, options?: InputParserOptions) {
        this.filename = path.basename(filename);
        this.separator = options?.separator ?? '\r\n';
        this.path = options?.path ?? path.resolve('src/inputs');
        this.file = fs
            .readFileSync(path.join(this.path, `${this.filename}.txt`))
            .toString();
    }
    toArray(): string[] {
        return this.file.split(this.separator);
    }
    toRaw(): string {
        return this.file;
    }
}
