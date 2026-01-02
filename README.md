# F5-TTS Discord Bot

This is a Discord Text-to-Speech (TTS) bot based on **F5-TTS** (Few-shot Text-to-Speech), capable of synthesizing high-quality speech in voice channels. The project is developed using **TypeScript** and runs with **Vite-Node**.

## ✨ Features

*   **F5-TTS Integration**: Connects to F5-TTS Gradio API for high-quality speech synthesis.
*   **Queue Management**: Built-in playback queue supporting multiple users queuing commands, playing in order.
*   **Auto-Play**: Automatically starts playing upon adding to the queue without manual triggering.
*   **Slash Commands**: Supports modern Discord Slash Commands interface.
*   **Developer Friendly**: Uses TypeScript and Vite-Node for a fast HMR development experience.

## 🛠️ Tech Stack

*   [Node.js](https://nodejs.org/) (Runtime)
*   [TypeScript](https://www.typescriptlang.org/) (Language)
*   [Discord.js](https://discord.js.org/) (Bot Framework)
*   [@discordjs/voice](https://discord.js.org/#/docs/voice/main/general/welcome) (Audio Playback)
*   [Vite](https://vitejs.dev/) (Build Tool / Runner)
*   [F5-TTS](https://github.com/SWivid/F5-TTS) (Backend TTS Service)

## 🚀 Installation & Usage

### Prerequisites

*   Node.js (v18+ recommended)
*   A running F5-TTS Gradio API server
*   Discord Bot Token (Must enable `Message Content`, `Server Members`, and `Presence` Intents)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root and fill in the following:

```env
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
BOTTOKEN=your_discord_bot_token (Same as DISCORD_TOKEN depending on usage)
SOVITS_API_URL=http://your_f5_tts_api_url
SOVITS_REF_AUDIO_PATH=reference_audio_filename.wav
SOVITS_PROMPT_TEXT=reference_prompt_text
SOVITS_PROMPT_LANG=zh
```

> **Note**: You need `sodium-native` or `libsodium-wrappers` for Discord voice encryption. If you encounter a `No compatible encryption modes` error, run `npm install sodium-native`.

### 3. Run the Bot

**Development Mode**:
```bash
npm run dev
```

**Production Build & Run**:
```bash
npm run build
npm start
```

## 🎮 Commands

*   `/join`: Bot joins your current voice channel.
*   `/leave`: Bot leaves the voice channel and clears the queue.
*   `/tts [text]`: Synthesizes input text to speech and plays it.
*   `/show-queue`: Displays the current playback queue.

## 📁 Project Structure

```
src/
├── commands/       # Discord Command Implementations
├── core/           # Core Logic (VoiceManager, TTS Service)
├── interface/      # TypeScript Interfaces
├── utils/          # Utilities (Logger, Fetch)
├── app.ts          # Entry Point
└── ...
```

## 📝 Notes

This project depends on an external F5-TTS service. Ensure your API Endpoint is correctly configured and accessible.

---
Developed by **Tony Liu / ETHCI Lab**
