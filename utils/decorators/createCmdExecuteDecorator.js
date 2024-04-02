import { createMethodDecorator } from "./createMethodDecorator.js";
export function createCmdExecuteDecorator(func) {
    return createMethodDecorator(func);
}
