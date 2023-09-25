const gTTS = require("gtts");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  var gtts = new gTTS(message.body, "es");
  var filename = "audio" + Date.now() + ".mp3";
  gtts.save(filename, function (err, result) {
    if (err) throw new Error(err);
    console.log("Text to speech converted!");
    const media = MessageMedia.fromFilePath(filename);
    message.reply(media);
  });
});

client.initialize();
