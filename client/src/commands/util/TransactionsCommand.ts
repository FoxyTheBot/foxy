import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { createButton, createCustomId, createActionRow } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bot } from "../../index";
import { User } from "discordeno/transformers";
import { MessageFlags } from "../../utils/discord/Message";

const TransactionsCommand = createCommand({
    name: "transactions",
    nameLocalizations: {
        "pt-BR": "transações"
    },
    category: "economy",
    description: "[Economy] See your transactions",
    descriptionLocalizations: {
        "pt-BR": "[Economia] Veja suas transações"
    },
    options: [{
        name: "user",
        nameLocalizations: {
            "pt-BR": "usuário"
        },
        description: "[Economy] See the transactions of a user",
        descriptionLocalizations: {
            "pt-BR": "[Economia] Veja as transações de um usuário"
        },
        type: ApplicationCommandOptionTypes.User,
        required: false
    }],

    async execute(context, endCommand, t) {
        const user = context.getOption<User>('user', 'users') ?? context.author;
        const userData = await bot.database.getUser(user.id);
        context.sendDefer();
        if (!await userData.transactions.length) {
            return context.sendReply({
                content: t('commands:transactions.noTransactions'),
                flags: MessageFlags.EPHEMERAL
            }) && endCommand();
        }
        var transactionsTexts = [];

        for (const transaction of userData.transactions) {
            switch (transaction.type) {
                case 'daily': {
                    transactionsTexts.push(t('commands:transactions.dailyTransaction', { date: new Date(transaction.date).toLocaleDateString('pt-BR'), amount: transaction.quantity.toString() }))
                    break;
                }
                case 'addByAdmin': {
                    transactionsTexts.push(t('commands:transactions.addedByAdmin', { date: new Date(transaction.date).toLocaleDateString('pt-BR'), amount: transaction.quantity.toString() }))
                    break;
                }

                case 'send': {
                    transactionsTexts.push(t('commands:transactions.sentCakes', { date: new Date(transaction.date).toLocaleDateString('pt-BR'), amount: transaction.quantity.toString(), user: `@${(await bot.helpers.getUser(transaction.to)).username}` }))
                    break;
                }

                case 'receive': {
                    transactionsTexts.push(t('commands:transactions.receivedCakes', { date: new Date(transaction.date).toLocaleDateString('pt-BR'), amount: transaction.quantity.toString(), user: `@${(await bot.helpers.getUser(transaction.from)).username}` }))
                    break;
                }

                case 'store': {
                    transactionsTexts.push(t('commands:transactions.store', { date: new Date(transaction.date).toLocaleDateString('pt-BR'), amount: transaction.quantity.toString() }))
                    break;
                }
            }
        }

        const pageRow = createActionRow([createButton({
            label: t('commands:transactions.page', { page: '1' }),
            style: ButtonStyles.Primary,
            customId: createCustomId(0, context.author.id, context.commandId, 'previous', transactionsTexts)
        }), createButton({
            label: t('commands:transactions.page', { page: '2' }),
            style: ButtonStyles.Primary,
            customId: createCustomId(0, context.author.id, context.commandId, 'next', transactionsTexts)
        })
        ]);

        const transactions = transactionsTexts.reverse().slice(0, 10);
        const embed = createEmbed({
            title: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:transactions.title', { user: `@${user.username}` })),
            color: 0xfd446e,
            description: transactions.join('\n'),
        });

        if (transactionsTexts.length > 10) {
            return context.sendReply({
                embeds: [embed],
                components: [pageRow]
            });
        }
        
        return context.sendReply({
            embeds: [embed],
        });
    },
});

export default TransactionsCommand;