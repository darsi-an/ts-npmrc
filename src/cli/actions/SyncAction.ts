import { CommandLineAction, CommandLineStringParameter } from '@microsoft/ts-command-line';

export class SyncAction extends CommandLineAction {
    private _profile!: CommandLineStringParameter;

    public constructor() {
        super({
            actionName: 'sync',
            documentation: '',
            summary: 'Sync a .npmrc profile to default',
        });
    }

    protected onDefineParameters(): void {
        this._profile = this.defineStringParameter({
            parameterLongName: '--profile',
            parameterShortName: '-p',
            description: '',
            argumentName: 'PROFILE_NAME',
        });
    }

    protected onExecute(): Promise<void> {
        if (this._profile.value) {
            this._syncProfile();
        }
        return Promise.resolve();
    }
    private _syncProfile(): Promise<void> {
        // sync profile to default
        // Note this will overwrite and create a symbolic link from default
        console.log('sync target profile to default and activate');
        return Promise.resolve();
    }
}
