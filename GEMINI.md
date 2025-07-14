# GEMINI.md - ai-cli-log 项目开发指南

本文档概述了 `ai-cli-log` 项目在开发过程中确立的关键架构决策、编码标准和开发偏好，这些主要通过与 Google Gemini 的互动形成。它将作为未来开发和维护的指南。

## 1. 项目概览

*   **项目名称:** `ai-cli-log`
*   **项目目的:** 一个命令行界面 (CLI) 工具，旨在无缝捕获与 AI 模型（如 Gemini、Claude）的交互式终端会话，并将包括用户输入和渲染输出在内的整个交互过程保存为清晰的 Markdown 文档。
*   **核心技术栈:** Node.js (TypeScript)。

## 2. 架构原则与核心库

*   **交互式会话捕获:**
    *   **伪终端 (PTY) 模拟:** 使用 `node-pty` 来启动子进程（即被包装的 CLI 工具），并提供一个完全交互式的终端环境，确保正确处理提示符、行缓冲和控制字符。
    *   **终端渲染与 ANSI 解析:** 采用 `@xterm/headless` 来解释 ANSI 转义码并维护一个虚拟屏幕缓冲区。这使得能够捕获“渲染后”的输出，反映终端屏幕在退格、光标移动和清屏等操作后的最终状态。
*   **输入/输出处理:**
    *   `process.stdin` 被管道连接到 `node-pty` 实例 (`term.write()`)，以便将用户输入传递给被包装的命令。
    *   `node-pty` 的 `onData` 事件将子进程的输出同时管道连接到 `process.stdout`（用于实时显示）和 `xterm` 实例（用于渲染和捕获）。
*   **异步操作:** 所有文件系统操作 (`fs.writeFile`) 均以异步方式处理。`process.exit` 被明确地放置在 `fs.writeFile` 的回调函数内部，以确保应用程序在日志文件完全写入之前不会终止。
*   **错误处理:** 关键错误（例如，子进程启动失败、文件写入错误）会被记录到 `console.error`。

## 3. 编码标准与约定

*   **语言:** TypeScript 是主要的开发语言，利用其类型安全和现代特性。
*   **文件结构:**
    *   `src/index.ts`: 包含主应用程序逻辑。
    *   `dist/`: 编译后的 JavaScript 输出目录。
    *   `.ai-cli-log/`: 用于存储生成的会话日志 Markdown 文件的目录。如果该目录不存在，则会自动创建。
    *   `bin/`: 包含 CLI 工具的启动脚本。
*   **日志格式:**
    *   **内容:** 日志文件捕获来自 `xterm/headless` 缓冲区的“渲染后”终端输出，真实地呈现用户所看到的内容。这包括所有交互元素、输入和输出。
    *   **格式:** Markdown (`.md`) 文件，便于阅读和文档化。
    *   **文件名约定:** `[command_prefix]-YYYYMMDD-HHMMSS.md`。`command_prefix` 来自于被包装的命令（例如 `gemini`、`claude`），如果未提供命令，则默认为 `session`。时间戳使用 `YYYYMMDD-HHMMSS` 格式（不含冒号），以提高 URL 友好性。
*   **Xterm.js 配置:**
    *   `scrollback: Infinity`: 确保捕获整个回滚缓冲区，而不仅仅是可见屏幕。
    *   `allowProposedApi: true`: 明确启用 `@xterm/headless` 中的实验性 API。
*   **Polyfills:** 避免使用浏览器特定的 polyfills（如 `global.self` 或 `global.document` 模拟），如果存在 Node.js 原生或无头版本的库（例如，优先选择 `@xterm/headless` 而非 `xterm`）。
*   **文档中的命令语法:** 在 `README.md` 等面向用户的文档中，即使在中文说明部分，命令的语法示例（例如 `ai-cli-log <command> [args...]`）也应保持英文，以确保技术上的精确性和一致性。
*   **代码输出:** 在生成或修改代码时，应尽量避免包含行号，除非行号对于理解上下文至关重要。这有助于保持代码片段的简洁性和可重用性。

## 4. 开发工作流

*   **构建:** `npm run build` (执行 `tsc` 进行 TypeScript 编译)。
*   **运行:** `npm run start` 或通过全局链接的 `ai-cli-log <command> [args...]` 直接运行。
*   **调试:** 调试时可以使用临时的 `console.log` 语句，但在提交前应将其移除。
*   **依赖管理:** 通过 `package.json` 和 `npm` 进行管理。
*   **CLI 入口点规范:** 采用独立的 `bin/ai-cli-log.js` 脚本作为 CLI 入口点，该脚本包含 shebang (`#!/usr/bin/env node`) 并 `require` 编译后的主文件 (`dist/index.js`)。这是一种更健壮和标准化的方法，符合 Node.js CLI 的常见实践。

## 5. 一般偏好

*   **命名约定:** 偏好清晰、简洁和现代的名称，能准确反映工具的用途（例如，`ai-cli-log` 因其在 AI、CLI 和日志方面的清晰性而被选中）。
*   **用户体验:** 优先考虑无缝和直观的用户体验，特别是对于交互式 CLI 工具。
*   **可维护性:** 代码应保持整洁、结构良好且易于理解，以便于未来的维护。
*   **文档语言:** `README.md` 等面向用户的文档应提供中英文双语说明，以覆盖更广泛的用户群体。