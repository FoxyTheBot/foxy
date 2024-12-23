package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.RateWaifuExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class RateWaifuCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "ratewaifu",
        "ratewaifu.description"
    ) {
        subCommand(
            "rate",
            "ratewaifu.rate.description",
            baseName = this@command.name,

            block = {
                executor = RateWaifuExecutor()

                addOption(
                    OptionData(
                        OptionType.USER,
                        "user",
                        "ratewaifu.user.description",
                        true
                    ),
                    baseName = this@command.name
                )
            }
        )
    }
}