import {Address} from "@ton/core";

export function userFriendly(addr: Address): string {
    const str = addr.toString({testOnly: false, bounceable: true})
    const left = str.substring(0, 4)
    const right = str.substring(str.length - 4, str.length)

    return `${left}...${right}`
}

export function userFriendlyStr(str: string): string {
    const left = str.substring(0, 8)
    const right = str.substring(str.length - 8, str.length)

    return `${left}...${right}`
}