const { OpenAI } = require("openai")

const openai = new OpenAI({apiKey: process.env['OPEN_AI_KEY'] });

async function ask(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are Scylla a helpful peronsal AI assistant created by Whilmar Bitoco to help him various task." },
      {role: "assistant", content: prompt}
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

module.exports = ask;