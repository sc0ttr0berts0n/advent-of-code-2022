import InputParser from '../utils/input-parser';

interface ISurroundings {
    top: number[];
    bottom: number[];
    left: number[];
    right: number[];
}

interface ISurroundingsOptions {
    lookingOutward: boolean;
    ignoreSelf: boolean;
}

const parser = new InputParser('08');
const treemap = parser
    .toArray()
    .map((el) => el.split('').map((el) => Number(el)));

const getSurroundings = (
    x: number,
    y: number,
    options?: Partial<ISurroundingsOptions>
): ISurroundings => {
    const top = treemap.map((row) => row[x]).slice(0, y + 1);
    const bottom = treemap.map((row) => row[x]).slice(y);
    const left = treemap[y].slice(0, x + 1);
    const right = treemap[y].slice(x);

    const surr = { top, bottom, left, right };

    if (options?.ignoreSelf) {
        surr.top.splice(surr.top.length - 1);
        surr.left.splice(surr.left.length - 1);
        surr.right.splice(0, 1);
        surr.bottom.splice(0, 1);
    }

    if (options?.lookingOutward) {
        surr.top.reverse();
        surr.left.reverse();
    }

    return surr;
};

const isTreeVisibleFromEdge = (x: number, y: number) => {
    const _isMaximum = (tree: number, list: number[]) => {
        const onlyTree = list.length === 1;
        const max = Math.max(...list);
        const tallestTree = tree >= max;
        const onlyOneMax = list.filter((el) => el === max).length === 1;

        return onlyTree || (tallestTree && onlyOneMax);
    };

    return Object.values(getSurroundings(x, y)).some((dir: number[]) => {
        return _isMaximum(treemap[y][x], dir);
    });
};

const getVisibilityScore = (x: number, y: number) => {
    const _getScore = (view: number[]) => {
        const index = view.findIndex((el) => el >= treemap[y][x]);
        return index === -1 ? view.length : index + 1;
    };

    const surr = getSurroundings(x, y, {
        ignoreSelf: true,
        lookingOutward: true,
    });

    return Object.values(surr)
        .map(_getScore)
        .reduce((acc, el) => acc * el, 1);
};

const treesByIsVisibleFromEdge = new Uint8Array(
    treemap.length * treemap[0].length
)
    .fill(0)
    .map((_el, index) => {
        const lineLength = treemap[0].length;
        const y = Math.floor(index / lineLength);
        const x = index % lineLength;
        return isTreeVisibleFromEdge(x, y) ? 1 : 0;
    });

const treesByVisibilityScore = new Uint32Array(
    treemap.length * treemap[0].length
)
    .fill(0)
    .map((_el, index) => {
        const lineLength = treemap[0].length;
        const y = Math.floor(index / lineLength);
        const x = index % lineLength;
        return getVisibilityScore(x, y);
    });

const visibleTrees = treesByIsVisibleFromEdge.filter(Boolean).length;
const bestVisibilityScore = Math.max(...treesByVisibilityScore);

console.log(`\nTrees with visibility:\n${visibleTrees}`);
console.log(`\nBest visibility Score:\n${bestVisibilityScore}`);

debugger;
