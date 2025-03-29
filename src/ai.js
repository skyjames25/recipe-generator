// System prompt can still be helpful to document what the function expects
const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

// No need to import Anthropic or use the API key directly
export async function getRecipeFromChefClaude(ingredientsArr) {
  try {
    const ingredientsString = ingredientsArr.join(", ");
    
    // Call the Netlify serverless function instead of Anthropic directly
    const response = await fetch('/.netlify/functions/get-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ingredients: ingredientsArr,
        systemPrompt: SYSTEM_PROMPT  // Pass the system prompt to the serverless function
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.recipe;
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
}