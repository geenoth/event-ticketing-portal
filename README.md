# Event Ticketing Portal

A modern, fast, and responsive event ticketing and RSVP management portal. This application provides a seamless user experience for browsing events, selecting dates and times, customizing event packages, and submitting RSVPs.

## Features

- **Interactive UI**: Built with React and animated using Motion for a fluid experience.
- **Responsive Design**: Fully mobile-compatible layouts using Tailwind CSS.
- **Dynamic Routing**: Single-page application feeling with robust state management.
- **Secure Submissions**: Form handling and RSVP delivery using Web3Forms.

## Tech Stack

- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Set up your environment variables by copying `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Make sure to configure any necessary API keys (e.g., Web3Forms access key) in the `.env.local` file.*

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Build for Production

To create a production-ready build:
```bash
npm run build
```
The optimized assets will be output to the `dist` directory.

## License

This project is licensed under the MIT License.
