const fs = require("fs");
const path = require("path");
const AI = require("../models/AI.js");
const Auth = require("../middleware/auth.js");

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