import InputParser from '../../utils/input-parser';
import { FileSystem } from './FileSystem';

const parser = new InputParser('07');
const stdout = parser.toArray();

const fs = new FileSystem(stdout);

console.log(
    `\nSize of dirs under 100,000b:\n${fs.getTotalSizeOfDirsWithSizeSizeUnder(
        100_000
    )}`
);
console.log(
    `\nLeast bytes to delete to allow update:\n${fs.smallestDirectoryToDeleteToAllowUpdate.size}`
);

debugger;
