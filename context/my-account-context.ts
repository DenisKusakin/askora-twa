import {createContext} from "react";
import {Address, OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";

export type AccountInfo = {
    price: bigint,
    description: string,
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

export const MyAccountContext = createContext<undefined | null | OpenedContract<Account>>(undefined)

export const TgConnectionStatus = createContext<{
    info: undefined | null | 'subscribed' | 'not-subscribed',
    refresh: () => void
}>({
    info: undefined, refresh: () => Promise<void>
})