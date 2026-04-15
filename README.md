# Vani TTS

Vani TTS is a peaceful and spiritual text-to-speech application that transforms Kannada and Hindi text into high-quality audio using Gemini AI.

## Features

- **Multi-Language Support**: Seamlessly switch between Kannada and Hindi.
- **Diverse Voice Characters**: Choose from 11 unique voice profiles (Male & Female) with different tonal qualities:
  - **Kore** (Balanced & Wise)
  - **Puck** (Cheerful & Bright)
  - **Charon** (Deep & Resonant)
  - **Fenrir** (Strong & Bold)
  - **Zephyr** (Light & Ethereal)
  - **Aoede** (Melodic & Soft)
  - **Orpheus** (Classic & Poetic)
  - **Leda** (Graceful & Calm)
  - **Despina** (Mystical & Deep)
  - **Achernar** (Radiant & Clear)
  - **Sulafat** (Gentle & Warm)
- **Speech Pace Control**: Adjust the generation speed from 0.5x to 2.0x to get the perfect delivery.
- **Spiritual Aesthetic**: A clean, calming UI designed for a peaceful user experience.
- **Direct Download**: Generated audio can be played back immediately or downloaded (via browser controls).

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **UI Components**: shadcn/ui.
- **AI Engine**: Google Gemini AI (`gemini-2.5-flash-preview-tts`).
- **Backend**: Express.js (serving the static application).

## Getting Started

1. **Environment Variables**:
   Ensure you have a `GEMINI_API_KEY` set in your environment.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Build**:
   ```bash
   npm run build
   ```

## Design Philosophy

Vani TTS is built with "Architectural Honesty" and "Mood First" principles. The typography (Inter and Serif pairings) and the spiritual color palette (Cream, Olive, Ink) are chosen to reinforce a sense of calm and divine resonance.
