function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
import { botReqPerms, memberReqPerms } from "../../utils/decorators/CommonUtil.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import i18n from "../../config/index.js";
import { ApplicationCommandOptionType } from "discord.js";
export let PurgeCommand = class PurgeCommand extends BaseCommand {
    async execute(ctx) {
        const amount = Number(ctx.options?.getNumber("amount") ?? ctx.args.shift());
        if (isNaN(amount)) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.moderation.purge.invalidAmount"))
                ]
            });
        }
        if (!ctx.isInteraction()) {
            await ctx.context.delete();
        }
        const purge = await ctx.channel.bulkDelete(amount, true).catch((err)=>new Error(err));
        if (purge instanceof Error) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__mf("commands.moderation.purge.purgeFail", {
                        message: purge.message
                    }), true)
                ]
            });
        }
        await ctx.reply({
            embeds: [
                createEmbed("success", `🧹 **|** ${i18n.__mf("commands.moderation.purge.purgeSuccess", {
                    amount: purge.size
                })}`)
            ]
        }).then((msg)=>setTimeout(()=>msg.delete(), 3500));
    }
};
_ts_decorate([
    memberReqPerms([
        "ManageMessages"
    ], i18n.__("commands.moderation.purge.userNoPermission")),
    botReqPerms([
        "ManageMessages"
    ], i18n.__("commands.moderation.purge.botNoPermission"))
], PurgeCommand.prototype, "execute", null);
PurgeCommand = _ts_decorate([
    Command({
        description: i18n.__("commands.moderation.purge.description"),
        name: "purge",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.purge.slashAmountDescription"),
                    name: "amount",
                    required: true,
                    type: ApplicationCommandOptionType.Number
                }
            ]
        },
        usage: i18n.__("commands.moderation.purge.usage")
    })
], PurgeCommand);
