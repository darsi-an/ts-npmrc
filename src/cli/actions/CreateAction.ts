import { CommandLineAction, CommandLineStringParameter } from '@microsoft/ts-command-line';
import { FileSystem } from '@microsoft/node-core-library';
import { Utilities } from '../../utilities/Utilities';
import * as path from 'path';

export class CreateAction extends CommandLineAction {
    // ~/.npmrcs/
    private npmrcStore: string;

    // command params
    private _profile!: CommandLineStringParameter;

    public constructor() {
        super({
            actionName: 'create',
            summary: 'Create action creates a new profile',
            documentation: 'Create action creates a new profile but does not automatically sym link profile ',
        });

        this.npmrcStore = path.join(Utilities.getHomeDirectory(), '.npmrcs');
    }

    protected onDefineParameters(): void {
        this._profile = this.defineStringParameter({
            parameterLongName: '--profile',
            parameterShortName: '-p',
            argumentName: 'PROFILE_NAME',
            description: 'Create a .npmrc profile',
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

        const profile = path.join(this.npmrcStore, name);
        if (Utilities.fileExists(profile)) {
            console.log('npmrc profile "%s", exists (%s/%s)', name, profile);
            return process.exit(1);
        }

        FileSystem.writeFile(profile, '');
        return Promise.resolve();
    }
}
