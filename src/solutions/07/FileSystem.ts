import { dir } from 'console';

enum CommandType {
    CD,
    LS,
}

enum EFileSystemElementType {
    FILE,
    DIRECTORY,
}

/**
 * @property {string} IDirectory.name local name of the directory
 * @property {string} IDirectory.path Absolute Path of the directory
 * @property {string[]} IDirectory.children list of Absolute Paths to children
 */
interface IDirectory {
    type: EFileSystemElementType.DIRECTORY;
    path: string;
    children: Array<IDirectory | IFile> | null;
}

interface IFile {
    type: EFileSystemElementType.FILE;
    path: string;
    size: number;
}

export class FileSystem {
    private _pwd: string[];
    private _nodes: Map<string, IDirectory | IFile> = new Map();
    private _workingState: string[];
    private readonly DISK_SPACE = 70_000_000;
    private readonly SPACE_REQUIRED_TO_UPDATE = 30_000_000;

    constructor(initialState: string[]) {
        this._workingState = initialState;
        this.processInitialState();
    }

    get freeSpace() {
        return this.DISK_SPACE - this.usedSpace;
    }

    get usedSpace() {
        return this.getDirContentsFileSize('/');
    }

    get additionalSpaceNeededToUpdate() {
        return Math.min(this.freeSpace - this.SPACE_REQUIRED_TO_UPDATE, 0);
    }

    get path() {
        return this._pwd.join('/');
    }

    get directories(): IDirectory[] {
        return Array.from(this._nodes.values()).filter(
            (node): node is IDirectory => {
                return node.type === EFileSystemElementType.DIRECTORY;
            }
        );
    }

    get smallestDirectoryToDeleteToAllowUpdate() {
        interface IDirFreespaceData {
            path: string;
            dir: IDirectory;
            size: number;
            freeSpaceIfDeleted: number;
        }

        const dirs: IDirFreespaceData[] = this.directories.map((dir) => {
            const size = this.getDirContentsFileSize(dir.path);
            return {
                path: dir.path,
                dir,
                size,
                freeSpaceIfDeleted: this.freeSpace + size,
            };
        });

        return dirs
            .sort((a, b) => a.freeSpaceIfDeleted - b.freeSpaceIfDeleted)
            .find(
                (el) => el.freeSpaceIfDeleted > this.SPACE_REQUIRED_TO_UPDATE
            );
    }

    processInitialState() {
        while (this._workingState.length) {
            const line = this._workingState.shift();
            const cmd = line.split(' ')[1];

            if (cmd === 'cd') {
                this.cd(line);
            }

            if (cmd === 'ls') {
                this.ls(this._workingState);
            }
        }
    }

    cd(line: string) {
        const param = line.split(' ')[2];
        // special case for cd /
        if (param === '/') return (this._pwd = ['/']);

        // special case for cd ..
        if (param === '..') return this._pwd.pop();

        // all other cases
        this._pwd.push(param);
    }

    ls(workingState: string[]): string[] {
        const range = workingState.findIndex((el) => el.charAt(0) === '$');
        const items = workingState.splice(0, range >= 0 ? range : Infinity);

        const dir: IDirectory = {
            type: EFileSystemElementType.DIRECTORY,
            path: this.path,
            children: [],
        };

        items.forEach((item) => {
            const tokens = item.split(' ');

            if (tokens[0] === 'dir') {
                // is directory
                const childDir: IDirectory = {
                    type: EFileSystemElementType.DIRECTORY,
                    path: `${this.path}/${tokens[1]}`,
                    children: null,
                };
                dir.children?.push(childDir);
            } else {
                // is file
                const file: IFile = {
                    type: EFileSystemElementType.FILE,
                    path: `${this.path}/${tokens[1]}`,
                    size: parseInt(tokens[0]),
                };
                dir.children.push(file);
                this._nodes.set(file.path, file);
            }
        });

        this._nodes.set(this.path, dir);

        return workingState;
    }

    getDirContentsFileSize(startDirString: string, bytesDiscovered = 0) {
        // recursively discover dirs in dirs in dirs
        const startDir = this._nodes.get(startDirString);

        if (startDir.type !== EFileSystemElementType.DIRECTORY) {
            throw Error(`Not a directory: ${startDirString}`);
        }

        const childFiles: IFile[] = [];

        const _getChildFiles = (start: IDirectory): void => {
            const _getChildrenOfType = <T extends IDirectory | IFile>(
                dir: IDirectory,
                type: EFileSystemElementType
            ) => {
                return (
                    dir.children?.filter((el): el is T => el.type === type) ??
                    []
                );
            };

            const dirs = _getChildrenOfType<IDirectory>(
                start,
                EFileSystemElementType.DIRECTORY
            );
            const files = _getChildrenOfType<IFile>(
                start,
                EFileSystemElementType.FILE
            );

            childFiles.push(...files);
            dirs.map((dir) => this._nodes.get(dir.path)).forEach(
                _getChildFiles
            );
        };

        _getChildFiles(startDir);

        return childFiles.reduce((acc, el) => acc + el.size, 0);
    }

    getTotalSizeOfDirsWithSizeSizeUnder(bytes: number) {
        const dirsToCheck = Array.from(this._nodes.values()).filter(
            (el): el is IDirectory => {
                return el.type === EFileSystemElementType.DIRECTORY;
            }
        );

        const validDirs = dirsToCheck.filter((dir) => {
            return this.getDirContentsFileSize(dir.path) < bytes;
        });

        return validDirs.reduce(
            (acc, el) => acc + this.getDirContentsFileSize(el.path),
            0
        );
    }
}
