// Map ingredient names to specific Unsplash image URLs
export const getIngredientImage = (name: string): string => {
  const imageMap: Record<string, string> = {
    // ========== SPIRITS ==========
    "Vodka": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80",
    "Gin": "https://images.unsplash.com/photo-1608270586208-8d040b6b4e8c?w=400&h=400&fit=crop&q=80",
    "White Rum": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80",
    "Dark Rum": "https://images.unsplash.com/photo-1506721107471-bc417b44377a?w=400&h=400&fit=crop&q=80",
    "Spiced Rum": "https://images.unsplash.com/photo-1596601414062-87772173793d?w=400&h=400&fit=crop&q=80",
    "Tequila Blanco": "https://images.unsplash.com/photo-1517959105410-ee2260306f0a?w=400&h=400&fit=crop&q=80",
    "Tequila Reposado": "https://images.unsplash.com/photo-1582453231031-f75379b71652?w=400&h=400&fit=crop&q=80",
    "Mezcal": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80",
    "Bourbon": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80",
    "Rye Whiskey": "https://images.unsplash.com/photo-1608270586208-8d040b6b4e8c?w=400&h=400&fit=crop&q=80",
    "Scotch": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80",
    "Irish Whiskey": "https://images.unsplash.com/photo-1506721107471-bc417b44377a?w=400&h=400&fit=crop&q=80",
    "Brandy": "https://images.unsplash.com/photo-1596601414062-87772173793d?w=400&h=400&fit=crop&q=80",
    "Cognac": "https://images.unsplash.com/photo-1517959105410-ee2260306f0a?w=400&h=400&fit=crop&q=80",
    "Triple Sec": "https://images.unsplash.com/photo-1582453231031-f75379b71652?w=400&h=400&fit=crop&q=80",
    "Cointreau": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80",
    "Blue Curaçao": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80",
    "St-Germain": "https://images.unsplash.com/photo-1608270586208-8d040b6b4e8c?w=400&h=400&fit=crop&q=80",
    "Aperol": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80",
    "Campari": "https://images.unsplash.com/photo-1506721107471-bc417b44377a?w=400&h=400&fit=crop&q=80",
    "Amaretto": "https://images.unsplash.com/photo-1596601414062-87772173793d?w=400&h=400&fit=crop&q=80",
    "Kahlúa": "https://images.unsplash.com/photo-1517959105410-ee2260306f0a?w=400&h=400&fit=crop&q=80",
    "Baileys": "https://images.unsplash.com/photo-1582453231031-f75379b71652?w=400&h=400&fit=crop&q=80",
    "Sweet Vermouth": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80",
    "Dry Vermouth": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80",

    // ========== MIXERS ==========
    "Lemon Juice": "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80",
    "Lime Juice": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80",
    "Orange Juice": "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop&q=80",
    "Cranberry Juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
    "Pineapple Juice": "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80",
    "Grapefruit Juice": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80",
    "Tomato Juice": "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop&q=80",
    "Apple Cider": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
    "Club Soda": "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&q=80",
    "Tonic Water": "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&q=80",
    "Ginger Beer": "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80",
    "Ginger Ale": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80",
    "Cola": "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop&q=80",
    "Sprite": "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop&q=80",
    "Sparkling Wine": "https://images.unsplash.com/photo-1608270586208-8d040b6b4e8c?w=400&h=400&fit=crop&q=80",
    "Heavy Cream": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
    "Coconut Cream": "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80",
    "Egg White": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80",

    // ========== PANTRY ==========
    "Simple Syrup": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
    "Agave Nectar": "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80",
    "Honey Syrup": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80",
    "Grenadine": "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop&q=80",
    "Maple Syrup": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
    "Angostura Bitters": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80",
    "Orange Bitters": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80",
    "Peychaud's Bitters": "https://images.unsplash.com/photo-1608270586208-8d040b6b4e8c?w=400&h=400&fit=crop&q=80",
    "Salt": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&q=80",
    "Tajín": "https://images.unsplash.com/photo-1506721107471-bc417b44377a?w=400&h=400&fit=crop&q=80",
    "Tabasco": "https://images.unsplash.com/photo-1596601414062-87772173793d?w=400&h=400&fit=crop&q=80",
    "Worcestershire Sauce": "https://images.unsplash.com/photo-1517959105410-ee2260306f0a?w=400&h=400&fit=crop&q=80",
    "Sugar Cubes": "https://images.unsplash.com/photo-1582453231031-f75379b71652?w=400&h=400&fit=crop&q=80",

    // ========== GARNISHES ==========
    "Lemon Wedge": "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80",
    "Lime Wheel": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80",
    "Orange Peel": "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop&q=80",
    "Maraschino Cherries": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
    "Olives": "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80",
    "Cucumber Slices": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80",
    "Mint Leaves": "https://images.unsplash.com/photo-1628426370907-c33e9a0d34f9?w=400&h=400&fit=crop&q=80",
    "Basil": "https://images.unsplash.com/photo-1628426370907-c33e9a0d34f9?w=400&h=400&fit=crop&q=80",
    "Rosemary": "https://images.unsplash.com/photo-1628426370907-c33e9a0d34f9?w=400&h=400&fit=crop&q=80",
    "Cinnamon Stick": "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop&q=80",
    "Coffee Beans": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80",
  };

  // Fallback to aesthetic cocktail/ingredient images based on category
  const categoryFallbacks: Record<string, string> = {
    spirits: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=80", // Premium spirits aesthetic
    mixers: "https://images.unsplash.com/photo-1608500218807-3700600d32a9?w=400&h=400&fit=crop&q=80", // Fresh citrus aesthetic
    garnishes: "https://images.unsplash.com/photo-1628426370907-c33e9a0d34f9?w=400&h=400&fit=crop&q=80", // Fresh herbs aesthetic
    pantry: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80", // Bar tools aesthetic
  };

  // Try to find category from name
  const nameLower = name.toLowerCase();
  let category = "pantry"; // default
  
  if (nameLower.includes("vodka") || nameLower.includes("gin") || nameLower.includes("rum") || 
      nameLower.includes("whiskey") || nameLower.includes("bourbon") || nameLower.includes("tequila") ||
      nameLower.includes("mezcal") || nameLower.includes("brandy") || nameLower.includes("cognac") ||
      nameLower.includes("liqueur") || nameLower.includes("vermouth") || nameLower.includes("aperol") ||
      nameLower.includes("campari") || nameLower.includes("amaretto") || nameLower.includes("kahlua") ||
      nameLower.includes("baileys") || nameLower.includes("st-germain") || nameLower.includes("cointreau") ||
      nameLower.includes("triple sec") || nameLower.includes("curaçao")) {
    category = "spirits";
  } else if (nameLower.includes("juice") || nameLower.includes("soda") || nameLower.includes("tonic") ||
             nameLower.includes("ginger") || nameLower.includes("cola") || nameLower.includes("sprite") ||
             nameLower.includes("wine") || nameLower.includes("cream") || nameLower.includes("cider")) {
    category = "mixers";
  } else if (nameLower.includes("lemon") || nameLower.includes("lime") || nameLower.includes("orange") ||
             nameLower.includes("cherry") || nameLower.includes("olive") || nameLower.includes("cucumber") ||
             nameLower.includes("mint") || nameLower.includes("basil") || nameLower.includes("rosemary") ||
             nameLower.includes("peel") || nameLower.includes("wedge") || nameLower.includes("wheel")) {
    category = "garnishes";
  }

  return imageMap[name] || categoryFallbacks[category] || "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&q=80";
};
