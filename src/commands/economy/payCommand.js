module.exports = {
  name: 'pay',
  aliases: ['pay', 'pagar'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message, args) {
    const db = require('quick.db');
    const user = message.mentions.members.first();

    const member = db.fetch(`coins_${message.author.id}`);

    if (user == message.author.id) return message.reply('Você não pode transferir coins para si mesmo');
    if (!user) {
      return message.reply('Mencione alguém que deseja transferir seus coins');
    }
  
    if (isNaN(args[1])) return message.reply('Digite números válidos!');
  
    if (!args[1]) {
      return message.reply('Especifique uma quantidade para ser transferida');
    }

    if (message.content.includes('-')) {
      return message.reply('Você não pode transferir coins negativas');
    }

    const fetchValue = db.fetch(`coins_${message.author.id}`);

    if (args[1] > fetchValue) return message.reply('Você não tem coins suficiente');

    message.reply(`Você quer mesmo transferir ${args[1]} FoxCoins para ${user.user}?`).then((sentMessage) => {
      sentMessage.react('✅');
      const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
      sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then((collected) => {
          message.reply(`Você transferiu ${args[1]} FoxCoins para ${user.user}`);

          db.add(`bal_${user.id}`, args[1]);
          db.subtract(`coins_${message.author.id}`, args[1]);
        });
    });
  },
};
