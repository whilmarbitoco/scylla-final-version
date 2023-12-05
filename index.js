const fs = require("fs");
const login = require("fca-unofficial");
const { port } = require("./views/server.js");
const FCA = require("./Controllers/fbController.js");


login(
  { appState: JSON.parse(fs.readFileSync("./config/appstate.json", "utf8")) },
  (err, api) => {
    if (err) return console.error(err);
    api.setOptions({ listenEvents: true, logLevel: "silent" });
    var listenEmitter = api.listen(async (err, event) => {
      if (err) return console.error(err);
      switch (event.type) {
        case "message":
          const fbController = new FCA(api);
          
          if (event.body.startsWith("scylla")) {
            fbController.scylla(event);
          }else if (event.body.startsWith("say")) {
            fbController.say(event);
          } else if (event.body.startsWith("img")) {
            fbController.img(event);
          } else if (event.body === "/help") {
            fbController.help(event);
          } else if (event.body.startsWith("aleah")) {
            fbController.aleah(event);
          } else if (event.body.startsWith("kick")) {
            fbController.kick(event);
          } else if (event.body == "test") {
            fbController.test(event);          
          } 

          break;
        case "event":
          console.log(event);
          break;
      }
    });
  }
);
