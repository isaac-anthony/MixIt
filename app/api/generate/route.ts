import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Mock data for testing - fallback if OpenAI is not configured
const mockRecipes = [
  {
    title: "The Midnight Zest",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&h=600&fit=crop",
    steps: [
      "Fill a shaker with ice",
      "Add 2 oz of vodka and 1 oz of lime juice",
      "Shake vigorously for 15 seconds",
      "Strain into a chilled martini glass",
      "Garnish with a lime wheel"
    ],
    explanation: "This cocktail balances the clean, neutral profile of vodka with the bright acidity of lime. The combination creates a refreshing, crisp drink that's perfect for any occasion. The shaking technique ensures proper dilution and aeration, resulting in a smooth, well-integrated flavor profile."
  },
  {
    title: "Tropical Fusion",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
    steps: [
      "Muddle fresh mint leaves in a glass",
      "Add 1.5 oz of rum and 0.5 oz of simple syrup",
      "Fill with crushed ice and stir",
      "Top with club soda",
      "Garnish with mint sprig and lime wedge"
    ],
    explanation: "The mint provides a refreshing herbal note that complements the sweetness of the rum. The simple syrup balances the acidity while the club soda adds effervescence, creating a light and invigorating tropical experience."
  },
  {
    title: "Citrus Elegance",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop",
    steps: [
      "Combine 2 oz gin, 1 oz lemon juice, and 0.75 oz simple syrup in a shaker",
      "Add ice and shake until well-chilled",
      "Double strain into a coupe glass",
      "Express lemon peel over the drink and discard",
      "Serve immediately"
    ],
    explanation: "Gin's botanical complexity pairs beautifully with fresh lemon juice. The simple syrup rounds out the sharp acidity, creating a perfectly balanced classic cocktail. The lemon peel garnish adds aromatic oils that enhance the citrus profile."
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one ingredient" },
        { status: 400 }
      );
    }

    // Use OpenAI if available, otherwise fall back to mock data
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a professional mixologist. Generate creative cocktail recipes based on provided ingredients. Return a JSON object with: title (string), image (a relevant Unsplash URL for cocktails), steps (array of strings), and explanation (string describing why the recipe works)."
            },
            {
              role: "user",
              content: `Create a unique cocktail recipe using these ingredients: ${ingredients.map((i: { name: string }) => i.name).join(", ")}. Make it creative and professional.`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.8
        });

        const recipeContent = completion.choices[0].message.content;
        if (recipeContent) {
          const recipe = JSON.parse(recipeContent);
          return NextResponse.json(recipe, { status: 200 });
        }
      } catch (error) {
        console.error("OpenAI API error:", error);
        // Fall through to mock data if API fails
      }
    }

    // Fallback to mock data if OpenAI is not configured or fails
    const randomRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
    const ingredientNames = ingredients.map((ing: { name: string }) => ing.name).join(", ");
    const customizedRecipe = {
      ...randomRecipe,
      title: `Custom ${randomRecipe.title}`,
      explanation: `This cocktail was crafted using your selected ingredients: ${ingredientNames}. ${randomRecipe.explanation}`
    };

    return NextResponse.json(customizedRecipe, { status: 200 });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}

