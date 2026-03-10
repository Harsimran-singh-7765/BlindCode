export interface CompilerResponse {
    output: string;
    hasError: boolean;
    error?: string;
}

interface PistonResponse {
    run: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
        output: string;
    };
    compile?: {
        stdout: string;
        stderr: string;
        code: number;
    };
}

const LANGUAGE_CONFIG: Record<string, { language: string; version: string }> = {
    cpp: { language: "c++", version: "10.2.0" },
    python: { language: "python", version: "3.10.0" },
    javascript: { language: "javascript", version: "18.15.0" },
};

/**
 * Compile and execute code using the Piston API directly.
 * When a backend is available, swap this function body to call
 * your own API endpoint instead.
 */
export async function compileCode(code: string, language: string): Promise<CompilerResponse> {
    if (!code) {
        return { output: "", hasError: false };
    }

    if (!language) {
        return { output: "", hasError: true, error: "Language is required" };
    }

    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
        return { output: "", hasError: true, error: "Unsupported language" };
    }

    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [
                    {
                        name: language === "cpp" ? "main.cpp" : language === "python" ? "main.py" : "main.js",
                        content: code,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { output: "", hasError: true, error: `Compilation service unavailable: ${errorText}` };
        }

        const result: PistonResponse = await response.json();

        let output = "";
        let hasError = false;

        if (result.compile && result.compile.stderr) {
            output += result.compile.stderr;
            hasError = true;
        }

        if (result.run) {
            if (result.run.stderr) {
                output += result.run.stderr;
                hasError = true;
            }
            if (result.run.stdout) {
                output += result.run.stdout;
            }
            if (!output && result.run.output) {
                output = result.run.output;
            }
        }

        return { output: output || "(No output)", hasError };
    } catch (error) {
        return {
            output: "",
            hasError: true,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}
