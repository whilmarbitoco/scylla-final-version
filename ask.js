const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env["OPEN_AI_KEY"] });

async function ask(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are Scylla, a helpful personal AI assistant created by Wilmar Bitoco to assist him in various tasks. Programmed with advanced natural language processing capabilities, Scylla excels in providing efficient and intelligent support across a wide range of activities.",
      },
      { role: "assistant", content: prompt },
    ],
    model: "gpt-3.5-turbo",
  });
  
  return completion.choices[0].message.content;
}

module.exports = ask;

