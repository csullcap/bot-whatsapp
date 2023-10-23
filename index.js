const gTTS = require("gtts");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const convertMP3 = require("./services/convertmp3");
const fs = require("node:fs/promises");
const fst = require("fs");
const { voiceToText } = require("./services/voiceToText");
const FormData = require("form-data");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("CLIENTE LISTO");
});

client.on("message", async (message) => {
  if (message.hasMedia) {
    const oggfile = `${process.cwd()}\\temp\\voice${Date.now()}.ogg`;
    const media = await message.downloadMedia();
    console.log(media.mimetype);
    if (media.mimetype.includes("audio/ogg")) {
      await fs.writeFile(oggfile, media.data, {
        encoding: "base64",
      });
      const mp3file = `${process.cwd()}\\temp\\voice${Date.now()}.mp3`;
      await convertMP3.convertOggMp3(oggfile, mp3file);
      const text = await voiceToText(mp3file);
      if (text == "") {
        message.reply("No se pudo convertir el audio a texto");
      } else {
        message.reply(text);
      }
      console.log(text);
    }
  }
  console.log(message.body);
});

client.initialize();
