# ai-cli-log

Seamlessly log your AI-powered coding conversations. This command-line interface (CLI) tool captures your terminal interactions with AI models like Gemini and Claude, saving entire sessions as clean plain text documents for easy review and documentation.

## Installation

```bash
npm install -g ai-cli-log
```

## Usage

Wrap any command with `ai-cli-log` to start a logging session. The core structure is:

```bash
ai-cli-log [global-options] run <command-to-log> [args...]
```

**Examples:**

- **Basic Logging:** Record a session with Google's Gemini CLI.
  ```bash
  ai-cli-log run gemini
  ```
  *Logs are saved to the `.ai-cli-log/` directory.*

- **AI-Powered Filenames:** Use an AI summary for the log's filename. The options must come **before** the `run` command.
  ```bash
  # Enable summary with the default summarizer
  ai-cli-log -s run gemini
  # or
  ai-cli-log --with-summary run gemini

  # Enable summary and specify a summarizer
  ai-cli-log --by gemini-pro run gemini
  # or
  ai-cli-log --summarizer gemini-pro run gemini
  ```
  This will use your default (or specified) summarizer to generate a descriptive filename like `gemini-20250713-153000-fix-database-connection-error.txt`.

## Alias for Quick Access

For even faster access, you can create shell aliases. This allows you to start a logged session with a short command. Add these to your shell's configuration file (e.g., `~/.bashrc`, `~/.zshrc`).

```bash
# Start a logged Gemini session with an AI-generated summary
alias ag='ai-cli-log -s run gemini'

# Start a logged Claude session with an AI-generated summary
alias ac='ai-cli-log -s run claude'

# You can also omit the -s flag for basic logging
alias ag-log='ai-cli-log run gemini'
```

Now, you can simply run `ag` to start a recorded Gemini session.

## Configuration

`ai-cli-log` loads configuration from `config.json` files. It prioritizes a local (project-specific) configuration over the global one.

**Loading Order:**
1.  **Local Configuration**: Looks for `.ai-cli-log/config.json` in the current directory first.
2.  **Global Configuration**: If no local configuration is found, it falls back to `~/.config/ai-cli-log/config.json`.

You can create these files manually or by using the interactive setup command.

### Interactive Setup (`init`)

The `init` command helps you create a configuration file. It will scan for available AI tools, guide you through creating summarizer profiles, and set a default.

*   **To create a global configuration:**
    ```bash
    ai-cli-log init
    ```
    This saves the configuration to `~/.config/ai-cli-log/config.json`.

*   **To create a local (project-specific) configuration:**
    ```bash
    ai-cli-log init --local
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
        "prompt": "You are a log summarizer. Your response MUST be a valid JSON object with one key: \"summary\" (a 3-5 word, lowercase, filename-friendly phrase). Example: {\"summary\": \"refactor-database-schema\"}. The session content is:",
        "command": ["sgpt", "--chat", "session-summary", "\"{{prompt}}\""],
        "maxLines": 50
      }
    ]
  }
}
```

## Features

*   **Interactive Session Capture:** Faithfully records complex interactive CLI sessions.
*   **AI-Powered Summaries:** Automatically generates descriptive filenames from session content, making logs easy to find and identify.
*   **Accurate Rendering:** Uses `@xterm/headless` to interpret ANSI escape codes, ensuring the log accurately reflects the final terminal state (spinners, progress bars, etc.).
*   **Configurable:** Supports different AI backends (`gemini`, `sgpt`, `ollama`, etc.) for generating summaries.
*   **Performance-Aware:** When summarizing long sessions, it intelligently samples the beginning and end of the output to ensure fast and cost-effective summary generation.
*   **Plain Text Output:** Saves sessions as clean plain text files.

## Development Notes

This project was generated with the assistance of Google Gemini. You can review the detailed development process and interactions in the `.ai-cli-log` directory of the project's GitHub repository: [https://github.com/alingse/ai-cli-log/tree/main/.ai-cli-log](https://github.com/alingse/ai-cli-log/tree/main/.ai-cli-log). The development prompts are primarily in Chinese.

Special thanks to Gemini for its invaluable help in the development of this tool!

## TODO

*   **Markdown Support:** Investigate and potentially implement saving logs in Markdown format, which could include session metadata (e.g., command, timestamp, summary) in a frontmatter block.

---

# ai-cli-log (中文说明)

无缝记录您与 AI 进行的编程对话。本命令行工具 (CLI) 能捕获您在终端中与 Gemini、Claude 等 AI 模型的交互过程，并将整个会话保存为清晰的纯文本文档，便于后续查阅和归档。

## 安装

```bash
npm install -g ai-cli-log
```

## 使用方法

使用 `ai-cli-log` 命令来包装任何您想记录的命令。核心结构是：

```bash
ai-cli-log [全局选项] run <要记录的命令> [参数...]
```

**示例:**

- **基本日志记录:** 记录与 Google Gemini CLI 的会话。
  ```bash
  ai-cli-log run gemini
  ```
  *日志将保存到 `.ai-cli-log/` 目录中。*

- **AI 驱动的文件名:** 使用 AI 摘要作为日志文件名。选项必须在 `run` 命令**之前**。
  ```bash
  # 使用默认摘要器启用摘要
  ai-cli-log -s run gemini
  # 或
  ai-cli-log --with-summary run gemini

  # 启用摘要并指定一个摘要器
  ai-cli-log --by gemini-pro run gemini
  # 或
  ai-cli-log --summarizer gemini-pro run gemini
  ```
  这将使用您默认（或指定）的摘要器生成一个描述性的文件名，例如 `gemini-20250713-153000-fix-database-connection-error.txt`。

## 快捷别名 (Alias)

为了更快捷地启动，您可以创建 shell 别名。这样，您可以用一个简短的命令开始一个带日志记录的会话。将以下内容添加到您的 shell 配置文件中（例如 `~/.bashrc`, `~/.zshrc`）。

```bash
# 启动一个带 AI 摘要的 Gemini 会话
alias ag='ai-cli-log -s run gemini'

# 启动一个带 AI 摘要的 Claude 会话
alias ac='ai-cli-log -s run claude'

# 您也可以省略 -s 标志以进行基本日志记录
alias ag-log='ai-cli-log run gemini'
```

现在，您只需运行 `ag` 即可启动一个被记录的 Gemini 会话。

## 配置

`ai-cli-log` 从 `config.json` 文件中加载配置。它会优先使用本地（项目特定）的配置，其次是全局配置。

**加载顺序:**
1.  **本地配置**: 首先在当前目录中查找 `.ai-cli-log/config.json`。
2.  **全局配置**: 如果未找到本地配置，则会使用 `~/.config/ai-cli-log/config.json`。

您可以通过手动或使用交互式设置命令来创建这些文件。

### 交互式设置 (`init`)

`init` 命令可以帮助您创建配置文件。它会扫描可用的 AI 工具，引导您完成摘要器配置的创建，并设置一个默认值。

*   **创建全局配置文件:**
    ```bash
    ai-cli-log init
    ```
    这会将配置保存到 `~/.config/ai-cli-log/config.json`。

*   **创建本地（项目特定）配置文件:**
    ```bash
    ai-cli-log init --local
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
        "prompt": "你是一个日志摘要器。你的响应必须是一个有效的 JSON 对象，其中包含一个键：\"summary\"（一个 3-5 个单词的、小写的、文件名友好的短语）。示例：{\"summary\": \"refactor-database-schema\"}。会话内容是：",
        "maxLines": 100
      },
      {
        "name": "ollama",
        "tool": "ollama",
        "model": "llama3",
        "prompt": "你是一个日志摘要器。你的响应必须是一个有效的 JSON 对象，其中包含一个键：\"summary\"（一个 3-5 个单词的、小写的、文件名友好的短语）。示例：{\"summary\": \"refactor-database-schema\"}。会话内容是：",
        "maxLines": 50
      },
      {
        "name": "sgpt",
        "tool": "custom",
        "command": ["sgpt", "--chat", "session-summary", "\"{{prompt}}\""],
        "prompt": "你是一个日志摘要器。你的响应必须是一个有效的 JSON 对象，其中包含一个键\"summary\"（一个 3-5 个单词的、小写的、文件名友好的短语）。示例：{\"summary\": \"refactor-database-schema\"}。会话内容是：",
        "maxLines": 50
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
    *   **重要**: 摘要器的输出**必须**是一个有效的 JSON 对象，其中包含一个名为 `summary` 的键（例如，`{"summary": "fix-login-bug"}`）。

## 功能特性

*   **交互式会话捕获:** 忠实地记录复杂的交互式 CLI 会话。
*   **AI 驱动的摘要:** 从会话内容中自动生成描述性文件名，使日志易于查找和识别。
*   **精确渲染:** 使用 `@xterm/headless` 解释 ANSI 转义码，确保日志准确反映最终的终端状态（如加载动画、进度条等）。
*   **可配置:** 支持不同的 AI 后端（`gemini`、`sgpt`、`ollama` 等）用于生成摘要。
*   **性能感知:** 在总结长会话时，它会智能地抽样输出的开头和结尾，以确保快速且经济高效地生成摘要。
*   **纯文本输出:** 将会话保存为清晰的纯文本文档。

## 开发说明

本项目是在 Google Gemini 的协助下生成的。您可以在本项目的 GitHub 仓库中查看详细的开发过程和交互记录，所有开发记录（中文 Prompt）都保存在 `.ai-cli-log` 目录中：[https://github.com/alingse/ai-cli-log/tree/main/.ai-cli-log](https://github.com/alingse/ai-cli-log/tree/main/.ai-cli-log)。

特别感谢 Gemini 在本项目开发过程中提供的宝贵帮助！

## 待办事项 (TODO)

*   **Markdown 支持:** 探寻并实现将日志保存为 Markdown 格式的可能性，可在文件的 frontmatter 中包含会话元数据（如：命令、时间戳、摘要等）。