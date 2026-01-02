# Mixit - Cocktail Generator

A modern, enterprise-grade cocktail generator app built with Next.js 14, featuring AI-powered recipe generation.

## Features

- **Floating Search Bar**: Search for ingredients with a sleek, floating pill-style search interface
- **Interactive Ingredients Grid**: Click ingredient cards to add them to your refrigerator
- **My Refrigerator**: View and manage your selected ingredients
- **AI Recipe Generation**: Generate custom cocktail recipes based on your selected ingredients
- **Smooth Animations**: Powered by Framer Motion for a delightful user experience
- **Responsive Design**: Works beautifully on all devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: Zustand
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # API route for recipe generation
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── ui/                   # Shadcn/UI components
│   ├── IngredientCard.tsx    # Ingredient card component
│   ├── RecipeCard.tsx        # Recipe display component
│   └── SearchBar.tsx         # Search bar component
├── lib/
│   └── utils.ts              # Utility functions
└── store/
    └── useRefrigeratorStore.ts # Zustand store
```

## API Integration

The app includes a mocked API route at `/app/api/generate/route.ts`. To integrate with OpenAI:

1. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

2. Uncomment the OpenAI API code in `app/api/generate/route.ts` and remove the mock response.

## Customization

- **Ingredients**: Update the `ALL_INGREDIENTS` array in `app/page.tsx` with your own ingredient data
- **Styling**: Modify `tailwind.config.ts` and `app/globals.css` for theme customization
- **Mock Recipes**: Update the `mockRecipes` array in `app/api/generate/route.ts` for different test recipes

## License

MIT



