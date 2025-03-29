const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const ingredients = requestBody.ingredients || [];
    const ingredientsString = ingredients.join(", ");

    // Set up Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.VITE_ANTHROPIC_API_KEY,

    });

    // Make request to Anthropic
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: "You are Chef Claude, a helpful cooking assistant who suggests recipes.",
      messages: [
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` }
      ],
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ recipe: msg.content[0].text })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};