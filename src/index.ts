#!/usr/bin/env node

import * as pty from 'node-pty';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn } from 'child_process';
import { Terminal } from '@xterm/headless';
import readline from 'readline';

// --- 1. CONFIGURATION & TYPE DEFINITIONS ---

const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.config', 'ai-cli-log');
const GLOBAL_CONFIG_PATH = path.join(GLOBAL_CONFIG_DIR, 'config.json');
const LOCAL_CONFIG_PATH = path.join(process.cwd(), '.ai-cli-log', 'config.json');

interface Summarizer {
    name: string;
    tool: 'gemini' | 'ollama' | 'claude' | 'custom';
    model?: string;
    prompt: string;
    maxLines?: number;
    command?: string[]; // For custom tools, e.g., ["sgpt", "--prompt", "{{prompt}}"]
}

interface AppConfig {
    summarizer: {
        default?: string;
        summarizers: Summarizer[];
    };
}

function findConfigPath(): string | null {
    if (fs.existsSync(LOCAL_CONFIG_PATH)) return LOCAL_CONFIG_PATH;
    if (fs.existsSync(GLOBAL_CONFIG_PATH)) return GLOBAL_CONFIG_PATH;
    return null;
}

function readConfig(): AppConfig {
    const configPath = findConfigPath();
    if (!configPath) return { summarizer: { summarizers: [] } };
    try {
        const content = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(content) as AppConfig;
    } catch (error) {
        console.error(`Error reading or parsing config file at ${configPath}:`, error);
        return { summarizer: { summarizers: [] } };
    }
}

function writeConfig(config: AppConfig, isLocal: boolean) {
    const targetPath = isLocal ? LOCAL_CONFIG_PATH : GLOBAL_CONFIG_PATH;
    const targetDir = path.dirname(targetPath);
    try {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(targetPath, JSON.stringify(config, null, 2));
        console.log(`✔ Configuration successfully saved to ${targetPath}`);
    } catch (error) {
        console.error(`Error writing config file to ${targetPath}:`, error);
    }
}

// --- 2. COMMAND IMPLEMENTATIONS ---

async function handleInitCommand(isLocal: boolean) {
    const targetPath = isLocal ? LOCAL_CONFIG_PATH : GLOBAL_CONFIG_PATH;
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (question: string) => new Promise<string>(resolve => rl.question(question, resolve));

    try {
        if (fs.existsSync(targetPath)) {
            const warning = `Configuration file already exists. Continuing will allow you to add or update default summarizers (gemini-pro, ollama, sgpt) with the latest recommended settings, while preserving any other custom summarizers you have added.`;
            console.log(warning);
            const answer = await ask('Do you want to continue? (y/N): ');
            if (answer.toLowerCase() !== 'y') {
                console.log('Initialization cancelled.');
                return;
            }
        }

        console.log('\nScanning for available AI tools...');
        const availableTools: ('gemini' | 'ollama' | 'sgpt')[] = [];
        const checkTool = (tool: 'gemini' | 'ollama' | 'sgpt') => new Promise<void>(resolve => {
            const proc = spawn('which', [tool], { stdio: 'ignore' });
            proc.on('close', code => {
                if (code === 0) {
                    console.log(`  - Found ${tool}!`);
                    availableTools.push(tool);
                }
                resolve();
            });
            proc.on('error', () => resolve());
        });

        await Promise.all([checkTool('gemini'), checkTool('ollama'), checkTool('sgpt')]);

        if (availableTools.length === 0) {
            console.log('No supported AI tools (gemini, ollama, sgpt) found in your PATH.');
            return;
        }

        const config = readConfig();
        const summarizersToUpdate: Summarizer[] = [];
        const newPrompt = 'CRITICAL: Your response MUST be ONLY a 3-5 word, lowercase, filename-friendly phrase summarizing the user\'s actions in the following terminal session. DO NOT include any other words, explanations, or introductory phrases. Examples of valid responses: "refactor-database-schema", "fix-login-bug", "install-new-dependencies". Your entire output should be just the phrase. The session content is:';

        if (availableTools.includes('gemini')) {
            const add = await ask('\n> Found Gemini. Add/update the \'gemini-pro\' summarizer? (Y/n): ');
            if (add.toLowerCase() !== 'n') {
                summarizersToUpdate.push({
                    name: 'gemini-pro',
                    tool: 'gemini',
                    prompt: newPrompt,
                    maxLines: 100,
                });
            }
        }

        if (availableTools.includes('ollama')) {
            const add = await ask('\n> Found Ollama. Add/update the \'ollama\' summarizer? (Y/n): ');
            if (add.toLowerCase() !== 'n') {
                const modelInput = await ask('  - Which Ollama model to use? (press Enter for \'llama3\'): ');
                const model = modelInput || 'llama3';
                summarizersToUpdate.push({
                    name: 'ollama',
                    tool: 'ollama',
                    model: model,
                    prompt: newPrompt,
                    maxLines: 50,
                });
            }
        }
        
        if (availableTools.includes('sgpt')) {
            const add = await ask('\n> Found ShellGPT. Add/update the \'sgpt\' summarizer? (Y/n): ');
            if (add.toLowerCase() !== 'n') {
                summarizersToUpdate.push({
                    name: 'sgpt',
                    tool: 'custom',
                    command: ['sgpt', '--chat', 'session-summary', '"{{prompt}}"'],
                    prompt: newPrompt,
                    maxLines: 100,
                });
            }
        }

        if (summarizersToUpdate.length === 0) {
            console.log('\nNo configurations were added or updated.');
            return;
        }

        // "Update-or-add" logic
        summarizersToUpdate.forEach(newS => {
            const existingIndex = config.summarizer.summarizers.findIndex(s => s.name === newS.name);
            if (existingIndex !== -1) {
                config.summarizer.summarizers[existingIndex] = newS; // Update
                console.log(`  - Updated existing summarizer: "${newS.name}"`);
            } else {
                config.summarizer.summarizers.push(newS); // Add
                console.log(`  - Added new summarizer: "${newS.name}"`);
            }
        });

        // Set default only if it wasn't set before
        if (!config.summarizer.default && config.summarizer.summarizers.length > 0) {
            const priority = ['gemini-pro', 'ollama', 'sgpt'];
            for (const name of priority) {
                if (config.summarizer.summarizers.some(s => s.name === name)) {
                    config.summarizer.default = name;
                    console.log(`\n✔ Set "${config.summarizer.default}" as the default summarizer.`);
                    break;
                }
            }
        }

        writeConfig(config, isLocal);
    } finally {
        rl.close();
    }
}

async function getAiSummary(content: string, summarizerName?: string): Promise<string | null> {
    const config = readConfig();
    const name = summarizerName || config.summarizer.default;

    if (!name) {
        console.warn(`\nWarning: No default summarizer set. Please run 'ai-cli-log --init'.`);
        return null;
    }

    const summarizer = config.summarizer.summarizers.find(s => s.name === name);

    if (!summarizer) {
        console.warn(`\nWarning: No summarizer named "${name}" found. Please check your configuration.`);
        return null;
    }


    const { tool, model, prompt, maxLines = 0, command: customCommand } = summarizer;

    let sampledContent = content;
    const lines = content.split('\n');
    if (maxLines > 0 && lines.length > maxLines * 2) {
        const head = lines.slice(0, maxLines).join('\n');
        const tail = lines.slice(-maxLines).join('\n');
        sampledContent = `${head}\n\n[... Session content truncated ...]\n\n${tail}`;
        console.log(`\n(Session content long, sampling first and last ${maxLines} lines for summary)`);
    }

    let command: string[];
    let inputForStdin: string;

    switch (tool) {
        case 'ollama':
            command = ['ollama', 'run', model || ''];
            inputForStdin = `${prompt}\n\n${sampledContent}`;
            break;
        case 'gemini':
            command = ['gemini', '-p', prompt];
            inputForStdin = sampledContent;
            break;
        case 'custom':
            if (!customCommand) {
                console.error(`Custom summarizer "${name}" is missing the "command" definition.`);
                return null;
            }
            command = customCommand.map(arg => arg.replace('{{prompt}}', prompt));
            inputForStdin = sampledContent;
            break;
        default:
            console.error(`Tool "${tool}" is not directly supported yet.`);
            return null;
    }
    command = command.filter(Boolean);

    const [cmd, ...args] = command;

    return new Promise((resolve) => {
        const proc = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
        let summary = '', errorOutput = '';
        proc.stdout.on('data', data => {
            const output = data.toString();
            summary += output;
        });
        proc.stderr.on('data', data => {
            const error = data.toString();
            errorOutput += error;
        });
        proc.on('close', code => {
            if (code !== 0) {
                console.error(`\nSummarizer command exited with code ${code}. Stderr: ${errorOutput}`);
                resolve(null);
            } else {
                resolve(summary.trim());
            }
        });
        proc.on('error', err => {
            console.error(`\nFailed to start summarizer command "${cmd}". Is it in your PATH?`, err);
            resolve(null);
        });

        proc.stdin.write(inputForStdin);
        proc.stdin.end();
    });
}

function runLoggingSession(command: string, commandArgs: string[], summaryArg?: string | boolean) {
    const logsDir = path.dirname(LOCAL_CONFIG_PATH);
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

    const xterm = new Terminal({
        rows: process.stdout.rows || 24,
        cols: process.stdout.columns || 80,
        scrollback: Infinity,
        allowProposedApi: true,
    });

    const term = pty.spawn(command, commandArgs, {
        name: 'xterm-color',
        cols: process.stdout.columns || 80,
        rows: process.stdout.rows || 24,
        cwd: process.cwd(),
        env: process.env as { [key: string]: string },
    });

    const onData = (data: string) => {
        process.stdout.write(data);
        xterm.write(data);
    };
    term.onData(onData);

    const onStdin = (data: Buffer) => term.write(data.toString());
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onStdin);
    }

    const onExit = async ({ exitCode }: { exitCode: number }) => {
        term.kill();
        if (process.stdin.isTTY) {
            process.stdin.removeListener('data', onStdin);
            process.stdin.setRawMode(false);
            process.stdin.pause();
        }

        setTimeout(async () => {
            let renderedOutput = '';
            for (let i = 0; i < xterm.buffer.active.baseY + xterm.rows; i++) {
                renderedOutput += xterm.buffer.active.getLine(i)?.translateToString(true) + '\n';
            }
            renderedOutput = renderedOutput.trim();

            if (renderedOutput.trim().length === 0) {
                console.log('\nSession had no output, not saving log file.');
                process.exit(exitCode);
            }

            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, '0');
            const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
            const prefix = command || 'session';
            let logFileName = `${prefix}-${timestamp}.txt`;

            if (summaryArg) {
                const rawSummary = await getAiSummary(renderedOutput, typeof summaryArg === 'string' ? summaryArg : undefined);
                if (rawSummary) {
                    const config = readConfig();
                    const summarizerName = (typeof summaryArg === 'string' ? summaryArg : config.summarizer.default) || 'default';
                    
                    const summaryWords = rawSummary.split(/\s+/);
                    const summaryPreview = summaryWords.slice(0, 10).join(' ');
                    console.log(`\nSummary by ${summarizerName}: "${summaryPreview}${summaryWords.length > 10 ? '...' : ''}"`);

                    const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    const slug = slugify(rawSummary).split('-').slice(0, 10).join('-');
                    logFileName = `${prefix}-${timestamp}-${slug}.txt`;
                }
            }

            const logFilePath = path.join(logsDir, logFileName);
            fs.writeFile(logFilePath, renderedOutput, (err) => {
                if (err) {
                    console.error('\nError writing log file:', err);
                } else {
                    console.log(`\nSession logged to ${path.relative(process.cwd(), logFilePath)}`);
                }
                process.exit(exitCode);
            });
        }, 200);
    };
    term.onExit(onExit);

    process.on('resize', () => {
        term.resize(process.stdout.columns, process.stdout.rows);
        xterm.resize(process.stdout.columns, process.stdout.rows);
    });
}

// --- 3. MAIN ENTRY POINT & ARGUMENT PARSER ---

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--init')) {
        const isLocal = args.includes('--local');
        handleInitCommand(isLocal);
        return;
    }

    const summaryArgRaw = args.find(arg => arg.startsWith('--with-summary') || arg.startsWith('-s'));
    
    const otherArgs = args.filter(arg => 
        !arg.startsWith('--with-summary') && 
        !arg.startsWith('-s') &&
        arg !== '--init' &&
        arg !== '--local'
    );
    
    const command = otherArgs[0];
    const commandArgs = otherArgs.slice(1);

    if (!command) {
        console.error('Usage: ai-cli-log [-s[=<summarizer>]] <command> [args...]');
        console.error('       ai-cli-log --init [--local]');
        process.exit(1);
    }

    let summaryArg: string | boolean = false;
    if (summaryArgRaw) {
        summaryArg = summaryArgRaw.includes('=') ? summaryArgRaw.split('=')[1] : true;
    }

    runLoggingSession(command, commandArgs, summaryArg);
}

main();
