import Command from '../../structures/command/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder } from 'discord.js';
import * as Canvas from 'canvas';

export default class PerfectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "our",
            description: "Get a comunism image",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("our")
                .setDescription("[Images] Get a comunism image")
                .addStringOption(option => option.setName("text").setDescription("The text").setRequired(true))
        });
    }

    async execute(ctx, t): Promise<void> {
        const content: string = ctx.options.getString("text");
        const canvas = Canvas.createCanvas(500, 400);
        const imageContext = canvas.getContext('2d');

        const background = await Canvas.loadImage('http://localhost:8080/memes/comunismo.png');
        imageContext.drawImage(background, 0, 0, canvas.width, canvas.height);

        imageContext.strokeStyle = '#74037b';
        imageContext.strokeRect(0, 0, canvas.width, canvas.height);

        imageContext.font = '28px sans-serif';
        imageContext.fillStyle = '#000000';
        imageContext.fillText(`${content}`, canvas.width / 15.5, canvas.height / 13.5);

        imageContext.beginPath();
        imageContext.arc(125, 125, 100, 6, Math.PI * 2, true);
        imageContext.closePath();
        imageContext.clip();

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "our.png" });
        await ctx.reply({ files: [attachment] });
    }
}