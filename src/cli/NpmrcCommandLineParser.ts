import { CommandLineParser } from '@microsoft/ts-command-line';
import { FileSystem } from '@microsoft/node-core-library';
import * as path from 'path';
import { EOL } from 'os';
import { Utilities } from '../utilities/Utilities';
import { LinkAction } from './actions/LinkAction';
import { LinkManager } from '../logic/LinkManager';
import { CreateAction } from './actions/CreateAction';
import { DeleteAction } from './actions/DeleteAction';
import { ListAction } from './actions/ListAction';

export class NpmrcCommandLineParser extends CommandLineParser {
    private npmrc: string;
    private npmrcStore: string;

    public constructor() {
        super({
            toolFilename: 'ts-npmrc',
            toolDescription: '',
        });

        this.npmrc = Utilities.getUserConfigPath();
        this.npmrcStore = Utilities.getStorePath();

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
        const defaultPath: string = path.join(this.npmrcStore, 'default');

        try {
            if (!FileSystem.exists(this.npmrcStore)) {
                console.log(
                    `npmrcStore folder does not exist. ` + `ts-npmrc will create a store to manage your profiles` + EOL,
                );

                console.log(`Creating npmrc-store at ${this.npmrcStore}`);
                Utilities.createFolderWithRetry(this.npmrcStore);
            }
        } catch (e) {
            throw new Error(`Error creating npmrc-store directory: ${e}`);
        }

        if (FileSystem.exists(this.npmrc)) {
            console.log('ts-npmrc will make %s the default .npmrc file', this.npmrc);
            FileSystem.move({
                sourcePath: this.npmrc,
                destinationPath: defaultPath,
            });
        } else {
            FileSystem.writeFile(defaultPath, '');
        }
        const linkManager: LinkManager = new LinkManager();
        linkManager.linkTargetProfile('default');
    }

    private _populateActions(): void {
        this.addAction(new CreateAction());
        this.addAction(new DeleteAction());
        this.addAction(new ListAction());
        this.addAction(new LinkAction());
    }

    protected onDefineParameters(): void {
        // override
        // No parameters
    }

    protected onExecute(): Promise<void> {
        return super.onExecute();
    }
}
