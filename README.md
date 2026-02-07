# AI & Learn Through Traps

A mobile-first educational game that helps you master subjects by identifying and understanding common misconceptions ("Traps").

## Features

- **Trap-Based Learning**: Questions specifically designed to test common misconceptions.
- **AI Analysis**: Get detailed feedback on why you fell for a trap.
- **Gamification**: XP, Levels, and **Badges** (e.g., "Sharp Eye", "Scholar").
- **Admin Panel**: Manually add new concepts and trap questions (Teacher Mode).
- **Rich Aesthetics**: Glassmorphism UI, smooth animations, and a premium dark mode theme.

## Tech Stack

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables + Utility approach)
- **Icons**: Lucide React
- **Router**: React Router DOM

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components`: UI Components (Layout, etc.)
- `src/pages`: Main views (Home, Game, Profile)
- `src/data`: Mock question database
- `src/context`: Game state management (XP, Mistakes)
- `src/index.css`: Design system and global styles
