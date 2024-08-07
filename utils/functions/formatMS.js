import { lang } from "../../config/index.js";
import { format, formatDuration, intervalToDuration } from "date-fns";
import * as locales from "date-fns/locale";
const key = Object.keys(locales).find((v)=>v.toLowerCase() === lang.toLowerCase());
const locale = key ? locales[key] : locales.enUS;
export function formatMS(ms) {
    if (isNaN(ms)) throw new Error("Value is not a number.");
    return formatDuration(intervalToDuration({
        start: 0,
        end: ms
    }), {
        locale
    });
}
export function formatTime(time) {
    if (isNaN(time)) throw new Error("Value is not a number.");
    return format(time, "P HH:mm", {
        locale
    });
}
