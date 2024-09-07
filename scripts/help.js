const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "help",
        version: "1.0",
        author: "Mahi",
        category: "UTILITY",
        role: 0,
    },
    annieStart: async function({ bot, msg, match }) {
        const chatId = msg.chat.id;
        const commandName = match ? match[1].trim() : null;

        if (!commandName) {
            const categories = {};
            const uncategorized = [];

            const scriptFiles = fs.readdirSync(__dirname)
                .filter(file => file.endsWith('.js') && !file.endsWith('.eg.js') && file !== 'help.js');

            scriptFiles.forEach(file => {
                const scriptPath = path.join(__dirname, file);
                const { config } = require(scriptPath);
                if (config && config.category) {
                    if (!categories[config.category]) {
                        categories[config.category] = [];
                    }
                    categories[config.category].push(file.replace('.js', ''));
                } else {
                    uncategorized.push(file.replace('.js', ''));
                }
            });

            let message = '';
            let totalCommands = 0;

            for (const category in categories) {
                message += `╭──『 ${category.toUpperCase()} 』\n`;
                let commandCount = 0;
                for (let i = 0; i < categories[category].length; i++) {
                    if (commandCount === 3) {
                        message += '\n';
                        commandCount = 0; 
                    }
                    message += `✧${categories[category][i]} `;
                    commandCount++;
                }
                message += '\n';
                message += '╰───────────◊\n';
                totalCommands += categories[category].length;
            }

            if (uncategorized.length > 0) {
                message += `╭──『 UNCATEGORIZED 』\n`;
                let commandCount = 0;
                for (let i = 0; i < uncategorized.length; i++) {
                    if (commandCount === 3) {
                        message += '\n'; 
                        commandCount = 0; 
                    }
                    message += `✧${uncategorized[i]} `;
                    commandCount++;
                }
                message += '\n';
                message += '╰───────────◊\n';
                totalCommands += uncategorized.length;
            }

            message += '╭────────────◊\n';
            message += `│ » Total commands: ${totalCommands}\n`;
            message += `│ » A Powerful Telegram bot\n`;
            message += `│ » By Mahi\n`;
            message += '╰────────◊\n';
            message += '「 Anchestor 👽 」';

            bot.sendMessage(chatId, message);
        } else {
            const scriptPath = path.join(__dirname, `${commandName}.js`);
            if (fs.existsSync(scriptPath)) {
                const { config } = require(scriptPath);
                if (config && typeof config === 'object') {
                    const { name, version, author, role, category } = config;
                    const message = `╭── NAME ───⭓\n` +
                        `│ ${name}\n` +
                        `├── INFO\n` +
                        `│ Version: ${version}\n` +
                        `│ Author: ${author}\n` +
                        `│ Can use: ${role}\n` +
                        `│ Category: ${category || 'Uncategorized'}\n` +
                        `╰━━━━━━━❖`;

                    bot.sendMessage(chatId, message);
                } else {
                    bot.sendMessage(chatId, `No config available for ${commandName}.`);
                }
            } else {
                bot.sendMessage(chatId, `Command ${commandName} not found.`);
            }
        }
    }
};
