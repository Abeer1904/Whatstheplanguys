# What's the Plan Guys? 🎉

A collaborative city plan generator for exploring Food, Drinks, Events, and Activities across Indian cities.

## Features

- **4 Swipeable Lanes**: Browse Food, Drinks, Events, and Activities with smooth animations
- **Dynamic Cities**: Pre-loaded with 20+ Indian cities, or add your own
- **Budget Tracking**: Track expenses with quick add/remove buttons
- **Collaborative Planning**: Add "who suggested what" for group trip planning
- **Vibe/Mode/Time Selectors**: Filter your perfect experience
- **Local Storage**: Your plans persist across sessions

## Tech Stack

- **Next.js 14.2** - React framework with App Router
- **Tailwind CSS v4** - Utility-first styling with CSS-based config
- **TypeScript** - Type-safe development
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Icon library

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start planning!

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main app page
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── AddEntryForm.tsx
│   ├── BrowseEntries.tsx
│   ├── Controls.tsx
│   ├── Header.tsx
│   └── ItineraryCard.tsx
├── lib/
│   ├── types.ts        # TypeScript definitions
│   ├── storage.ts      # LocalStorage utilities
│   ├── randomiser.ts   # Randomization logic
│   └── utils.ts        # Helper functions
├── data/
│   └── seed.ts         # Initial data & cities
└── styles/
    └── globals.css     # Tailwind v4 config
```

## Usage

1. **Select a City** - Choose from 20+ cities or add your own
2. **Set Your Budget** - Track spending as you plan
3. **Browse Lanes** - Swipe through Food, Drinks, Events, Activities
4. **Add Entries** - Contribute your favorite spots with "added by" attribution
5. **Filter by Vibe** - Select mood, mode, and time preferences

## License

MIT
