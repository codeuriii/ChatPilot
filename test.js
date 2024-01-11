
const OpenAI = require("openai");

const apiKey = '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';
const openai = new OpenAI({apiKey: apiKey});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
    
  });

  console.log(completion.choices[0]);
}

main();