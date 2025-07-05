# ai-cli-log

Seamlessly log your AI-powered coding conversations. This command-line interface (CLI) tool captures your terminal interactions with AI models like Gemini and Claude, saving entire sessions as clean Markdown documents for easy review and documentation.

## Features:

*   **Interactive Session Capture:** Acts as a wrapper for other CLI tools, capturing full interactive sessions, including user input and the "rendered" output (what you actually see on the terminal after backspaces, cursor movements, etc.).
*   **Accurate Logging:** Utilizes `node-pty` for pseudo-terminal emulation and `@xterm/headless` to parse ANSI escape codes, ensuring the captured log accurately reflects the final state of the terminal screen.
*   **Markdown Output:** Saves recorded sessions as clean Markdown files for easy readability and documentation.
*   **TypeScript Implementation:** Built with Node.js and TypeScript, leveraging a robust ecosystem for CLI development and type safety.

---

# ai-cli-log

无缝记录您的 AI 驱动的编码对话。这个命令行界面 (CLI) 工具捕获您与 Gemini 和 Claude 等 AI 模型的终端交互，并将整个会话保存为整洁的 Markdown 文档，以便于回顾和归档。

## 功能特点：

*   **交互式会话捕获：** 作为其他 CLI 工具的包装器，捕获完整的交互式会话，包括用户输入和“渲染后”的输出（即在退格、光标移动等操作后您在终端上实际看到的内容）。
*   **精确日志记录：** 利用 `node-pty` 进行伪终端模拟，并使用 `@xterm/headless` 解析 ANSI 转义码，确保捕获的日志准确反映终端屏幕的最终状态。
*   **Markdown 输出：** 将记录的会话保存为整洁的 Markdown 文件，便于阅读和文档化。
*   **TypeScript 实现：** 使用 Node.js 和 TypeScript 构建，利用强大的生态系统进行 CLI 开发和类型安全。
