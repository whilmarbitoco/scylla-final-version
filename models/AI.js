const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
const https = require("https");

class AI {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env["OPEN_AI_KEY"] });
    this.prompt =
      "You are Scylla, a helpful personal AI assistant created by Wilmar Bitoco who's an 18 year old college student studying BSIT to assist him in various tasks. Programmed with advanced natural language processing capabilities, Scylla excels in providing efficient and intelligent support across a wide range of activities.";
  }

  // ===
  async ask(prompt) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: this.prompt,
        },
        { role: "assistant", content: prompt },
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  }

  // ===
  async say(prompt) {
    const speechFile = path.resolve("./tmp/speech.mp3");
    const mp3 = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: prompt,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
  }

// ===
  async image(prompt, callback) {
    try {
      const image = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
      });

      const imageUrl = image.data[0].url;
      const imgFile = path.resolve("./tmp/output.png");
      const file = fs.createWriteStream(imgFile);

      https.get(imageUrl, function(response) {
        response.pipe(file);

        response.on('end', () => {

          if (callback && typeof callback === 'function') {
            callback(null);
          }
        });
      });
    } catch (error) {
      if (callback && typeof callback === 'function') {
        callback(error);
      }
    }
  }
  // ===
}

 

module.exports = AI;
