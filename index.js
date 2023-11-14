const ask = require("./ai.js");
const fs = require("fs");
const login = require("fca-unofficial");
const {port} = require('./server.js')



login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);

    api.setOptions({listenEvents: true, logLevel: "silent"});

    var listenEmitter = api.listen(async(err, event) => {
        if(err) return console.error(err);

        switch (event.type) {
            case "message":
            if (event.body.startsWith("/scylla")) {
    const prompt = event.body.substring(8);
    const response = await ask(prompt);
    api.sendMessage(response, event.threadID, event.messageID);
}
            case "event":
                console.log(event);
                break;
        }
    });
});