function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
import { ButtonPagination } from "../../utils/structures/ButtonPagination.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { haveQueue } from "../../utils/decorators/MusicUtil.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import { chunk } from "../../utils/functions/chunk.js";
import i18n from "../../config/index.js";
export let QueueCommand = class QueueCommand extends BaseCommand {
    async execute(ctx) {
        const np = ctx.guild.queue.player.state.resource.metadata;
        const full = ctx.guild.queue.songs.sortByIndex();
        const songs = ctx.guild?.queue?.loopMode === "QUEUE" ? full : full.filter((val)=>val.index >= np.index);
        const pages = await Promise.all(chunk([
            ...songs.values()
        ], 10).map(async (s, n)=>{
            const names = await Promise.all(s.map((song, i)=>{
                const npKey = np.key;
                const addition = song.key === npKey ? "**" : "";
                return `${addition}${n * 10 + (i + 1)} - [${song.song.title}](${song.song.url})${addition}`;
            }));
            return names.join("\n");
        }));
        const embed = createEmbed("info", pages[0]).setThumbnail(ctx.guild.iconURL({
            extension: "png",
            size: 1024
        }));
        const msg = await ctx.reply({
            embeds: [
                embed
            ]
        });
        return new ButtonPagination(msg, {
            author: ctx.author.id,
            edit: (i, e, p)=>e.setDescription(p).setFooter({
                    text: i18n.__mf("reusable.pageFooter", {
                        actual: i + 1,
                        total: pages.length
                    })
                }),
            embed,
            pages
        }).start();
    }
};
_ts_decorate([
    haveQueue
], QueueCommand.prototype, "execute", null);
QueueCommand = _ts_decorate([
    Command({
        aliases: [
            "q"
        ],
        description: i18n.__("commands.music.queue.description"),
        name: "queue",
        slash: {
            options: []
        },
        usage: "{prefix}queue"
    })
], QueueCommand);
