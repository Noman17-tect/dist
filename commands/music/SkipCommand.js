function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
import { haveQueue, inVC, sameVC } from "../../utils/decorators/MusicUtil.js";
import { OperationManager } from "../../utils/structures/OperationManager.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import i18n from "../../config/index.js";
export let SkipCommand = class SkipCommand extends BaseCommand {
    async execute(ctx) {
        const djRole = await this.client.utils.fetchDJRole(ctx.guild).catch(()=>null);
        const song = ctx.guild.queue.player.state.resource.metadata;
        function ableToSkip(member) {
            return member.roles.cache.has(djRole?.id ?? "") || member.permissions.has("ManageGuild") || song.requester.id === member.id;
        }
        if (!ableToSkip(ctx.member)) {
            const required = this.client.utils.requiredVoters(ctx.guild.members.me.voice.channel.members.size);
            if (ctx.guild?.queue?.skipVoters.includes(ctx.author.id)) {
                await this.manager.add(()=>{
                    ctx.guild.queue.skipVoters = ctx.guild.queue.skipVoters.filter((x)=>x !== ctx.author.id);
                    return undefined;
                });
                await ctx.reply(i18n.__mf("commands.music.skip.voteResultMessage", {
                    length: ctx.guild.queue.skipVoters.length,
                    required
                }));
                return;
            }
            await this.manager.add(()=>{
                ctx.guild?.queue?.skipVoters.push(ctx.author.id);
                return undefined;
            });
            const length = ctx.guild.queue.skipVoters.length;
            await ctx.reply(i18n.__mf("commands.music.skip.voteResultMessage", {
                length,
                required
            }));
            if (length < required) return;
        }
        if (!ctx.guild?.queue?.playing) ctx.guild.queue.playing = true;
        ctx.guild?.queue?.player.stop(true);
        void ctx.reply({
            embeds: [
                createEmbed("success", `⏭ **|** ${i18n.__mf("commands.music.skip.skipMessage", {
                    song: `[${song.song.title}](${song.song.url}})`
                })}`).setThumbnail(song.song.thumbnail)
            ]
        }).catch((e)=>this.client.logger.error("SKIP_CMD_ERR:", e));
    }
    constructor(...args){
        super(...args);
        _define_property(this, "manager", new OperationManager());
    }
};
_ts_decorate([
    inVC,
    haveQueue,
    sameVC
], SkipCommand.prototype, "execute", null);
SkipCommand = _ts_decorate([
    Command({
        aliases: [
            "s"
        ],
        description: i18n.__("commands.music.skip.description"),
        name: "skip",
        slash: {
            options: []
        },
        usage: "{prefix}skip"
    })
], SkipCommand);
