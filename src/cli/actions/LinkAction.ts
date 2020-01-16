import { CommandLineAction, CommandLineStringParameter} from '@microsoft/ts-command-line';
import { LinkManager } from '../../logic/LinkManager';

export class LinkAction extends CommandLineAction {
    private _link!: CommandLineStringParameter
    
    public constructor() {
        super({
            actionName: 'link',
            documentation: 'Used to create symlink to userconfig .npmrc',
            summary: 'Create symlink for specified profile'
        })
    }

    protected onDefineParameters(): void {
        this._link = this.defineStringParameter({
            parameterLongName: '--profile',
            parameterShortName: '-p',
            argumentName: 'PROFILE_NAME',
            description: 'Create symlink for specified profile'
        })
    }    
    
    protected onExecute(): Promise<void> {
        console.log('ts-npmrc link is executing');
        if (!this._link.value) {
            console.log('Specify a profile to symlink');
            process.exit(1);
        }
        if (this._link.value) {
            console.log(' Initializing link action ');
        }
        
        const linkManager: LinkManager = new LinkManager();
        return linkManager.linkTargetProfile(this._link.value);

    }
}