const Discord = require('discord.js');
const nekoslife = require('nekos.life');

const neko = new nekoslife();
module.exports = {
  name: 'pat',
  aliases: ['pat', 'cafuné'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.reply('lembre-se de mencionar um usuário válido para fazer cafuné!');
    }

    const img = await neko.sfw.pat();

    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} **fez cafuné em** ${user}`)
      .setImage(img.url)
      .setTimestamp()
      .setFooter('');
    await message.reply(`${message.author}`, embed);
  },

};
