import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";

export default class MarryCommand extends Command {
    constructor(client) {
        super(client, {
            name: "marry",
            description: "Marry with love of your life",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("marry")
                .setDescription("[👥 Social] Marry with love of your life")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("The user to marry"))
        });
    }

    async execute(interaction, t) {
        const mentionedUser = await interaction.options.getUser("user");

        if (mentionedUser === interaction.user) return interaction.editReply(t("commands:marry.self"));
        const authorData = await this.client.database.getUser(interaction.user.id);
        if (authorData.marriedWith) return interaction.editReply(t("commands:marry.alreadyMarried", { user: mentionedUser }));
        if (mentionedUser === this.client.user) return interaction.editReply(t('commands:marry.bot'));
        if (mentionedUser.id === authorData.marriedWith) return interaction.editReply(t('commands:marry.alreadyMarriedWithUser', { user: mentionedUser }));

        const userData = await this.client.database.getUser(mentionedUser.id);
        if (userData.marriedWith) return interaction.editReply(t("commands:marry.alreadyMarriedWithSomeone"));

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setLabel(t("commands:marry.accept"))
                    .setStyle("SUCCESS"),
            )
        interaction.editReply({ content: `${this.client.emotes.heart} | ${t('commands:marry.ask', { user: mentionedUser.username, author: interaction.user })}`, components: [row] });

        const filter = i => i.customId === "accept" && i.user.id === interaction.user.id;
        const collector = await interaction.channel.createMessageComponentCollector(filter, { max: 1, time: 60000 });

        collector.on("collect", async i => {
            i.deferUpdate();
            i.followUp(`${this.client.emotes.success} | ${t('commands:marry.accepted')}`);
            userData.marriedWith = interaction.user.id;
            userData.marriedDate = new Date();
            authorData.marriedWith = mentionedUser.id;
            authorData.marriedDate = new Date();
            await userData.save();
            await authorData.save();
        });
    }
}