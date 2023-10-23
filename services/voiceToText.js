const fs = require("fs");
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});

const voiceToText = async (path) => {
  if (!fs.existsSync(path)) {
    throw new Error("No se encuentra el archivo");
  }

  try {
    const resp = await openai.audio.transcriptions.create({
      file: fs.createReadStream(path),
      model: "whisper-1",
    });
    return resp.text;
  } catch (err) {
    console.log(err);
    return "ERROR";
  }
};

module.exports = { voiceToText };
