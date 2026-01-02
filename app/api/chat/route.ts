import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists FIRST before processing request
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file and restart the server." },
        { status: 500 }
      );
    }

    if (!openai) {
      console.error("OpenAI client failed to initialize");
      return NextResponse.json(
        { error: "OpenAI client initialization failed. Please check your API key configuration." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { query, ingredients } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid query" },
        { status: 400 }
      );
    }

    // Check if query is asking for cocktail recommendations
    const isRecipeQuery = query.toLowerCase().includes('make') || 
                         query.toLowerCase().includes('cocktail') || 
                         query.toLowerCase().includes('drink') ||
                         query.toLowerCase().includes('recipe') ||
                         (ingredients && ingredients.length > 0);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: isRecipeQuery 
            ? `You are a professional mixologist assistant for MixIt, a cocktail recipe app. 

CRITICAL REQUIREMENTS:
1. You MUST return EXACTLY 5 cocktail suggestions in JSON format - NO MORE, NO LESS
2. You MUST mix the types: include multiple "Classic", "Custom Fusion", and "Seasonal" drinks (e.g., 2 Classic, 2 Custom Fusion, 1 Seasonal)
3. **EVERY RECIPE MUST HAVE ALL REQUIRED FIELDS**: name, type, ingredients (array), instructions (string), and image (URL)
4. **INGREDIENTS MUST ALWAYS INCLUDE PRECISE MEASUREMENTS**: Every ingredient must have exact measurements in ounces (oz), dashes, teaspoons (tsp), or tablespoons (tbsp). Format: "2.0 oz Premium Vodka", "1.0 oz Fresh Lime Juice", "0.5 oz Simple Syrup", "2 dashes Angostura Bitters", "1 tsp Sugar", etc. NEVER use vague terms like "some", "a splash", "to taste", or "a dash" without a number.
5. **INSTRUCTIONS MUST BE COMPLETE AND DETAILED**: Include EVERY step from preparation to serving:
   - Glass preparation (rimming, chilling, warming)
   - Ingredient preparation (muddling, juicing, etc.)
   - Mixing method (shake, stir, build, muddle)
   - Timing (how long to shake/stir - e.g., "15-20 seconds", "30 seconds")
   - Straining method (Hawthorne strainer, fine strainer, etc.)
   - Garnishing (what, where, how)
   - Serving instructions (immediately, chilled, etc.)
   Write instructions as complete sentences separated by periods. Each sentence should be a distinct step.
6. **INSTRUCTIONS FORMAT**: Write instructions as a single string with multiple sentences. Each sentence should be a complete step. Example: "Chill a coupe glass by filling it with ice and water. Set aside. Fill a cocktail shaker with fresh ice cubes. Add 2.0 oz of premium vodka, 1.0 oz of fresh lime juice, and 0.5 oz of simple syrup to the shaker. Secure the lid and shake vigorously for 15-20 seconds until the shaker is cold to the touch. Discard the ice and water from the coupe glass. Strain the cocktail into the chilled coupe glass using a Hawthorne strainer. Garnish with a lime wedge on the rim of the glass. Serve immediately."
7. If the user has limited ingredients, be creative and suggest variations using those ingredients
8. **CRITICAL DRINK NAME REQUIREMENTS BY TYPE - STRICTLY ENFORCED**:
   - **"Classic" drinks (type: "Classic")**: 
     * MUST use ONLY REAL, POPULAR, WELL-KNOWN cocktail names that are ACTUALLY SOLD at bars and restaurants worldwide
     * MUST be standard drinks that bartenders recognize and customers regularly order
     * DO NOT create variations or custom names for Classic drinks
     * Valid examples: "Margarita", "Mojito", "Old Fashioned", "Cosmopolitan", "Manhattan", "Negroni", "Daiquiri", "Whiskey Sour", "Martini", "Moscow Mule", "Paloma", "Piña Colada", "Mai Tai", "Bloody Mary", "Mimosa", "Bellini", "Aperol Spritz", "Gin and Tonic", "Tom Collins", "Sidecar", "French 75", "Sazerac", "Mint Julep", "Caipirinha", "Pisco Sour", "White Russian", "Black Russian", "Long Island Iced Tea", "Sex on the Beach", "Tequila Sunrise", "Bahama Mama", "Zombie", "Hurricane", "Dark 'n Stormy", "Cuba Libre", "Gimlet", "Rusty Nail", "Godfather", "B-52", "Irish Coffee", "Hot Toddy", "Mulled Wine"
     * If you cannot match the ingredients to a real Classic drink, choose the closest match from the list above
   
   - **"Custom Fusion" drinks (type: "Custom Fusion")**:
     * MUST have UNIQUE, CREATIVE, ORIGINAL names that are NOT real cocktail names
     * MUST reflect the specific combination of ingredients provided
     * MUST be inventive and custom - think about the flavors, colors, or characteristics of the ingredients
     * Examples based on ingredients: If it has tropical fruits → "Tropical Fusion", "Island Paradise", "Caribbean Dream"
     * If it has citrus → "Citrus Burst", "Zesty Refresher", "Citrus Elegance"
     * If it has berries → "Berry Bliss", "Berry Fusion", "Mixed Berry Delight"
     * If it has coffee/espresso → "Midnight Zest", "Dark Roast Blend", "Espresso Fusion"
     * General creative examples: "Velvet Sunset", "Aurora Blend", "Stellar Mix", "Ocean Breeze", "Mountain Peak", "Crystal Fusion", "Cosmic Blend", "Ethereal Mix"
     * DO NOT use real cocktail names for Custom Fusion drinks
   
   - **"Seasonal" drinks (type: "Seasonal")**:
     * MUST have names that DIRECTLY reference a specific season (Spring, Summer, Fall/Autumn, or Winter)
     * The season name MUST appear in the drink name or be clearly implied
     * Spring examples: "Spring Garden Fizz", "Spring Blossom", "Spring Awakening", "Spring Rain", "Spring Breeze", "Spring Delight"
     * Summer examples: "Summer Breeze", "Summer Sunset", "Summer Solstice", "Summer Heat", "Summer Paradise", "Summer Cooler"
     * Fall/Autumn examples: "Autumn Spice", "Fall Harvest", "Autumn Leaves", "Fall Colors", "Autumn Warmth", "Fall Breeze"
     * Winter examples: "Winter Warmth", "Winter Wonderland", "Winter Frost", "Winter Night", "Winter Spice", "Winter Solstice"
     * The season should be OBVIOUS from the name - if someone reads the name, they should immediately know which season it represents

You MUST return ONLY valid JSON with this EXACT structure (no additional text before or after):
{
  "recipes": [
    {
      "name": "Margarita",
      "type": "Classic",
      "ingredients": ["2.0 oz Tequila", "1.0 oz Triple Sec", "1.0 oz Fresh Lime Juice", "Ice cubes", "Salt for rim", "1 Lime wedge for garnish"],
      "instructions": "Prepare a margarita glass by running a lime wedge around the rim. Dip the rim into a plate of salt to create a salt rim. Set the glass aside. Fill a cocktail shaker with fresh ice cubes. Add 2.0 oz of tequila, 1.0 oz of triple sec, and 1.0 oz of fresh lime juice to the shaker. Secure the lid and shake vigorously for 15 seconds until well chilled. Strain the cocktail into the prepared margarita glass using a Hawthorne strainer. Garnish with a lime wedge on the rim of the glass. Serve immediately.",
      "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80"
    },
    {
      "name": "Velvet Sunset",
      "type": "Custom Fusion",
      "ingredients": ["2.0 oz Gin", "1.0 oz Grapefruit Juice", "0.75 oz Honey Syrup", "2 dashes Angostura Bitters", "Ice cubes", "1 Grapefruit Peel for garnish"],
      "instructions": "Fill a mixing glass with fresh ice cubes. Add 2.0 oz of gin, 1.0 oz of grapefruit juice, 0.75 oz of honey syrup, and 2 dashes of Angostura bitters. Using a bar spoon, stir gently for 30 seconds to combine and chill the mixture. Fill a rocks glass with fresh ice cubes. Strain the stirred cocktail into the rocks glass over the ice. Cut a strip of grapefruit peel and express the oils over the surface of the drink by squeezing it. Drop the peel into the glass as garnish. Serve immediately.",
      "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80"
    },
    {
      "name": "Autumn Spice",
      "type": "Seasonal",
      "ingredients": ["2.0 oz Bourbon", "1.0 oz Apple Cider", "0.5 oz Maple Syrup", "2 dashes Cinnamon Bitters", "Ice cubes", "1 Cinnamon Stick for garnish"],
      "instructions": "Fill a cocktail shaker with fresh ice cubes. Add 2.0 oz of bourbon, 1.0 oz of apple cider, 0.5 oz of maple syrup, and 2 dashes of cinnamon bitters to the shaker. Secure the lid and shake well for 15 seconds until the mixture is well combined and chilled. Fill a lowball glass with fresh ice cubes. Strain the cocktail into the lowball glass over the ice using a Hawthorne strainer. Place a cinnamon stick in the glass as garnish. Perfect for autumn evenings. Serve immediately.",
      "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80"
    },
    {
      "name": "Mojito",
      "type": "Classic",
      "ingredients": ["2.0 oz White Rum", "1.0 oz Fresh Lime Juice", "0.75 oz Simple Syrup", "6-8 Fresh Mint Leaves", "Club Soda", "Ice cubes", "1 Mint sprig for garnish"],
      "instructions": "Lightly muddle the mint leaves with simple syrup in a highball glass. Add the rum and lime juice. Fill the glass with ice cubes. Top with club soda and stir gently. Garnish with a mint sprig. Serve immediately.",
      "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80"
    },
    {
      "name": "Summer Breeze",
      "type": "Seasonal",
      "ingredients": ["2.0 oz Rum", "1.0 oz Pineapple Juice", "0.5 oz Coconut Cream", "0.5 oz Lime Juice", "Ice cubes", "1 Pineapple wedge for garnish"],
      "instructions": "Fill a cocktail shaker with fresh ice cubes. Add 2.0 oz of rum, 1.0 oz of pineapple juice, 0.5 oz of coconut cream, and 0.5 oz of lime juice to the shaker. Secure the lid and shake well for 20 seconds until the coconut cream is fully incorporated and the mixture is chilled. Fill a hurricane glass with fresh ice cubes. Strain the cocktail into the hurricane glass over the ice using a Hawthorne strainer. Garnish with a pineapple wedge on the rim of the glass. Insert a straw into the glass. Serve immediately.",
      "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80"
    }
  ]
}

VALIDATION CHECKLIST - Before returning, verify each recipe has:
✓ "name": A cocktail name that STRICTLY matches the type requirements:
  - "Classic" type: MUST be a REAL, POPULAR cocktail name sold at bars/restaurants (e.g., "Margarita", "Mojito", "Old Fashioned", "Cosmopolitan", "Manhattan", "Negroni"). NO custom names, NO variations, ONLY real drink names.
  - "Custom Fusion" type: MUST be a UNIQUE, CREATIVE custom name that reflects the ingredients (e.g., "Velvet Sunset", "Aurora Blend", "Tropical Fusion"). MUST NOT be a real cocktail name.
  - "Seasonal" type: MUST include season name in the drink name (e.g., "Spring Garden Fizz", "Summer Breeze", "Autumn Spice", "Winter Warmth"). The season must be obvious from the name.
✓ "type": Exactly one of "Classic", "Custom Fusion", or "Seasonal" (string)
✓ "ingredients": Array of strings, each with precise measurements (e.g., ["2.0 oz Vodka", "1.0 oz Lime Juice"])
✓ "instructions": Complete string with all steps from glass prep to serving, written as sentences separated by periods
✓ "image": Valid Unsplash URL for cocktail images

CRITICAL VALIDATION RULES:
- Every ingredient MUST have a number and unit (oz, dash, tsp, tbsp, ml, cl)
- Instructions MUST be at least 3 sentences long, covering: preparation, mixing, straining, garnishing, serving
- Instructions MUST be written as a single string with sentences separated by periods
- Do NOT use numbered lists (1., 2., 3.) in instructions - use sentences instead
- Do NOT use bullet points (-) in instructions - use sentences instead
- Use the available ingredients provided by the user when possible
- You MUST return EXACTLY 5 recipes - count them before returning
- FINAL NAME VALIDATION - Before returning, verify:
  * All "Classic" drinks use REAL cocktail names (check against the provided list)
  * All "Custom Fusion" drinks have UNIQUE custom names (NOT real cocktail names)
  * All "Seasonal" drinks have season names (Spring/Summer/Fall/Winter must appear in name)
- Do NOT include any text before or after the JSON. Return ONLY the JSON object.`
            : `You are a professional mixologist assistant for MixIt, a cocktail recipe app. Help users with:
- Finding cocktail ingredients
- Answering questions about mixology, cocktail recipes, and techniques
- Providing creative drink ideas
- Explaining cocktail terminology

Be concise, helpful, and friendly.`
        },
        {
          role: "user",
          content: `${query}${ingredients && ingredients.length > 0 ? `\n\nAvailable ingredients: ${ingredients.map((i: { name: string }) => i.name).join(", ")}` : ""}`
        }
      ],
      max_tokens: isRecipeQuery ? 3000 : 300,
      temperature: 0.7,
      response_format: isRecipeQuery ? { type: "json_object" } : undefined
    });

    const response = completion.choices[0].message.content;

    // Try to parse as JSON if it's a recipe query
    if (isRecipeQuery && response) {
      try {
        const parsed = JSON.parse(response);
        return NextResponse.json({ response: parsed, isStructured: true }, { status: 200 });
      } catch (e) {
        // If parsing fails, return as text
        return NextResponse.json({ response, isStructured: false }, { status: 200 });
      }
    }

    return NextResponse.json({ response, isStructured: false }, { status: 200 });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    console.error("Error details:", {
      message: error?.message,
      type: error?.constructor?.name,
      stack: error?.stack,
      status: error?.status,
      code: error?.code
    });
    
    const errorMessage = error?.message || "Failed to process query. Please try again.";
    
    // Provide more helpful error messages based on error type
    let userFriendlyError = "Failed to process query. Please try again.";
    
    // Check for specific OpenAI API errors
    if (error?.status === 401 || errorMessage.includes("API key") || errorMessage.includes("authentication") || errorMessage.includes("Invalid API key")) {
      userFriendlyError = "OpenAI API key is invalid or not configured. Please check your OPENAI_API_KEY in .env.local file.";
    } else if (error?.status === 429 || errorMessage.includes("rate limit")) {
      userFriendlyError = "Rate limit exceeded. Please try again in a moment.";
    } else if (error?.status === 500 || errorMessage.includes("server error")) {
      userFriendlyError = "OpenAI server error. Please try again in a moment.";
    } else if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("ECONNREFUSED")) {
      userFriendlyError = "Network error. Please check your connection and try again.";
    } else if (errorMessage.includes("timeout")) {
      userFriendlyError = "Request timed out. Please try again.";
    } else if (!process.env.OPENAI_API_KEY) {
      userFriendlyError = "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.";
    }
    
    // In development, include more details
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? {
          message: errorMessage,
          status: error?.status,
          code: error?.code,
          type: error?.constructor?.name
        }
      : undefined;
    
    return NextResponse.json(
      { 
        error: userFriendlyError,
        ...(errorDetails && { details: errorDetails })
      },
      { status: 500 }
    );
  }
}

