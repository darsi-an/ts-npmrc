// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystem } from '@microsoft/node-core-library';

export class Utilities {
    /**
     * Get the user's home directory. On windows this looks something like "C:\users\username\" and on UNIX
     * this looks something like "/usr/username/"
     */
    public static getHomeDirectory(): string {
        const unresolvedUserFolder: string | undefined =
            process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
        const dirError = "Unable to determine the current user's home directory";
        if (unresolvedUserFolder === undefined) {
            throw new Error(dirError);
        }
        const homeFolder: string = path.resolve(unresolvedUserFolder);
        if (!FileSystem.exists(homeFolder)) {
            throw new Error(dirError);
        }

        return homeFolder;
    }

    public static getStorePath(): string {
        const storeDirectory: string = process.env.NPMRC_STORE || path.join(this.getHomeDirectory(), '.npmrcs');
        return storeDirectory;
    }

    public static getUserConfigPath(): string {
        const userConfigPath: string = process.env.NPMRC || path.join(Utilities.getHomeDirectory(), '.npmrc');
        return userConfigPath;
    }

    /**
     * Node.js equivalent of performance.now().
     */
    public static getTimeInMs(): number {
        const [seconds, nanoseconds] = process.hrtime();
        return seconds * 1000 + nanoseconds / 1000000;
    }

    /**
     * Retries a function until a timeout is reached. The function is expected to throw if it failed and
     *  should be retried.
     */
    public static retryUntilTimeout<TResult>(
        fn: () => TResult,
        maxWaitTimeMs: number,
        getTimeoutError: (innerError: Error) => Error,
        fnName: string,
    ): TResult {
        const startTime: number = Utilities.getTimeInMs();
        let looped = false;

        let result: TResult;
        for (;;) {
            try {
                result = fn();
                break;
            } catch (e) {
                looped = true;
                const currentTime: number = Utilities.getTimeInMs();
                if (currentTime - startTime > maxWaitTimeMs) {
                    throw getTimeoutError(e);
                }
            }
        }

        if (looped) {
            const currentTime: number = Utilities.getTimeInMs();
            const totalSeconds: string = ((currentTime - startTime) / 1000.0).toFixed(2);
            // This logging statement isn't meaningful to the end-user. `fnName` should be updated
            // to something like `operationDescription`
            console.log(`${fnName}() stalled for ${totalSeconds} seconds`);
        }

        return result;
    }

    /**
     * Creates the specified folder by calling FileSystem.ensureFolder(), but using a
     * retry loop to recover from temporary locks that may be held by other processes.
     * If the folder already exists, no error occurs.
     */
    public static createFolderWithRetry(folderName: string): void {
        // Note: If a file exists with the same name, then we fall through and report an error.
        if (Utilities.directoryExists(folderName)) {
            return;
        }

        // We need to do a simple "FileSystem.ensureFolder(localModulesFolder)" here,
        // however if the folder we deleted above happened to contain any files,
        // then there seems to be some OS process (virus scanner?) that holds
        // a lock on the folder for a split second, which causes mkdirSync to
        // fail.  To workaround that, retry for up to 7 seconds before giving up.
        const maxWaitTimeMs: number = 7 * 1000;

        return Utilities.retryUntilTimeout(
            () => FileSystem.ensureFolder(folderName),
            maxWaitTimeMs,
            e =>
                new Error(
                    `Error: ${e}${os.EOL}Often this is caused by a file lock ` +
                        'from a process such as your text editor, command prompt, ' +
                        'or "gulp serve"',
                ),
            'createFolderWithRetry',
        );
    }

    /**
     * Determines if the path points to a file and that it exists.
     */
    public static fileExists(filePath: string): boolean {
        let exists = false;

        try {
            const lstat: fs.Stats = FileSystem.getLinkStatistics(filePath);
            exists = lstat.isFile();
        } catch (e) {
            /* no-op */
        }

        return exists;
    }

    /**
     * Determines if a path points to a directory and that it exists.
     */
    public static directoryExists(directoryPath: string): boolean {
        let exists = false;

        try {
            const lstat: fs.Stats = FileSystem.getLinkStatistics(directoryPath);
            exists = lstat.isDirectory();
        } catch (e) {
            /* no-op */
        }

        return exists;
    }

    /**
     * Attempts to delete a file. If it does not exist, or the path is not a file, it no-ops.
     * @param filePath path to the file that should be deleted.
     */
    public static deleteFile(filePath: string): void {
        if (Utilities.fileExists(filePath)) {
            console.log(`Deleting: ${filePath}`);
            FileSystem.deleteFile(filePath);
        }
    }

    public static deleteFileObject(filePath: string): void {
        console.log(`Deleting: ${filePath}`);
        FileSystem.deleteFile(filePath);
    }
    /**
     * Follows linkPath to its destination and returns the absolute path to the final target of the link.
     * @param linkPath : The path to the link.
     */
    public static getActiveProfile(linkPath: string): string {
        let activeProfile!: string;
        try {
            activeProfile = fs.readlinkSync(linkPath);
        } catch (e) {
            if (e.code == 'ENOENT') {
                console.log('.npmrc (%s) does not exist. Link a profile using "ts-npmrc link"\n', linkPath);
                return '';
            }
        }
        if (!Utilities.fileExists(activeProfile)) {
            console.log(
                'Symlink is broken, npmrc profile (%s) does not exist. Link a profile using "ts-npmrc link"\n',
                activeProfile,
            );
            return '';
        }
        const lstat: fs.Stats = FileSystem.getLinkStatistics(linkPath);
        const storePath: string = this.getStorePath();
        if (!lstat.isSymbolicLink()) {
            console.log(
                'The .npmrc (%s) is active but not a symlink. You may want to copy into npmrcs (%s) and link profile using "ts-npmrc link".\n',
                linkPath,
                storePath,
            );
        }
        // const activeProfilePath: string = FileSystem.getRealPath(linkPath);
        return activeProfile;
    }

    /**
     * Reads contents of folder specified by path.
     * @param path The path to the folder which should be read.
     */
    public static getFileList(path: string): string[] {
        const fileList: string[] = FileSystem.readFolder(path);
        return fileList;
    }
}
