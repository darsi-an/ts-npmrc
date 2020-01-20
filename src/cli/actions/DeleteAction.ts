import { CommandLineAction, CommandLineStringParameter } from '@microsoft/ts-command-line';
import { Utilities } from '../../utilities/Utilities';
import * as path from 'path';

export class DeleteAction extends CommandLineAction {
    // private store params
    private npmrcStore!: string;

    private _profile!: CommandLineStringParameter;

    public constructor() {
        super({
            actionName: 'delete',
            documentation: '',
            summary: '',
        });

        this.npmrcStore = path.join(Utilities.getHomeDirectory(), '.npmrcs');
    }

    protected onDefineParameters(): void {
        this._profile = this.defineStringParameter({
            parameterLongName: '--delete',
            parameterShortName: '-d',
            argumentName: 'PROFILE_NAME',
            description: 'Delete existing profile',
        });
    }

    protected onExecute(): Promise<void> {
        if (this._profile.value) {
            console.log('Deleting profile %s', this._profile.value);
            this.deleteProfile(this._profile.value);
        }

        return Promise.resolve();
    }

    private deleteProfile(name: string): Promise<void> {
        if (!name) {
            console.log('Specify profile name that you want to delete');
            process.exit(1);
        }
        const profilePath = path.join(this.npmrcStore, name);
        if (Utilities.fileExists(profilePath)) {
            Utilities.deleteFile(profilePath);
        } else {
            console.log('No profile named "%s" exists', name);
        }

        return Promise.resolve();
    }
}
