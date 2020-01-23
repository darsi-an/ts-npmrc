import { CommandLineAction, CommandLineStringParameter } from '@microsoft/ts-command-line';
import { FileSystem } from '@microsoft/node-core-library';
import { Utilities } from '../../utilities/Utilities';
import * as path from 'path';

export class CreateAction extends CommandLineAction {
    private _profile!: CommandLineStringParameter;

    public constructor() {
        super({
            actionName: 'create',
            summary: 'Create a new profile',
            documentation: 'Creates a new profile but does not automatically symlink profile ',
        });
    }

    protected onDefineParameters(): void {
        this._profile = this.defineStringParameter({
            parameterLongName: '--profile',
            parameterShortName: '-p',
            argumentName: 'PROFILE_NAME',
            description: 'Creates a new .npmrc file for specified profile',
        });
    }

    protected onExecute(): Promise<void> {
        if (this._profile.value) {
            console.log('Creating new profile for %s', this._profile.value);
            this.createProfile(this._profile.value);
        }
        return Promise.resolve();
    }

    private createProfile(name: string): Promise<void> {
        if (!name) {
            console.log('Specify a name for your new configuration profile');
            return process.exit(1);
        }
        const npmrcStore: string = Utilities.getStorePath();
        const profile = path.join(npmrcStore, name);
        if (Utilities.fileExists(profile)) {
            console.log('npmrc profile "%s" exists (%s), try another name.', name, profile);
            return process.exit(1);
        }

        FileSystem.writeFile(profile, '');
        return Promise.resolve();
    }
}
