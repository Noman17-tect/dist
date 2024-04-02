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
export let PauseCommand = class PauseCommand extends BaseCommand {
    execute(ctx) {
        if (!ctx.guild?.queue?.playing) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__("commands.music.pause.alreadyPause"))
                ]
            });
        }
        ctx.guild.queue.playing = false;
        return ctx.reply({
            embeds: [
                createEmbed("success", `⏸ **|** ${i18n.__("commands.music.pause.pauseMessage")}`)
            ]
        });
    }
};
_ts_decorate([
    inVC,
    haveQueue,
    sameVC
], PauseCommand.prototype, "execute", null);
PauseCommand = _ts_decorate([
    Command({
        description: i18n.__("commands.music.pause.description"),
        name: "pause",
        slash: {
            options: []
        },
        usage: "{prefix}pause"
    })
], PauseCommand);
