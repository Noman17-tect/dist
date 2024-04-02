function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
import { inVC, sameVC, validVC } from "../../utils/decorators/MusicUtil.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import i18n from "../../config/index.js";
export let StopCommand = class StopCommand extends BaseCommand {
    execute(ctx) {
        ctx.guild?.queue?.stop();
        ctx.guild.queue.lastMusicMsg = null;
        ctx.reply({
            embeds: [
                createEmbed("success", `⏹ **|** ${i18n.__("commands.music.stop.stoppedMessage")}`)
            ]
        }).catch((e)=>this.client.logger.error("STOP_CMD_ERR:", e));
    }
};
_ts_decorate([
    inVC,
    validVC,
    sameVC
], StopCommand.prototype, "execute", null);
StopCommand = _ts_decorate([
    Command({
        aliases: [
            "disconnect",
            "dc"
        ],
        description: i18n.__("commands.music.stop.description"),
        name: "stop",
        slash: {
            options: []
        },
        usage: "{prefix}stop"
    })
], StopCommand);
