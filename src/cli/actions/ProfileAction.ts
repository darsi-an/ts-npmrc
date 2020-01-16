import { CommandLineAction, CommandLineFlagParameter, CommandLineStringParameter } from '@microsoft/ts-command-line';
import * as path from 'path';
import { FileSystem } from '@microsoft/node-core-library';
import { Utilities } from '../../utilities/Utilities';

export class ProfileAction extends CommandLineAction {
    private homeDir: string = Utilities.getHomeDirectory();
    private npmrcStore: string = path.join(this.homeDir, '.npmrcs');

    private _list!: CommandLineFlagParameter;
    private _init!: CommandLineStringParameter;
    private _delete!: CommandLineStringParameter;
    // private _sync !: CommandLineStringListParameter;

    public constructor() {
        super({
            actionName: 'profile',
            documentation: 'ts-npmrc profile action. List, Create, Delete',
            summary: 'Either create, delete or list npmrc profiles in store',
        });
    }

    protected onDefineParameters(): void {
        this._list = this.defineFlagParameter({
            parameterLongName: '--list',
            parameterShortName: '-l',
            description: 'List npmrc profiles',
        });
        this._init = this.defineStringParameter({
            argumentName: 'PROFILE_NAME',
            parameterLongName: '--init',
            parameterShortName: '-c',
            description: 'Create new profile',
        });
        this._delete = this.defineStringParameter({
            argumentName: 'PROFILE_NAME',
            parameterLongName: '--delete',
            parameterShortName: '-d',
            description: 'Delete existing profile',
        });
    }

    protected onExecute(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            if (this._list.value) {
                console.log('Retrieving existing profiles from npmrc-store');
                this.getProfiles();
            }

            if (this._init.value) {
                console.log('Creating new profile for %s', this._init.value);
                this.createProfile(this._init.value);
            }

            if (this._delete.value) {
                console.log('Deleting profile %s', this._delete.value);
                this.deleteProfile(this._delete.value);
            }
        });
    }

    private getProfiles(): Promise<void> {
        const profilesList: string[] = FileSystem.readFolder(this.npmrcStore);
        for (const filename of profilesList) {
            console.log(`${filename}`);
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
