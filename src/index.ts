import * as pty from 'node-pty';
import * as fs from 'fs';
import * as path from 'path';
import { Terminal } from '@xterm/headless';

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

if (!command) {
  console.error('Usage: ai-cli-log <command> [args...]');
  process.exit(1);
}

const logsDir = path.join(process.cwd(), '.ai-cli-logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Initialize xterm.js in headless mode
const xterm = new Terminal({
  rows: process.stdout.rows,
  cols: process.stdout.columns,
  scrollback: Infinity, // Set scrollback to Infinity for unlimited buffer
  allowProposedApi: true,
});

const term = pty.spawn(command, commandArgs, {
  name: 'xterm-color',
  cols: process.stdout.columns,
  rows: process.stdout.rows,
  cwd: process.cwd(),
  env: process.env as { [key: string]: string; },
});

// Pipe pty output to xterm.js and also to stdout
term.onData((data) => {
  process.stdout.write(data);
  xterm.write(data);
});

// Pipe stdin to pty
process.stdin.on('data', (data) => {
  term.write(data.toString());
});

process.stdin.setRawMode(true);
process.stdin.resume();

term.onExit(({ exitCode, signal }) => {
  // Add a small delay to ensure xterm.js has processed all output
  setTimeout(() => {
    // Extract rendered text from xterm.js buffer
    let renderedOutput = '';
    // Iterate over the entire buffer, including scrollback.
    // The total number of lines is the sum of lines in scrollback (baseY) and visible rows.
    for (let i = 0; i < xterm.buffer.active.baseY + xterm.rows; i++) {
      const line = xterm.buffer.active.getLine(i);
      if (line) {
        // translateToString(true) gets the line content, and we trim trailing whitespace.
        const lineText = line.translateToString(true).replace(/\s+$/, '');
        renderedOutput += lineText + '\n';
      }
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const logFileName = `session-${year}${month}${day}-${hours}:${minutes}:${seconds}.md`;
    const logFilePath = path.join(logsDir, logFileName);

    fs.writeFile(logFilePath, renderedOutput, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error('Error writing log file:', err);
      } else {
        console.log(`Session logged to ${path.relative(process.cwd(), logFilePath)}`);
      }
      process.exit(exitCode);
    });
  }, 500); // 500ms delay
});

process.on('SIGINT', () => {
  term.kill('SIGINT');
});

process.on('resize', () => {
  term.resize(process.stdout.columns, process.stdout.rows);
  xterm.resize(process.stdout.columns, process.stdout.rows);
});