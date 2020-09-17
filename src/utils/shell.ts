import * as shelljs from "shelljs";
export interface ShellResult {
    readonly code: number;
    readonly stdout: string;
    readonly stderr: string;
}
export const exec = (cmd: string, silent: boolean): Promise<ShellResult> =>
    new Promise<ShellResult>((resolve) => {
        shelljs.config.silent = silent;
        shelljs.exec(cmd, {}, (code: number, stdout: string, stderr: string) =>
            resolve({ code, stdout, stderr })
        );
    });