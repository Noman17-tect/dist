function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
import { haveQueue, inVC, sameVC } from "../../utils/decorators/MusicUtil.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import i18n from "../../config/index.js";
import { ApplicationCommandOptionType } from "discord.js";
export let ShuffleCommand = class ShuffleCommand extends BaseCommand {
    execute(ctx) {
        const newState = ctx.options?.getString("state") ?? ctx.args[0];
        if (!newState) {
            void ctx.reply({
                embeds: [
                    createEmbed("info", `🔀 **|** ${i18n.__mf("commands.music.shuffle.actualState", {
                        state: `\`${ctx.guild?.queue?.shuffle ? "ENABLED" : "DISABLED"}\``
                    })}`)
                ]
            });
            return;
        }
        ctx.guild.queue.shuffle = newState === "enable";
        const isShuffle = ctx.guild?.queue?.shuffle;
        void ctx.reply({
            embeds: [
                createEmbed("success", `${isShuffle ? "🔀" : "▶"} **|** ${i18n.__mf("commands.music.shuffle.newState", {
                    state: `\`${isShuffle ? "ENABLED" : "DISABLED"}\``
                })}`)
            ]
        });
    }
};
_ts_decorate([
    inVC,
    haveQueue,
    sameVC
], ShuffleCommand.prototype, "execute", null);
ShuffleCommand = _ts_decorate([
    Command({
        description: i18n.__("commands.music.shuffle.description"),
        name: "shuffle",
        slash: {
            options: [
                {
                    choices: [
                        {
                            name: "ENABLE",
                            value: "enable"
                        },
                        {
                            name: "DISABLE",
                            value: "disable"
                        }
                    ],
                    description: i18n.__("commands.music.shuffle.description"),
                    name: "state",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: "{prefix}shuffle [enable | disable]"
    })
], ShuffleCommand);
