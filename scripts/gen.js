const axios = require('axios');

module.exports = {
  config: {
    name: "gen",
    version: "1.0",
    author: "Mahi--",
    category: "AI",
    role: 0,
  },
  annieStart: async function ({ bot, chatId, msg }) {
    try {
      const text = msg.text.split(' ').slice(1).join(' ');
      if (!text) {
        return bot.sendMessage(chatId, "Please provide a prompt.");
      }

      const waitingMessage = await bot.sendMessage(chatId, "✅ | Creating your Imagination...");
      const encodedPrompt = encodeURIComponent(text);
      
      // Request the image from the API
      const API = await axios.get(`https://hopelessmahi.onrender.com/api/image?prompt=${encodedPrompt}`, {
        responseType: 'arraybuffer', // Ensure the response is handled as an arraybuffer
      });

      // Convert the arraybuffer to a Buffer
      const buffer = Buffer.from(API.data, 'binary');

      if (buffer) {
        await bot.sendPhoto(chatId, { source: buffer }, { caption: `✅ | Image Generated\nPrompt: ${text}` });
      } else {
        await bot.sendMessage(chatId, "❌ | Image generation failed. Please try again.");
      }

      await bot.deleteMessage(chatId, waitingMessage.message_id); 
    } catch (error) {
      console.error(error);
      await bot.sendMessage(chatId, "❌ | An error occurred. Please try again later.");
    }
  }
};
