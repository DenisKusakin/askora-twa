import {createContext} from "react";
import {Address} from "@ton/core";

export type AccountInfo = {
    price: bigint,
    assignedCount: number,
    submittedCount: number,
    status: 'active' | 'non-active',
    address: Address
}

export const MyAccountInfoContext = createContext<{
    info: undefined | null | AccountInfo,
    refresh: () => void
}>({
    info: undefined, refresh: () => {
    }
})

export const TgConnectionStatus = createContext<{
    info: undefined | null | 'subscribed' | 'not-subscribed',
    refresh: () => void
}>({
    info: undefined, refresh: () => Promise<void>
})