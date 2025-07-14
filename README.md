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

## Configuration

`ai-cli-log` loads configuration from `config.json` files. It prioritizes a local (project-specific) configuration over the global one.

**Loading Order:**
1.  **Local Configuration**: Looks for `.ai-cli-log/config.json` in the current directory first.
2.  **Global Configuration**: If no local configuration is found, it falls back to `~/.config/ai-cli-log/config.json`.

You can create these files manually or by using the interactive setup command.

### Interactive Setup (`--init`)

The `--init` command helps you create a configuration file.

*   **To create a global configuration:**
    ```bash
    ai-cli-log --init
    ```
    This saves the configuration to `~/.config/ai-cli-log/config.json`.

*   **To create a local (project-specific) configuration:**
    ```bash
    ai-cli-log --init --local
    ```
    This saves the configuration to `.ai-cli-log/config.json` in the current directory.

### Manual Configuration

Here is an example of a manual `config.json`:

```json
{
  "summarizer": {
    "default": "gemini-pro",
    "summarizers": [
      {
        "name": "gemini-pro",
        "tool": "gemini",
        "prompt": "You are a log summarizer. Your response MUST be a valid JSON object with one key: \"summary\" (a 3-5 word, lowercase, filename-friendly phrase). Example: {\"summary\": \"refactor-database-schema\"}. The session content is:",
        "maxLines": 100
      },
      {
        "name": "ollama",
        "tool": "ollama",
        "model": "llama3",
        "prompt": "You are a log summarizer. Your response MUST be a valid JSON object with one key: \"summary\" (a 3-5 word, lowercase, filename-friendly phrase). Example: {\"summary\": \"refactor-database-schema\"}. The session content is:",
        "maxLines": 50
      },
      {
        "name": "sgpt",
        "tool": "custom",
        "command": ["sgpt", "--chat", "session-summary", "\"{{prompt}}\""]
      },

*   **To create a global configuration file (at `~/.config/ai-cli-log/config.json`):**
    ```bash
    ai-cli-log --init
    ```

*   **To create a local, project-specific configuration file (at `.ai-cli-log/config.json`):**
    ```bash
    ai-cli-log --init --local
    ```

This command will:
1.  Scan for available AI tools on your system (like `gemini`, `sgpt`, or `ollama`).
2.  Guide you through creating summarizer profiles for them.
3.  Set a default summarizer.

## Features

*   **Interactive Session Capture:** Faithfully records complex interactive CLI sessions.
*   **AI-Powered Summaries:** Automatically generates descriptive filenames from session content, making logs easy to find and identify.
*   **Accurate Rendering:** Uses `@xterm/headless` to interpret ANSI escape codes, ensuring the log accurately reflects the final terminal state (spinners, progress bars, etc.).
*   **Configurable:** Supports different AI backends (`gemini`, `sgpt`, `ollama`, etc.) for generating summaries.
*   **Performance-Aware:** When summarizing long sessions, it intelligently samples the beginning and end of the output to ensure fast and cost-effective summary generation.
*   **Markdown Output:** Saves sessions as clean Markdown files.

## Development Notes

This project was generated with the assistance of Google Gemini. You can review the detailed development process and interactions in the `.ai-cli-log` directory, specifically starting with `0001.txt` and subsequent log files.

Special thanks to Gemini for its invaluable help in the development of this tool!

## TODO

*   **Argument Parsing:** Refactor the manual argument parsing to use a robust library like `yargs` or `commander` to improve maintainability and provide standard features like `--help`.
*   **Markdown Support:** Investigate and potentially implement saving logs in Markdown format, which could include session metadata (e.g., command, timestamp, summary) in a frontmatter block.

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

## 配置

`ai-cli-log` 从 `config.json` 文件中加载配置。它会优先使用本地（项目特定）的配置，其次是全局配置。

**加载顺序:**
1.  **本地配置**: 首先在当前目录中查找 `.ai-cli-log/config.json`。
2.  **全局配置**: 如果未找到本地配置，则会使用 `~/.config/ai-cli-log/config.json`。

您可以通过手动或使用交互式设置命令来创建这些文件。

### 交互式设置 (`--init`)

`--init` 命令可以帮助您创建配置文件。

*   **创建全局配置文件:**
    ```bash
    ai-cli-log --init
    ```
    这会将配置保存到 `~/.config/ai-cli-log/config.json`。

*   **创建本地（项目特定）配置文件:**
    ```bash
    ai-cli-log --init --local
    ```
    这会将配置保存到当前目录的 `.ai-cli-log/config.json` 中。

### 手动配置

这是一个手动创建 `config.json` 的示例：

```json
{
  "summarizer": {
    "default": "gemini-pro",
    "summarizers": [
      {
        "name": "gemini-pro",
        "tool": "gemini",
        "prompt": "你是一个日志摘要器。你的响应必须是一个有效的 JSON 对象，其中包含一个键："summary"（一个 3-5 个单词的、小写的、文件名友好的短语）。示例：{"summary": "refactor-database-schema"}。会话内容是：",
        "maxLines": 100
      },
      {
        "name": "ollama",
        "tool": "ollama",
        "model": "llama3",
        "prompt": "你是一个日志摘要器。你的响应必须是一个有效的 JSON 对象，其中包含一个键："summary"（一个 3-5 个单词的、小写的、文件名友好的短语）。示例：{"summary": "refactor-database-schema"}。会话内容是：",
        "maxLines": 50
      },
      {
        "name": "sgpt",
        "tool": "custom",
        "command": ["sgpt", "--chat", "session-summary", ""{{prompt}}""],
        "prompt": "你是一个日志摘要器。你的响应必须是一个有效的 JSON 对象，其中包含一个键："summary"（一个 3-5 个单词的、小写的、文件名友好的短语）。示例：{"summary": "refactor-database-schema"}。会话内容是：",
        "maxLines": 100
      },
      {
        "name": "my-custom-summarizer",
        "tool": "custom",
        "command": ["my-summarizer-script", "--prompt", "{{prompt}}"],
        "prompt": "You are a log summarizer. Your response MUST be a valid JSON object with one key: \"summary\" (a 3-5 word, lowercase, filename-friendly phrase). Example: {\"summary\": \"refactor-database-schema\"}. The session content is:",
        "maxLines": 200
      }
    ]
  }
}
```

**字段说明:**

*   `summarizer.default` (可选): 默认使用的摘要器配置名称。
*   `summarizer.summarizers`: 包含不同摘要器配置的数组。
    *   **`name`**: 您为摘要器配置指定的唯一名称 (例如, `gemini-pro`, `ollama`, `claude-opus`, `my-custom-summarizer`)。
    *   **`tool`**: 指定摘要器使用的工具类型。
        *   `gemini`: 使用 `gemini` CLI 工具。
        *   `ollama`: 使用 `ollama` CLI 工具。
        *   `claude`: 使用 `claude` CLI 工具。
        *   `custom`: 使用自定义命令。
    *   **`model`** (可选): 对于 `ollama` 工具，指定要使用的模型名称 (例如, `llama3`)。
    *   **`prompt`**: 传递给摘要器命令的提示。会话内容将作为标准输入传递。
    *   **`maxLines`** (可选): 限制传递给摘要器的会话内容行数。如果会话内容超过此限制，将只采样开头和结尾的行。
    *   **`command`** (可选): 对于 `custom` 工具，指定要执行的命令数组。会话内容会通过管道传递给该命令的 `stdin`。`{{prompt}}` 占位符将被实际的提示字符串替换。例如: `["my-summarizer-script", "--prompt", "{{prompt}}"]`。
    *   **重要**: 摘要器的输出**必须**是一个有效的 JSON 对象，其中包含一个名为 `summary` 的键（例如，`{"summary": "你的摘要短语"}`）。
```

**Field Descriptions:**

*   `summarizer.default` (optional): The name of the default summarizer configuration to use.
*   `summarizer.summarizers`: An array of different summarizer configurations.
    *   **`name`**: A unique name you give to the summarizer configuration (e.g., `gemini-pro`, `ollama`, `claude-opus`, `my-custom-summarizer`).
    *   **`tool`**: The type of tool the summarizer uses.
        *   `gemini`: Uses the `gemini` CLI tool.
        *   `ollama`: Uses the `ollama` CLI tool.
        *   `claude`: Uses the `claude` CLI tool.
        *   `custom`: Uses a custom command.
    *   **`model`** (optional): For the `ollama` tool, specifies the model name to use (e.g., `llama3`).
    *   **`prompt`**: The prompt passed to the summarizer command. The session content will be passed as standard input.
    *   **`maxLines`** (optional): Limits the number of session content lines passed to the summarizer. If the session exceeds this limit, only the beginning and end lines will be sampled.
    *   **`command`** (optional): For the `custom` tool, specifies the command array to execute. The session content is piped to this command's `stdin`. The `{{prompt}}` placeholder will be replaced with the actual prompt string. Example: `["my-summarizer-script", "--prompt", "{{prompt}}"]`.
    *   **Important**: The output from the summarizer **MUST** be a valid JSON object containing a key named `summary` (e.g., `{"summary": "your-summary-phrase"}`).

### 交互式设置 (`--init`)

运行交互式设置来创建配置文件。

*   **创建全局配置文件 (位于 `~/.config/ai-cli-log/config.json`):**
    ```bash
    ai-cli-log --init
    ```

*   **创建本地、项目特定的配置文件 (位于 `.ai-cli-log/config.json`):**
    ```bash
    ai-cli-log --init --local
    ```

该命令将引导您完成配置过程，包括扫描可用的 AI 工具、创建摘要器配置和设置默认摘要器。

## 功能特性

*   **交互式会话捕获:** 忠实地记录复杂的交互式 CLI 会话。
*   **AI 驱动的摘要:** 从会话内容中自动生成描述性文件名，使日志易于查找和识别。
*   **精确渲染:** 使用 `@xterm/headless` 解释 ANSI 转义码，确保日志准确反映最终的终端状态（如加载动画、进度条等）。
*   **可配置:** 支持不同的 AI 后端（`gemini`、`sgpt`、`ollama` 等）用于生成摘要。
*   **性能感知:** 在总结长会话时，它会智能地抽样输出的开头和结尾，以确保快速且经济高效地生成摘要。
*   **纯文本输出:** 将会话保存为清晰的纯文本文档。

## 开发说明

本项目是在 Google Gemini 的协助下生成的。您可以在 `.ai-cli-log` 目录中查看详细的开发过程和交互记录，特别是从 `0001.txt` 开始的日志文件。

特别感谢 Gemini 在本项目开发过程中提供的宝贵帮助！

## 待办事项 (TODO)

*   **内容处理:**
    *   当会话输出为空时，避免保存空的日志文件。
    *   尾随空格和空行现在已从输出中删除，以解决内容不足导致大片空白区域的问题。
*   **文件名约定:** 当前基于时间戳的文件名虽然功能上可行，但可能过于单调。评估其他更具描述性的文件名方案，同时仔细考虑如果使用 AI 摘要进行命名可能导致的信息泄露问题。

