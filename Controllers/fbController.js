const fs = require("fs");
const path = require("path");
const AI = require("../models/AI.js");
const Auth = require("../middleware/auth.js");
const axios = require("axios");
const { log } = require("console");

class FCA{
  constructor(api) {
    this.api = api;
    this.mid = "100051875203491";
    this.ai = new AI();
    this.auth = new Auth(this.mid);
    this.inQueueMsg = "Oppss... You're going too fast.";
  }

  // ===


  async test(event) {
    if (this.auth.check(event.senderID)) {
      this.api.sendMessage("ok", event.threadID,event.messageID);
    } else {
      this.api.sendMessage("queued", event.threadID,event.messageID);
    }
  }

  // ===
  async scylla(event) {
    
    if (this.auth.check(event.senderID)) {
      const prompt = event.body.substring(7);
      const response = await this.ai.ask(prompt);
      this.api.sendMessage(response, event.threadID, event.messageID); 
    } else {
      this.api.sendMessage(this.inQueueMsg, event.threadID,event.messageID);
    }
  }

  // ===

  async say(event) {
    if (this.auth.check(event.senderID)) { 
      const filePath = path.resolve(__dirname, '../tmp/speech.mp3');

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.log('err')
      }
      const prompt = event.body.substring(4);
      await this.ai.say(prompt);
      const attachment = fs.createReadStream(filePath);
      const message = { body: '', attachment: attachment };
      await this.api.sendMessage(message, event.threadID, event.messageID);
    } else {
      this.api.sendMessage(this.inQueueMsg, event.threadID, event.messageID);
    }
  }
  // ===
  async img(event) {
    if (this.auth.check(event.senderID)) {
      const imgPath = path.resolve(__dirname, '../tmp/output.png');

      try {
        fs.unlinkSync(imgPath);
      } catch (err) {
        console.log('err')
      }

      this.api.sendMessage("Please wait a few moments.", event.threadID, event.messageID);

      const prompt = event.body.substring(4);
      await this.ai.image(prompt, () => {
        const attachment = fs.createReadStream(imgPath);
        const message = { body: prompt, attachment: attachment }; 
        this.api.sendMessage(message, event.threadID, event.messageID);
      });

    } else {
      this.api.sendMessage(this.inQueueMsg, event.threadID, event.messageID);
    }
  }
  // ===
  async aleah(event) {
    if (this.auth.check(event.senderID)) {
      const filePath = path.resolve(__dirname, '../tmp/speech.mp3');

      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.log('err')
      }

      const prompt = event.body.substring(7);
      const response = await this.ai.ask(prompt);
      await this.ai.say(response);
      const attachment = fs.createReadStream(filePath);
      const message = { body: '', attachment: attachment };
      await this.api.sendMessage(message, event.threadID, event.messageID);
    } else {
      this.api.sendMessage(this.inQueueMsg, event.threadID, event.messageID);
    }
  }

  // ===
  async kick(event) {
       if (event.senderID === this.mid) {
          let id = Object.keys(event.mentions)[0]
          this.api.removeUserFromGroup(id, event.threadID, (err) => {
            if (err) console.log(err)
          })
        } else {
          this.api.sendMessage("Ehhh.. 😅", event.threadID, event.messageID);

        }
  }

  async music(query) {
  //  to be added
  }

  async german(event) {
    const response = await axios.get(`https://api.popcat.xyz/translate?to=de&text=${event.body.substring(7)}`)
    await this.api.sendMessage(response.data.translated, event.threadID, event.messageID);

  }

  async english(event) {
    const response = await axios.get(`https://api.popcat.xyz/translate?to=en&text=${event.body.substring(8)}`)
    await this.api.sendMessage(response.data.translated, event.threadID, event.messageID);

  }

  async lyrics(event) {
    const response = await axios.get(`https://api.popcat.xyz/lyrics?song=${event.body.substring(7)}`)
    await this.api.sendMessage(response.data.lyrics, event.threadID, event.messageID);

  }

  async meme(event) {
    const {data: {image}} = await axios.get("https://api.popcat.xyz/meme")

    const imgFile = path.resolve("./tmp/meme.png");

    const response = await axios.get(image, { responseType: 'stream' });
    const fileStream = fs.createWriteStream(imgFile);
    response.data.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });
    await this.api.sendMessage({ body: '', attachment: fs.createReadStream(imgFile)  }, event.threadID, event.messageID);


  }

  async github(event) {
    try {
      const { data: { avatar, name, location, email, bio, public_repos, public_gists, followers, following } } = await axios.get(`https://api.popcat.xyz/github/${event.body.substring(8)}`);
      const imgFile = path.resolve("./tmp/avatar.png");
      
      const response = await axios.get(avatar, { responseType: 'stream' });
      const fileStream = fs.createWriteStream(imgFile);
      response.data.pipe(fileStream);
  
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
  
      const message = {
        body: `Name: ${name} \nLocation: ${location} \nEmail: ${email} \nBIO: ${bio} \nREPO: ${public_repos} \nGIST: ${public_gists} \nFOLLOWERS: ${followers} \nFOLLOWING: ${following}`.trim(),
        attachment: fs.createReadStream(imgFile)
      };
  
      await this.api.sendMessage(message, event.threadID, event.messageID);
      console.log('Image sent successfully!');
    } catch (error) {
      console.error('Error:', error);
    }
   }  

  // ===
  async help(event) {
    let help = `
Scylla Bot: A chatbot that talks like a human.

Commands:
scylla <prompt> - Ask a question 
say <prompt> - Convert text to speech 
img <prompt> - Generate an image from text 
/help - Show this help message 

Created by Whilmar Bitoco
    `;

    this.api.sendMessage(help, event.threadID, event.messageID);
  }

  // ===
} 
module.exports = FCA;