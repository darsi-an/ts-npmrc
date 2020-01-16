import { CommandLineParser } from '@microsoft/ts-command-line';
import { FileSystem } from '@microsoft/node-core-library';
import * as path from 'path';
import { EOL } from 'os';
import { Utilities } from '../utilities/Utilities';
import { ProfileAction } from './actions/ProfileAction';
import { LinkAction } from './actions/LinkAction';
import { LinkManager } from '../logic/LinkManager';

export class NpmrcCommandLineParser extends CommandLineParser {
    private homeDir: string;
    private npmrc: string;
    private npmrcStore: string;

    public constructor() {
        super({
            toolFilename: 'ts-npmrc',
            toolDescription: '',
        });

        this.homeDir = Utilities.getHomeDirectory();
        this.npmrc = path.join(this.homeDir, '.npmrc');
        this.npmrcStore = path.join(this.homeDir, '.npmrcs');

        if (!FileSystem.exists(this.npmrcStore)) {
            this._makeStore();
        }
        this._populateActions();
    }

    private _makeStore(): void {
        const homeDirectory = Utilities.getHomeDirectory();
        const npmrcStoreFolder: string = path.join(homeDirectory, '.npmrcs');
        const defaultPath: string = path.join(npmrcStoreFolder, 'default');

        const npmrcPath = path.join(homeDirectory, '.npmrc');

        try {
            if (!FileSystem.exists(npmrcStoreFolder)) {
                console.log(
                    `npmrcStore folder does not exist. ` + `ts-npmrc will create a store to manage your profiles` + EOL,
                );

                console.log(`Creating npmrc-store at ${npmrcStoreFolder}`);
                Utilities.createFolderWithRetry(npmrcStoreFolder);
            }
        } catch (e) {
            throw new Error(`Error creating npmrc-store directory: ${e}`);
        }

        if (FileSystem.exists(npmrcPath)) {
            console.log('Making %s the default .npmrc file', npmrcPath);
            FileSystem.move({
                sourcePath: this.npmrc,
                destinationPath: defaultPath,
            });
        } else {
            FileSystem.writeFile(defaultPath, '');
        }
        console.log('Call link function on default');
        const linkManager: LinkManager = new LinkManager();
        linkManager.linkTargetProfile('default');
    }

    private _populateActions(): void {
        this.addAction(new ProfileAction());
        this.addAction(new LinkAction());
    }

    protected onDefineParameters(): void {
        // override
        // No parameters
    }

    protected onExecute(): Promise<void> {
        process.exitCode = 1;

        return this._wrapOnExecute()
            .catch((error: Error) => {
                console.log(error);
                process.exit(1);
                // this._reportErrorAndSetExitCode(error);
            })
            .then(() => {
                // If we make it here, everything went fine, so reset the exit code back to 0
                process.exitCode = 0;
            });
        // return super.onExecute();
    }

    private _wrapOnExecute(): Promise<void> {
        try {
            return super.onExecute().then(() => {
                // override
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
