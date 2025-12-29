export interface RecipeIngredient {
  name: string;
  amount: string; // e.g., "2 oz", "1 dash", "0.5 oz"
}

export interface Recipe {
  id: string;
  name: string;
  category: 'spirits' | 'mixers' | 'garnishes' | 'pantry';
  ingredients: string[];
  image?: string;
  // Extended fields for modal
  detailedIngredients?: RecipeIngredient[];
  steps?: string[];
  servingSize?: string;
  glassware?: string;
  abv?: string;
}

export const mostPopularRecipes: Recipe[] = [
  {
    id: 'espresso-martini',
    name: 'Espresso Martini',
    category: 'spirits',
    ingredients: ['Vodka', 'Coffee Liqueur', 'Espresso'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'Premium Vodka', amount: '2.0 oz' },
      { name: 'Coffee Liqueur', amount: '1.0 oz' },
      { name: 'Fresh Espresso', amount: '1.0 oz' },
      { name: 'Simple Syrup', amount: '0.5 oz' }
    ],
    steps: [
      'Chill a martini glass in the freezer',
      'Combine vodka, coffee liqueur, espresso, and simple syrup in a shaker',
      'Add ice and shake vigorously for 15 seconds',
      'Double strain into the chilled glass',
      'Garnish with three coffee beans'
    ],
    servingSize: '1 serving',
    glassware: 'Martini Glass',
    abv: '~20%'
  },
  {
    id: 'old-fashioned',
    name: 'Old Fashioned',
    category: 'spirits',
    ingredients: ['Bourbon', 'Bitters', 'Sugar'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'Bourbon Whiskey', amount: '2.0 oz' },
      { name: 'Angostura Bitters', amount: '2 dashes' },
      { name: 'Sugar Cube', amount: '1 cube' },
      { name: 'Orange Peel', amount: '1 strip' }
    ],
    steps: [
      'Place sugar cube in an Old Fashioned glass',
      'Add bitters and muddle until dissolved',
      'Add ice and pour in bourbon',
      'Stir gently for 30 seconds',
      'Express orange peel over the drink and drop it in'
    ],
    servingSize: '1 serving',
    glassware: 'Old Fashioned Glass',
    abv: '~25%'
  },
  {
    id: 'margarita',
    name: 'Margarita',
    category: 'spirits',
    ingredients: ['Tequila', 'Triple Sec', 'Lime Juice'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'Tequila Blanco', amount: '2.0 oz' },
      { name: 'Triple Sec', amount: '1.0 oz' },
      { name: 'Fresh Lime Juice', amount: '1.0 oz' },
      { name: 'Agave Nectar', amount: '0.25 oz' }
    ],
    steps: [
      'Rim a margarita glass with salt',
      'Combine tequila, triple sec, lime juice, and agave in a shaker',
      'Add ice and shake for 12 seconds',
      'Strain into the prepared glass over fresh ice',
      'Garnish with a lime wheel'
    ],
    servingSize: '1 serving',
    glassware: 'Margarita Glass',
    abv: '~18%'
  },
  {
    id: 'negroni',
    name: 'Negroni',
    category: 'spirits',
    ingredients: ['Gin', 'Campari', 'Sweet Vermouth'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'London Dry Gin', amount: '1.0 oz' },
      { name: 'Campari', amount: '1.0 oz' },
      { name: 'Sweet Vermouth', amount: '1.0 oz' },
      { name: 'Orange Peel', amount: '1 strip' }
    ],
    steps: [
      'Fill a rocks glass with large ice cubes',
      'Pour gin, Campari, and vermouth directly into the glass',
      'Stir gently for 20 seconds',
      'Express orange peel over the drink',
      'Drop the peel into the glass and serve'
    ],
    servingSize: '1 serving',
    glassware: 'Rocks Glass',
    abv: '~24%'
  },
  {
    id: 'whiskey-sour',
    name: 'Whiskey Sour',
    category: 'spirits',
    ingredients: ['Bourbon', 'Lemon Juice', 'Egg White'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'Bourbon Whiskey', amount: '2.0 oz' },
      { name: 'Fresh Lemon Juice', amount: '0.75 oz' },
      { name: 'Simple Syrup', amount: '0.75 oz' },
      { name: 'Egg White', amount: '1.0 oz' }
    ],
    steps: [
      'Combine all ingredients in a shaker (dry shake first)',
      'Shake without ice for 10 seconds to emulsify egg white',
      'Add ice and shake again for 15 seconds',
      'Double strain into a coupe glass',
      'Garnish with 2-3 drops of Angostura bitters'
    ],
    servingSize: '1 serving',
    glassware: 'Coupe Glass',
    abv: '~20%'
  }
];

export interface SeasonalCollection {
  id: string;
  season: string;
  title: string;
  flavorProfile: string;
  ingredients: string[];
  keyDrinks: string[];
  image?: string;
}

export const seasonalCollections: SeasonalCollection[] = [
  {
    id: 'winter',
    season: 'Winter',
    title: 'The Warm & Spiced Collection',
    flavorProfile: 'Smoked, spiced, nutty, and creamy',
    ingredients: ['Bourbon', 'Dark Rum', 'Cinnamon', 'Cloves', 'Nutmeg', 'Heavy Cream', 'Honey'],
    keyDrinks: ['Hot Toddy', 'Peppermint White Russian', 'Spiced Mulled Wine'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 'spring',
    season: 'Spring',
    title: 'The Floral & Bright Collection',
    flavorProfile: 'Floral, light, herbaceous, and crisp',
    ingredients: ['Gin', 'Elderflower Liqueur (St-Germain)', 'Lavender', 'Mint', 'Lemon', 'Sparkling Water'],
    keyDrinks: ['Elderflower Spritz', 'Southside', 'Gin Basil Smash'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 'summer',
    season: 'Summer',
    title: 'The Tropical & Refreshing Collection',
    flavorProfile: 'Citrusy, icy, tropical, and high-acid',
    ingredients: ['Tequila', 'White Rum', 'Coconut Cream', 'Pineapple', 'Lime', 'Watermelon'],
    keyDrinks: ['Margarita', 'Paloma', 'Mojito', 'Piña Colada'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'
  },
  {
    id: 'autumn',
    season: 'Autumn',
    title: 'The Harvest & Earthy Collection',
    flavorProfile: 'Oaky, bitter, apple-forward, and earthy',
    ingredients: ['Rye Whiskey', 'Apple Brandy (Calvados)', 'Maple Syrup', 'Ginger Beer', 'Bitters'],
    keyDrinks: ['Apple Jack Rabbit', 'Whiskey Sour with Maple', "Dark 'n Stormy"],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80'
  }
];

export const basicRecipes: Recipe[] = [
  {
    id: 'gin-tonic',
    name: 'Gin & Tonic',
    category: 'spirits',
    ingredients: ['Gin', 'Tonic Water', 'Lime'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'London Dry Gin', amount: '2.0 oz' },
      { name: 'Premium Tonic Water', amount: '4.0 oz' },
      { name: 'Lime Wedge', amount: '1 wedge' }
    ],
    steps: [
      'Fill a highball glass with ice',
      'Pour gin over the ice',
      'Top with tonic water',
      'Gently stir to combine',
      'Garnish with a lime wedge'
    ],
    servingSize: '1 serving',
    glassware: 'Highball Glass',
    abv: '~12%'
  },
  {
    id: 'moscow-mule',
    name: 'Moscow Mule',
    category: 'spirits',
    ingredients: ['Vodka', 'Ginger Beer', 'Lime Juice'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'Vodka', amount: '2.0 oz' },
      { name: 'Ginger Beer', amount: '4.0 oz' },
      { name: 'Fresh Lime Juice', amount: '0.5 oz' },
      { name: 'Lime Wedge', amount: '1 wedge' }
    ],
    steps: [
      'Fill a copper mug with ice',
      'Add vodka and lime juice',
      'Top with ginger beer',
      'Stir gently',
      'Garnish with a lime wedge'
    ],
    servingSize: '1 serving',
    glassware: 'Copper Mug',
    abv: '~12%'
  },
  {
    id: 'cuba-libre',
    name: 'Cuba Libre',
    category: 'spirits',
    ingredients: ['Rum', 'Cola', 'Lime Juice'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'White Rum', amount: '2.0 oz' },
      { name: 'Cola', amount: '4.0 oz' },
      { name: 'Fresh Lime Juice', amount: '0.5 oz' },
      { name: 'Lime Wedge', amount: '1 wedge' }
    ],
    steps: [
      'Fill a highball glass with ice',
      'Pour rum and lime juice over ice',
      'Top with cola',
      'Stir gently',
      'Garnish with a lime wedge'
    ],
    servingSize: '1 serving',
    glassware: 'Highball Glass',
    abv: '~12%'
  },
  {
    id: 'paloma',
    name: 'Paloma',
    category: 'spirits',
    ingredients: ['Tequila', 'Grapefruit Soda', 'Lime Juice'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'Tequila Blanco', amount: '2.0 oz' },
      { name: 'Grapefruit Soda', amount: '3.0 oz' },
      { name: 'Fresh Lime Juice', amount: '0.5 oz' },
      { name: 'Lime Wheel', amount: '1 wheel' }
    ],
    steps: [
      'Rim a highball glass with salt (optional)',
      'Fill glass with ice',
      'Add tequila and lime juice',
      'Top with grapefruit soda',
      'Garnish with a lime wheel'
    ],
    servingSize: '1 serving',
    glassware: 'Highball Glass',
    abv: '~15%'
  },
  {
    id: 'dark-n-stormy',
    name: "Dark 'n Stormy",
    category: 'spirits',
    ingredients: ['Dark Rum', 'Ginger Beer'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80',
    detailedIngredients: [
      { name: 'Dark Rum', amount: '2.0 oz' },
      { name: 'Ginger Beer', amount: '4.0 oz' },
      { name: 'Lime Wedge', amount: '1 wedge' }
    ],
    steps: [
      'Fill a highball glass with ice',
      'Pour dark rum over ice',
      'Top with ginger beer',
      'Stir gently',
      'Garnish with a lime wedge'
    ],
    servingSize: '1 serving',
    glassware: 'Highball Glass',
    abv: '~14%'
  }
];

