# ai-cli-log

Seamlessly log your AI-powered coding conversations. This command-line interface (CLI) tool captures your terminal interactions with AI models like Gemini and Claude, saving entire sessions as clean plain text documents for easy review and documentation.

## Installation

```bash
npm install -g ai-cli-log
```

## Usage

Wrap any command with `ai-cli-log` to start a logging session.

```bash
ai-cli-log <command> [args...]
```

**Examples:**

- **Basic Logging:** Record a session with Google's Gemini CLI.
  ```bash
  ai-cli-log gemini
  ```
  *Logs are saved to the `.ai-cli-log/` directory.*

- **AI-Powered Filenames:** Use an AI summary for the log's filename.
  ```bash
  ai-cli-log -s <command> [args...]
  # or
  ai-cli-log --with-summary <command> [args...]
  ```
  This will use your default summarizer to generate a descriptive filename like `gemini-20250713-153000-fix-database-connection-error.md`. You can also specify a summarizer: `ai-cli-log -s=my-ollama-summarizer ...`.

## Configuration (`--init`)

To use the AI summary feature, you first need to configure it. Run the interactive setup:

```bash
ai-cli-log --init
```

This command will:
1.  Scan for available AI tools on your system (like `gemini`, `sgpt`, or `ollama`).
2.  Guide you through creating summarizer profiles for them.
3.  Set a default summarizer.

Configuration is saved to `.ai-cli-log/config.json` in the current directory. Use the `--local` flag to save to the global config at `~/.config/ai-cli-log/config.json`.

## Features

*   **Interactive Session Capture:** Faithfully records complex interactive CLI sessions.
*   **AI-Powered Summaries:** Automatically generates descriptive filenames from session content, making logs easy to find and identify.
*   **Accurate Rendering:** Uses `@xterm/headless` to interpret ANSI escape codes, ensuring the log accurately reflects the final terminal state (spinners, progress bars, etc.).
*   **Configurable:** Supports different AI backends (`gemini`, `sgpt`, `ollama`, etc.) for generating summaries.
*   **Performance-Aware:** When summarizing long sessions, it intelligently samples the beginning and end of the output to ensure fast and cost-effective summary generation.
*   **Markdown Output:** Saves sessions as clean Markdown files.

## Development Notes

This project was generated with the assistance of Google Gemini. You can review the detailed development process and interactions in the `.ai-cli-logs` directory, specifically starting with `0001.md` and subsequent log files.

Special thanks to Gemini for its invaluable help in the development of this tool!

## TODO

*   **Content Handling:**
    *   Empty log files are now prevented from being saved when the session output is blank or contains only whitespace.
    *   Trailing whitespace and blank lines are now trimmed from the output to address issues where insufficient content led to large blank areas.
*   **Filename Convention:** The current timestamp-based filenames are functional but can be monotonous. Evaluate alternatives for more descriptive filenames, while carefully considering potential information leakage if AI summarization were to be used for naming.

---

# ai-cli-log (中文说明)

无缝记录您与 AI 进行的编程对话。本命令行工具 (CLI) 能捕获您在终端中与 Gemini、Claude 等 AI 模型的交互过程，并将整个会话保存为清晰的纯文本文档，便于后续查阅和归档。

## 安装

```bash
npm install -g ai-cli-log
```

## 使用方法

使用 `ai-cli-log` 命令来包装任何您想记录的命令。

```bash
ai-cli-log <command> [args...]
```

**示例:**

- **基本日志记录:** 记录与 Google Gemini CLI 的会话。
  ```bash
  ai-cli-log gemini
  ```
  *日志将保存到 `.ai-cli-log/` 目录中。*

- **AI 驱动的文件名:** 使用 AI 摘要作为日志文件名。
  ```bash
  ai-cli-log -s <命令> [参数...]
  # 或
  ai-cli-log --with-summary <命令> [参数...]
  ```
  这将使用您的默认摘要器生成一个描述性的文件名，例如 `gemini-20250713-153000-fix-database-connection-error.md`。您也可以指定一个摘要器：`ai-cli-log -s=my-ollama-summarizer ...`。

## 配置 (`--init`)

要使用 AI 摘要功能，您首先需要进行配置。运行交互式设置命令：

```bash
ai-cli-log --init
```

该命令将：
1.  扫描您系统上可用的 AI 工具（如 `gemini`、`sgpt` 或 `ollama`）。
2.  引导您为这些工具创建摘要器配置。
3.  设置一个默认的摘要器。

配置默认保存在当前目录的 `.ai-cli-log/config.json` 中。使用 `--local` 标志可将其保存到全局配置 `~/.config/ai-cli-log/config.json`。

## 功能特性

*   **交互式会话捕获:** 忠实地记录复杂的交互式 CLI 会话。
*   **AI 驱动的摘要:** 从会话内容中自动生成描述性文件名，使日志易于查找和识别。
*   **精确渲染:** 使用 `@xterm/headless` 解释 ANSI 转义码，确保日志准确反映最终的终端状态（如加载动画、进度条等）。
*   **可配置:** 支持不同的 AI 后端（`gemini`、`sgpt`、`ollama` 等）用于生成摘要。
*   **性能感知:** 在总结长会话时，它会智能地抽样输出的开头和结尾，以确保快速且经济高效地生成摘要。
*   **Markdown 输出:** 将会话保存为清晰的 Markdown 文件。

## 开发说明

本项目是在 Google Gemini 的协助下生成的。您可以在 `.ai-cli-logs` 目录中查看详细的开发过程和交互记录，特别是从 `0001.md` 开始的日志文件。

特别感谢 Gemini 在本项目开发过程中提供的宝贵帮助！

## 待办事项 (TODO)

*   **内容处理:**
    *   当会话输出为空时，避免保存空的日志文件。
    *   解决内容不足导致输出中出现大片空白的问题。
*   **文件名约定:** 当前基于时间戳的文件名虽然功能上可行，但可能过于单调。评估其他更具描述性的文件名方案，同时仔细考虑如果使用 AI 摘要进行命名可能导致的信息泄露问题。