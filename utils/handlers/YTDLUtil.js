import ytdl, { exec } from "../../../yt-dlp-utils/index.js";
import { streamStrategy } from "../../config/index.js";
import { checkQuery } from "./GeneralUtil.js";
import { stream as pldlStream, video_basic_info } from "play-dl";
export async function getStream(client, url) {
    if (streamStrategy === "play-dl") {
        const isSoundcloudUrl = checkQuery(url);
        if (isSoundcloudUrl.sourceType === "soundcloud") {
            return client.soundcloud.util.streamTrack(url);
        }
        const rawPlayDlStream = await pldlStream(url, {
            discordPlayerCompatibility: true
        });
        return rawPlayDlStream.stream;
    }
    return new Promise((resolve, reject)=>{
        const stream = exec(url, {
            output: "-",
            quiet: true,
            format: "bestaudio",
            limitRate: "100K"
        }, {
            stdio: [
                "ignore",
                "pipe",
                "ignore"
            ]
        });
        if (!stream.stdout) {
            reject(Error("Unable to retrieve audio data from the URL."));
        }
        void stream.on("spawn", ()=>{
            resolve(stream.stdout);
        });
    });
}
export async function getInfo(url) {
    if (streamStrategy === "play-dl") {
        const rawPlayDlVideoInfo = await video_basic_info(url);
        return {
            duration: rawPlayDlVideoInfo.video_details.durationInSec * 1000,
            id: rawPlayDlVideoInfo.video_details.id,
            thumbnails: rawPlayDlVideoInfo.video_details.thumbnails,
            title: rawPlayDlVideoInfo.video_details.title,
            url: rawPlayDlVideoInfo.video_details.url
        };
    }
    return ytdl(url, {
        dumpJson: true
    });
}
