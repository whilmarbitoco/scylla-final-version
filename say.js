const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env["OPEN_AI_KEY"] });



async function say(prompt, filename) {
  const speechFile = path.resolve("./speech.mp3");
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: prompt,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

module.exports = say;