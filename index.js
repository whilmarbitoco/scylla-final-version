const fs = require("fs");
const login = require("fca-unofficial");
const { port } = require("./server.js");
const queue = require("./queue.js");
const ask = require("./ask.js");
const say = require("./say.js");
const image = require("./image.js");

login(
  { appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) },
  (err, api) => {
    if (err) return console.error(err);

    api.setOptions({ listenEvents: true, logLevel: "silent" });

    var listenEmitter = api.listen(async (err, event) => {
      if (err) return console.error(err);

      switch (event.type) {
        case "message":
          if (event.senderID === "100051875203491") {
            api.setMessageReaction(":love:", event.messageID);
          } else {
            console.log("hello")
          }
          
          if (event.body.startsWith("/scylla")) {
            let isQueue = queue(event.senderID);
            if (!isQueue) {
              const prompt = event.body.substring(8);
              const response = await ask(prompt);
              api.sendMessage(response, event.threadID, event.messageID);
            } else {
              api.sendMessage(
                "Oppss... You're going too fast.",
                event.threadID,
                event.messageID
              );
            }
          } else if (event.body.startsWith("/say")) {
            let isQueue = queue(event.senderID);
            if (!isQueue) {
              const prompt = event.body.substring(5);
              await say(prompt);
              const audioFilePath = __dirname + '/speech.mp3';
              const attachment = fs.createReadStream(audioFilePath);
              const message = {
                body: '',
                attachment: attachment
              };

              await api.sendMessage(message, event.threadID, event.messageID);
            } else {
              api.sendMessage(
                "Oppss... You're going too fast.",
                event.threadID,
                event.messageID
              );
            }
          } else if (event.body.startsWith("/img")) {
            let isQueue = queue(event.senderID);
            if (!isQueue) {
              api.sendMessage("Please wait a few moments.", event.threadID, event.messageID);
              const prompt = event.body.substring(5);
              await image(prompt, () => {
                const imagepath = __dirname + '/output.png';
                const attachment = fs.createReadStream(imagepath);
                const message = {
                  body: prompt,
                  attachment: attachment
                }; 
                
                 api.sendMessage(message, event.threadID, event.messageID);
              });
      
                } else {
              api.sendMessage(
                "Oppss... You're going too fast.",
                event.threadID,
                event.messageID
              );
            }
          } 
          
          break;
        case "event":
          console.log(event);
          break;
      }
    });
  }
);
