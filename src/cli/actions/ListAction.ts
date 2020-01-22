import { CommandLineAction } from '@microsoft/ts-command-line';
import { Utilities } from '../../utilities/Utilities';
import * as path from 'path';

export class ListAction extends CommandLineAction {
    // path to ~/.npmrc
    private npmrc: string = path.join(Utilities.getHomeDirectory(), '.npmrc');
    private npmrcStore: string = path.join(Utilities.getHomeDirectory(), '.npmrcs');

    public constructor() {
        super({
            actionName: 'list',
            documentation: 'Prints to stdout a list of stored .npmrc. Active profile will be specified.',
            summary: 'Lists all stored .npmrc profiles',
        });
    }
    protected onDefineParameters(): void {
        // override
    }

    protected onExecute(): Promise<void> {
        this.listProfiles();
        return Promise.resolve();
    }

    private listProfiles(): void {
        const activeProfile: string = path.basename(Utilities.getActiveProfile(this.npmrc)); // FileSystem.readFolder(this.npmrcStore);
        const profilesList: string[] = Utilities.getFileList(this.npmrcStore);
        console.log('Stored profiles: \n');
        if (profilesList.length == 0) {
            console.log('No stored .npmrc profile. You may want to create a profile using "ts-npmrc create"');
            return;
        }
        for (const filename of profilesList) {
            console.log(` %s %s`, `${filename}`, filename == activeProfile ? '(active)' : ' ');
        }
    }
}
