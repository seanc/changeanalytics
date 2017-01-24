const Client = require('discord.js').Client;
const glob = require('require-glob');

function start(config) {
  const bot = new Client();
  bot.on('ready', () => console.log('Started'));

  glob(['./{commands,listeners}/**/*.js']).then(modules => {
    const scripts = Object.keys(modules).map(key => modules[key]);
    const commands = bot._commands = new Map();

    scripts.forEach(script => {
      script = script[Object.keys(script)[0]]
      const run = script(bot, config);
      if (run && script.command) {
        commands.set(script.command, run);
      }
    });

    bot.on('message', message => {
      if (message.content.startsWith(config.prefix) && message.author.discriminator !== bot.user.discriminator) {
        const args = message.content.slice(config.prefix.length).split(' ');
        const command = args.shift();

        if (commands.has(command)) {
          commands.get(command)(message, args);
        }
      }
    })
  }).catch(err => console.log(err));

  bot.login(config.token);
}

module.exports = start
