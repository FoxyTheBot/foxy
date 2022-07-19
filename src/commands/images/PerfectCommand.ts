import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { AttachmentBuilder } from "discord.js";
import * as Canvas from "canvas";

export default class PerfectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "perfect",
            description: "Who is the perfect person?",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("perfect")
                .setDescription("[Images] Who is the perfect person?")
                .addUserOption(option => option.setName("user").setDescription("Mention some user").setRequired(false))
        });
    }

    async execute(ctx, t): Promise<void> {
        const user = ctx.options.getUser("user");
        if (!user) return ctx.reply(t('commands:global.noUser'));
        const canvas = Canvas.createCanvas(467, 400);
        const imageContext = canvas.getContext("2d");

        let avatar: string;
        if (!user) {
            avatar = this.client.user.displayAvatarURL({ format: "png", size: 1024 });
        } else {
            avatar = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        }

        const background = await Canvas.loadImage('http://localhost:8080/memes/perfeito.png');
        imageContext.drawImage(background, 0, 0, 467, 400);

        const userAvatar = await Canvas.loadImage(avatar);
        imageContext.drawImage(userAvatar, 400 - 177, 30 + 20, 400 - 178, 400 - 179)

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "perfect.png" });

        await ctx.reply({ files: [attachment] });
    }
}