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
        const nodeVersion: string = process.versions.node;
        console.log(
            EOL +
            colors.bold(`ts-npmrc: A simple tool for managing multiple .npmrcs`) +
            EOL +
            `Node js version is ${nodeVersion}` +
            EOL
        );
    }
}