import { execFile, ExecFileOptions, ExecException } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface CommandResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    systemError?: string;
    signal?: NodeJS.Signals;
    success: boolean;
}

export async function runCommand(
    command: string,
    args: string[] = [],
    options: ExecFileOptions = {},
): Promise<CommandResult> {

    const execOptions: ExecFileOptions = {
        encoding: "utf8",
        ...options,
    };

    try {
        const { stdout, stderr } =
            await execFileAsync(
                command,
                args,
                execOptions,
            );

        return {
            stdout: String(stdout).trim(),
            stderr: String(stderr).trim(),
            exitCode: 0,
            success: true,
        };
    }
    catch (error: unknown) {
        const err = error as ExecException & {
            stdout?: string;
            stderr?: string;
        };

        return {
            stdout: err.stdout?.trim() ?? "",
            stderr: err.stderr?.trim() ?? err.message,
            exitCode: typeof err.code === "number" ? err.code : -1,
            systemError: typeof err.code === "string" ? err.code : undefined,
            signal: err.signal,
            success: false,
        };
    }
}