import { CommandLineAction, CommandLineStringParameter } from '@microsoft/ts-command-line';
import { Utilities } from '../../utilities/Utilities';
import * as path from 'path';

export class DeleteAction extends CommandLineAction {
    private _profile!: CommandLineStringParameter;

    public constructor() {
        super({
            actionName: 'delete',
            documentation: 'Delete a stored profile',
            summary: 'Deletes a stored profile ',
        });
    }

    protected onDefineParameters(): void {
        this._profile = this.defineStringParameter({
            parameterLongName: '--profile',
            parameterShortName: '-p',
            argumentName: 'PROFILE_NAME',
            description: 'Deletes the specified profile if it exists',
        });
    }

    protected onExecute(): Promise<void> {
        if (this._profile.value) {
            console.log('Attempting to delete profile %s', this._profile.value);
            this.deleteProfile(this._profile.value);
        }

        return Promise.resolve();
    }

    private deleteProfile(name: string): Promise<void> {
        if (!name) {
            console.log('Specify profile name that you want to delete');
            process.exit(1);
        }
        const npmrcStore = Utilities.getStorePath();
        const profilePath = path.join(npmrcStore, name);
        const npmrc = Utilities.getUserConfigPath();
        const activeProfile: string = Utilities.getActiveProfile(npmrc); // path.basename(Utilities.getActiveProfile(npmrc));
        if (Utilities.fileExists(profilePath)) {
            if (activeProfile === profilePath) {
                console.log(`The profile being deleted is currently active. Removing symlink to ${name}.\n`);
                Utilities.deleteFileObject(npmrc);
                console.log(`You need to link a .npmrc profile using "ts-npmrc link".\n`);
            }
            Utilities.deleteFile(profilePath);
        } else {
            console.log('No profile named "%s" exists', name);
        }

        return Promise.resolve();
    }
}
