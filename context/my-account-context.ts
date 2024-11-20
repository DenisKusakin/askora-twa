import {createContext} from "react";
import {Address} from "@ton/core";

export type AccountInfo = {
    price: bigint,
    description: string,
    assignedCount: number,
    submittedCount: number,
    status: 'active' | 'non-active',
    address: Address
}

export const TgConnectionStatus = createContext<{
    info: undefined | null | 'subscribed' | 'not-subscribed',
    refresh: () => void
}>({
    info: undefined, refresh: () => Promise<void>
})