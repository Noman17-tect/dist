function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
import { ButtonPagination } from "../../utils/structures/ButtonPagination.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import { chunk } from "../../utils/functions/chunk.js";
import i18n from "../../config/index.js";
import { ApplicationCommandOptionType } from "discord.js";
export let LyricsCommand = class LyricsCommand extends BaseCommand {
    execute(ctx) {
        const query = // eslint-disable-next-line no-nested-ternary
        ctx.args.length >= 1 ? ctx.args.join(" ") : ctx.options?.getString("query") ? ctx.options.getString("query") : ((ctx.guild?.queue?.player.state).resource?.metadata)?.song.title;
        if (!query) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.lyrics.noQuery"), true)
                ]
            });
        }
        this.getLyrics(ctx, query);
    }
    getLyrics(ctx, song) {
        const url = `https://api.lxndr.dev/lyrics?song=${encodeURI(song)}&from=DiscordRawon`;
        this.client.request.get(url).json().then(async (data)=>{
            if (data.error) {
                return ctx.reply({
                    embeds: [
                        createEmbed("error", i18n.__mf("commands.music.lyrics.apiError", {
                            song: `\`${song}\``,
                            message: `\`${data.message}\``
                        }), true)
                    ]
                });
            }
            const albumArt = data.album_art ?? "https://cdn.clytage.org/images/icon.png";
            const pages = chunk(data.lyrics, 2048);
            const embed = createEmbed("info", pages[0]).setAuthor({
                name: data.song && data.artist ? `${data.song} - ${data.artist}` : song.toUpperCase()
            }).setThumbnail(albumArt);
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
        }).catch((error)=>console.error(error));
    }
};
LyricsCommand = _ts_decorate([
    Command({
        aliases: [
            "ly",
            "lyric"
        ],
        description: i18n.__("commands.music.lyrics.description"),
        name: "lyrics",
        slash: {
            options: [
                {
                    description: i18n.__("commands.music.lyrics.slashDescription"),
                    name: "query",
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        usage: i18n.__("commands.music.lyrics.usage")
    })
], LyricsCommand);
