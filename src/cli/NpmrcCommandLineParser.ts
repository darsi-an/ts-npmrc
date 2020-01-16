import { CommandLineParser } from '@microsoft/ts-command-line';
import { FileSystem } from '@microsoft/node-core-library';
import * as path from 'path';
import {EOL} from 'os';
import { Utilities } from '../utilities/Utilities';
import { ProfileAction } from './actions/ProfileAction';
import { LinkAction } from './actions/LinkAction';
import { LinkManager } from '../logic/LinkManager';

export class NpmrcCommandLineParser extends CommandLineParser{
    
    private homeDir: string = Utilities.getHomeDirectory();
    private npmrc: string = path.join(this.homeDir, '.npmrc');
    private npmrcStore: string = path.join(this.homeDir, '.npmrcs');

    
    public constructor() {
        super({
            toolFilename: "ts-npmrc",
            toolDescription: ""
        });

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
            if (!FileSystem.exists(npmrcStoreFolder)){
                console.log(
                    EOL +
                    `npmrc-store folder does not exist. ` +
                    `ts-npmrc will create a store to manage your profiles` +
                    EOL
                    );
                    
                console.log(`Creating npmrc-store at ${npmrcStoreFolder}` );
                Utilities.createFolderWithRetry(npmrcStoreFolder);
            }
        } catch (e) {
            throw new Error(`Error creating npmrc-store directory: ${e}`);
        }

        if (FileSystem.exists(npmrcPath)) {
            console.log('Creating %s default npmrc', npmrcPath);
            FileSystem.move({
                sourcePath:this.npmrc,
                destinationPath: defaultPath,
            })
        } else {
            FileSystem.writeFile(defaultPath,'');
        }
        console.log('Call link function on default')
        const linkManager: LinkManager = new LinkManager();
        linkManager.linkTargetProfile('default');
        process.exit(0)   
    }

    private _populateActions(): void {
        this.addAction(new ProfileAction());
        this.addAction(new LinkAction());
    }

    protected onDefineParameters(): void {}

    protected onExecute(): Promise<void> {
        return super.onExecute();
    }
    
}