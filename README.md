# AI Timesheet Writer⏱️

A beautiful, glassmorphic React application that converts rough, informal work notes into polished, professional timesheet updates instantly. Powered by a **local Gemma** model running locally on your computer—meaning your work logs never leave your machine.

---

## Features

- 🔒 **100% Local & Private**: No cloud APIs or API keys are required. All inference is run locally on your system using Ollama.
- ✨ **Custom Output Tones**:
  - **Professional**: Formal & polished language for corporate or client updates.
  - **Concise**: Brief & direct summaries.
  - **Detailed**: Thorough & comprehensive descriptions.
- 💡 **Quick Suggestions**: Clickable tags to instantly append common actions (e.g. `Fixed API issue`, `Tested login flow`) into your work notes.
- ⚡ **Char-Counter UI**: Tracks input character count with a limit of 1000 characters.
- 🎨 **Premium Aesthetics**: Dark theme, grid pattern background, glow effects, responsive card grids, and smooth loading state skeletons.
- 📋 **Actions**: Copy output to clipboard or clear it in one click.

---

## Technical Architecture

The project consists of two key parts:
1. **Frontend**: React + Vite SPA using standard CSS.
2. **Backend**: Express.js server functioning as an API gateway mapping standard Anthropic API payload structures to Ollama's local chat format.

---

## Getting Started

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **Ollama** installed on your PC. Download it from [ollama.com](https://ollama.com).
3. Download the **Gemma** model on your PC by running:
   ```bash
   ollama pull gemma4:e2b
