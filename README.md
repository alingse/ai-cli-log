# ai-cli-log

Seamlessly log your AI-powered coding conversations. This command-line interface (CLI) tool captures your terminal interactions with AI models like Gemini and Claude, saving entire sessions as clean plain text documents for easy review and documentation.

## Installation

```bash
npm install -g ai-cli-log
```

## Usage

Wrap any command with `ai-cli-log` to start a logging session. The session will be saved to a plain text file in the `.ai-cli-logs` directory.

For example, to log a session with Google's Gemini CLI (`gemini`):

```bash
ai-cli-log gemini
```

Or to log a session with another tool, like `claude`:`

```bash
ai-cli-log claude
```

The recorded session will be saved to a file like `.ai-cli-logs/session-YYYYMMDD-HH:mm:ss.txt`.

## Features

*   **Interactive Session Capture:** Acts as a wrapper for other CLI tools, capturing full interactive sessions, including user input and the "rendered" output (what you actually see on the terminal after backspaces, cursor movements, etc.).
*   **Accurate Logging:** Utilizes `node-pty` for pseudo-terminal emulation and `@xterm/headless` to parse ANSI escape codes, ensuring the captured log accurately reflects the final state of the terminal screen.
*   **Plain Text Output:** Saves recorded sessions as clean plain text files for easy readability and documentation.
*   **TypeScript Implementation:** Built with Node.js and TypeScript, leveraging a robust ecosystem for CLI development and type safety.

## Development Notes

This project was generated with the assistance of Google Gemini. You can review the detailed development process and interactions in the `.ai-cli-logs` directory, specifically starting with `0001.md` and subsequent log files.

Special thanks to Gemini for its invaluable help in the development of this tool!

## TODO

*   **Content Handling:**
    *   Prevent saving empty log files when the session output is blank.
    *   Address issues where insufficient content leads to large blank areas in the output.
*   **Filename Convention:** The current timestamp-based filenames are functional but can be monotonous. Evaluate alternatives for more descriptive filenames, while carefully considering potential information leakage if AI summarization were to be used for naming.

---

# ai-cli-log (中文说明)

无缝记录您与 AI 进行的编程对话。本命令行工具 (CLI) 能捕获您在终端中与 Gemini、Claude 等 AI 模型的交互过程，并将整个会话保存为清晰的纯文本文档，便于后续查阅和归档。

## 安装

```bash
npm install -g ai-cli-log
```

## 使用方法

使用 `ai-cli-log` 命令来包装任何您想记录的命令。会话日志将被保存到当前目录下的 `.ai-cli-logs` 文件夹中。

例如，记录与 Google Gemini CLI (`gemini`) 的会话：

```bash
ai-cli-log gemini
```

或者记录与其他工具（如 `claude`）的会话：

```bash
ai-cli-log claude
```

记录的会话将保存为类似 `.ai-cli-logs/session-YYYYMMDD-HH:mm:ss.txt` 的文件。

## 快捷提示：使用别名

为了简化您的工作流程，您可以为常用命令创建 shell 别名。例如，快速记录您的 Gemini CLI 会话：

```bash
alias gemini-log='ai-cli-log gemini'
# 将此行添加到您的 shell 配置文件中（例如 ~/.bashrc, ~/.zshrc）
```

然后，您只需运行：

```bash
gemini-log
```

## 功能特性

*   **交互式会话捕获:** 作为其他 CLI 工具的包装器，能够捕获完整的交互式会话，包括用户输入和最终“渲染”在屏幕上的输出（即处理了退格、光标移动等控制字符后的真实显示内容）。
*   **精确日志记录:** 利用 `node-pty` 进行伪终端模拟，并结合 `@xterm/headless` 解析 ANSI 转义码，确保日志精确还原终端的最终显示状态。
*   **纯文本输出:** 将会话保存为干净、易读的纯文本文件，方便查阅和整理。
*   **TypeScript 实现:** 基于 Node.js 和 TypeScript 构建，确保了代码的健壮性和类型安全。

## 开发说明

本项目是在 Google Gemini 的协助下生成的。您可以在 `.ai-cli-logs` 目录中查看详细的开发过程和交互记录，特别是从 `0001.md` 开始的日志文件。

特别感谢 Gemini 在本项目开发过程中提供的宝贵帮助！

## 待办事项 (TODO)

*   **内容处理:**
    *   当会话输出为空时，避免保存空的日志文件。
    *   解决内容不足导致输出中出现大片空白的问题。
*   **文件名约定:** 当前基于时间戳的文件名虽然功能上可行，但可能过于单调。评估其他更具描述性的文件名方案，同时仔细考虑如果使用 AI 摘要进行命名可能导致的信息泄露问题。