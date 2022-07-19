import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import convertDate from "../../structures/ClientSettings";

export default class ServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: "server",
            description: "Get information about the server",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("server")
                .setDescription("[Utils] Get information about the server")
                .addSubcommand(option => option.setName("info").setDescription("[Utils] Get information about a Discord Server").addStringOption(
                    option => option.setName("id").setDescription("ID do servidor.").setRequired(false)))
                .addSubcommand(option => option.setName("icon").setDescription("[Utils] Get the server's icon").addStringOption(
                    option => option.setName("id").setDescription("ID do servidor.").setRequired(false)))
        });
    }

    async execute(ctx, t): Promise<void> {
        const subcommand = ctx.options.getSubcommand();

        let server = ctx.guild;
        if (ctx.options.getString("id")) {
            server = await this.client.guilds.cache.get(ctx.options.getString("id"));
            if (!server) return ctx.reply(`${this.client.emotes.error} **|** ${t("commands:server.notFound", { id: ctx.options.getString("id") })}`);
        }
        const owner = await this.client.users.fetch(server.ownerId);

        let partner = server.partnered;

        if (partner === false) partner = t("commands:server.no");
        else partner = t("commands:server.yes");

        let afk = server.afkChannel;
        if (!afk) afk = t("commands:server.no");

        switch (subcommand) {
            case "info": {
                const embed = new EmbedBuilder()
                    .setTitle(server.name)
                    .setThumbnail(server.iconURL())
                    .addFields(
                        { name: `:crown: ${t('commands:server.owner')}`, value: `\`${owner.tag}\``, inline: true },
                        { name: `:computer: ID`, value: `\`${server.id}\``, inline: true },
                        { name: `:calendar: ${t('commands:server.createdAt')}`, value: `${convertDate(server.createdTimestamp)}`, inline: true },
                        { name: `:star: ${t('commands:server.clientJoin')}`, value: `${convertDate(server.joinedTimestamp)}`, inline: true },
                        { name: `:speech_balloon: ${t('commands:server.channels')}`, value: `\`${server.channels.cache.size}\``, inline: true },
                        { name: `<a:impulso:756507043854024784> ${t('commands:server.premium')}:`, value: server.premiumSubscriptionCount.toString(), inline: true },
                        { name: `:busts_in_silhouette: ${t('commands:server.memberCount')}`, value: `\`${server.memberCount}\``, inline: true },
                        { name: `<a:sleeepy:803647820867174421> ${t('commands:server.partner')}`, value: `${partner}`, inline: true },
                        { name: `<a:sleeepy:803647820867174421> ${t('commands:server.afk')}`, value: `${afk}`, inline: true },
                        { name: ':computer: Shard ID', value: `\`${server.shardId + 1}\``, inline: true },
                    )

                await ctx.reply({ embeds: [embed] });
                break;
            }

            case "icon": {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(t("commands:server.click"))
                            .setStyle(ButtonStyle.Link)
                            .setURL(server.iconURL({ format: "png", size: 2048 }))
                    )
                const embed = new EmbedBuilder()
                    .setTitle(server.name)
                    .setImage(server.iconURL({ format: "png", size: 2048 }))

                await ctx.reply({ embeds: [embed], components: [row] });
                break;
            }
        }
    }
}