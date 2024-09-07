const axios = require('axios');

module.exports = {
  config: {
    name: "alldl",
    version: "1.0",
    author: "Mahi--",
    category: "MEDIA",
    role: 0,
  },
  onStart: async function ({ bot, msg, args }) {
    try {
      const url = args.join(" ");
      if (!url) {
        return bot.sendMessage(msg.chat.id, "Please provide a URL to download the media.");
      }

      const response = await axios.get(`https://throw-apis.onrender.com/scrape/download?url=${encodeURIComponent(url)}`);
      const batman = response.data;

      if (!batman.formats || batman.formats.length === 0) {
        return bot.sendMessage(msg.chat.id, "No formats available for this media.");
      }

      const format = batman.formats[0];
      const headers = { ...format.headers };

      if (format.cookies) {
        headers['Cookie'] = format.cookies;
      }

      const stream = await axios({
        method: 'get',
        url: format.url,
        headers: headers,
        responseType: 'stream'
      });

      await bot.sendMessage(msg.chat.id, 
        `• Title: ${batman.title}\n` +
        `• Source: ${batman.source}\n` +
        `• Duration: ${batman.duration}\n` +
        `• Format: ${format.format}\n` +
        `• Quality: ${format.quality}`, 
        { reply_to_message_id: msg.message_id }
      );

      await bot.sendVideo(msg.chat.id, { source: stream.data });

    } catch (error) {
      console.error(error);
      await bot.sendMessage(msg.chat.id, "An error occurred while trying to download the media.");
    }
  }
};
