const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.18",
    author: "Høpéléss mâhî",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View command usage, list all commands, search commands by the first letter, review stats or logs, and monitor specific actions",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName \n{pn} / help -s <letter> (to search commands by the first letter)\n{pn} / help -r <logs|usage> (to review logs or usage)\n{pn} / help -m <start|stop|status> <target> (to monitor specific actions)",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      let msg = `━━━ 👽 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 👽 ━━━\n\n`;

      const categories = {};

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      for (const category in categories) {
        msg += `╭──『  ${category.toUpperCase()} 』\n`;
        msg += ` ✧${categories[category].sort().join(' ✧ ')}\n`;
        msg += `╰────────────◊\n\n`;
      }

      const totalCommands = commands.size;
      msg += `━━━ 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗕𝗢𝗫 ━━━\n`;
      msg += `Join Ancestor Bot Zone ❈ Support Box type: ${prefix}supportgc or type: ${prefix}callad to contact with admins.\n\n`;
      msg += `⇒ Total: ${totalCommands} commands\n`;
      msg += `⇒ Use ${prefix}help <cmd> to get more information`;

      await message.reply(msg);

    } else if (args[0] === "-s" && args[1]) {
      const searchLetter = args[1].toLowerCase();
      let msg = `━━━ 👽 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 👽 ━━━\n\n`;

      const searchResults = [];
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        if (name.startsWith(searchLetter)) {
          searchResults.push(name);
        }
      }

      if (searchResults.length > 0) {
        msg += `Found ${searchResults.length} command(s) starting with "${searchLetter.toUpperCase()}":\n`;
        msg += searchResults.sort().join(" ✧ ");
      } else {
        msg += `No commands found starting with "${searchLetter.toUpperCase()}".`;
      }

      await message.reply(msg);

    } else if (args[0] === "-r" && args[1]) {
      const reviewType = args[1].toLowerCase();
      let msg = `━━━ 👽 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 👽 ━━━\n\n`;

      if (reviewType === "logs") {
        msg += `Here are the latest logs:\n[Log details...]\n`;
      } else if (reviewType === "usage") {
        msg += `Usage statistics:\n[Usage details...]\n`;
      } else {
        msg += `Invalid review type "${reviewType}". Use "logs" or "usage".`;
      }

      await message.reply(msg);

    } else if (args[0] === "-m" && args[1]) {
      const monitorAction = args[1].toLowerCase();
      let msg = `━━━ 👽 𝗔𝗡𝗖𝗛𝗘𝗦𝗧𝗢𝗥 𝗔𝗜 👽 ━━━\n\n`;

      if (monitorAction === "start" && args[2]) {
        msg += `Started monitoring ${args[2]}.\n`;
      } else if (monitorAction === "stop" && args[2]) {
        msg += `Stopped monitoring ${args[2]}.\n`;
      } else if (monitorAction === "status") {
        msg += `Current monitoring status:\n[Monitoring details...]\n`;
      } else {
        msg += `Invalid monitor action "${monitorAction}". Use "start", "stop", or "status".`;
      }

      await message.reply(msg);

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription
          ? configCommand.longDescription.en || "No description"
          : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{pn}/g, prefix).replace(/{cmdName}/g, configCommand.name);

        const response = `╭── NAME ───⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ Version: ${configCommand.version || "1.0"}
  │ Role: ${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: ${author}
  ├── Usage
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is a or b or c
  ╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
