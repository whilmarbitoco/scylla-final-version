const { OpenAI } = require("openai");
const https = require('https');
const fs = require('fs');

const openai = new OpenAI({ apiKey: process.env["OPEN_AI_KEY"] });

async function image(prompt, callback) {
  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
    });

    const imageUrl = image.data[0].url;
    const file = fs.createWriteStream('output.png');

    https.get(imageUrl, function(response) {
      response.pipe(file);

      response.on('end', () => {
        console.log("Image downloaded successfully");

        if (callback && typeof callback === 'function') {
          callback(null);
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);

    if (callback && typeof callback === 'function') {
      callback(error);
    }
  }
}


module.exports = image;