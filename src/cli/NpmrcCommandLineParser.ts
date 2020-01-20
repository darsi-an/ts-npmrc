import { CommandLineParser } from '@microsoft/ts-command-line';
import { FileSystem } from '@microsoft/node-core-library';
import * as path from 'path';
import { EOL } from 'os';
import { Utilities } from '../utilities/Utilities';
import { ProfileAction } from './actions/ProfileAction';
import { LinkAction } from './actions/LinkAction';
import { LinkManager } from '../logic/LinkManager';
import { CreateAction } from './actions/CreateAction';
import { DeleteAction } from './actions/DeleteAction';
import { SyncAction } from './actions/SyncAction';
import { ListAction } from './actions/ListAction';

export class NpmrcCommandLineParser extends CommandLineParser {
    private npmrc: string = path.join(Utilities.getHomeDirectory(), '.npmrc');
    private npmrcStore: string = path.join(Utilities.getHomeDirectory(), '.npmrcs');

    public constructor() {
        super({
            toolFilename: 'ts-npmrc',
            toolDescription: '',
        });

        if (!FileSystem.exists(this.npmrcStore)) {
            this._makeStore();
        }
        if (Utilities.fileExists(this.npmrc) && Utilities.directoryExists(this.npmrcStore)) {
            console.log(
                'Current .npmrc file (%s) is not a symlink. You may want to copy it into %s.',
                this.npmrc,
                this.npmrcStore,
            );
        }

        this._populateActions();
    }

    /**
     * Creates '.npmrcs' directory at a users home directory if it doesn't exist
     */
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
        this.addAction(new CreateAction());
        this.addAction(new DeleteAction());
        this.addAction(new ListAction());
        this.addAction(new ProfileAction());
        this.addAction(new LinkAction());
        // this.addAction(new SyncAction());
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
