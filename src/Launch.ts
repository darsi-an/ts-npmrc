import { NpmrcCommandLineParser } from './cli/NpmrcCommandLineParser';
import * as colors from 'colors';
import { EOL } from 'os';
/**
 * General operations for the CLI engine.
 */
export class Launch {
    /**
     * This a simplified approach to launch the front end. I plan to make this fully pluggable
     */
    public static launch(): void {
        Launch._printStartUpBanner();

        const parser: NpmrcCommandLineParser = new NpmrcCommandLineParser();
        parser.execute().catch(console.error);
    }

    public static _printStartUpBanner(): void {
        console.log(colors.bold(`ts-npmrc: A simple tool for managing multiple .npmrc profiles`) + EOL);
    }
}
