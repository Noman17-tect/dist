function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
import { parseHTMLElements } from "../../utils/functions/parseHTMLElements.js";
import { ButtonPagination } from "../../utils/structures/ButtonPagination.js";
import { haveQueue, inVC, sameVC } from "../../utils/decorators/MusicUtil.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import { chunk } from "../../utils/functions/chunk.js";
import i18n from "../../config/index.js";
import { ApplicationCommandOptionType, escapeMarkdown } from "discord.js";
export let RemoveCommand = class RemoveCommand extends BaseCommand {
    async execute(ctx) {
        const djRole = await this.client.utils.fetchDJRole(ctx.guild);
        if (this.client.data.data?.[ctx.guild.id]?.dj?.enable && this.client.channels.cache.get(ctx.guild?.queue?.connection?.joinConfig.channelId ?? "").members.size > 2 && !ctx.member?.roles.cache.has(djRole?.id ?? "") && !ctx.member?.permissions.has("ManageGuild")) {
            void ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.remove.noPermission"), true)
                ]
            });
            return;
        }
        const positions = (ctx.options?.getString("positions") ?? ctx.args.join(" ")).split(/[, ]/).filter(Boolean);
        if (!positions.length) {
            void ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__("commands.music.remove.noPositions"), true)
                ]
            });
            return;
        }
        const cloned = [
            ...ctx.guild.queue.songs.sortByIndex().values()
        ];
        const songs = positions.map((x)=>cloned[parseInt(x) - 1]).filter(Boolean);
        for (const song of songs){
            ctx.guild.queue.songs.delete(song.key);
        }
        const np = (ctx.guild?.queue?.player.state)?.resource?.metadata;
        const isSkip = songs.map((x)=>x.key).includes(np?.key ?? "");
        if (isSkip) {
            this.client.commands.get("skip")?.execute(ctx);
        }
        const opening = `${i18n.__mf("commands.music.remove.songsRemoved", {
            removed: songs.length
        })}`;
        const pages = await Promise.all(chunk(songs, 10).map(async (v, i)=>{
            const texts = await Promise.all(v.map((song, index)=>`${isSkip ? i18n.__("commands.music.remove.songSkip") : ""}${i * 10 + (index + 1)}.) ${escapeMarkdown(parseHTMLElements(song.song.title))}`));
            return texts.join("\n");
        }));
        const getText = (page)=>`\`\`\`\n${page}\`\`\``;
        const embed = createEmbed("info", getText(pages[0])).setAuthor({
            name: opening
        }).setFooter({
            text: `• ${i18n.__mf("reusable.pageFooter", {
                actual: 1,
                total: pages.length
            })}`
        });
        const msg = await ctx.reply({
            embeds: [
                embed
            ]
        }).catch(()=>undefined);
        if (!msg) return;
        void new ButtonPagination(msg, {
            author: ctx.author.id,
            edit: (i, e, p)=>{
                e.setDescription(getText(p)).setFooter({
                    text: `• ${i18n.__mf("reusable.pageFooter", {
                        actual: i + 1,
                        total: pages.length
                    })}`
                });
            },
            embed,
            pages
        }).start();
    }
};
_ts_decorate([
    inVC,
    haveQueue,
    sameVC
], RemoveCommand.prototype, "execute", null);
RemoveCommand = _ts_decorate([
    Command({
        description: i18n.__("commands.music.remove.description"),
        name: "remove",
        slash: {
            options: [
                {
                    description: i18n.__("commands.music.remove.slashPositionsDescription"),
                    name: "positions",
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ]
        },
        usage: i18n.__("commands.music.remove.usage")
    })
], RemoveCommand);
