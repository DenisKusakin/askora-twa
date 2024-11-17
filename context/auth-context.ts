import {createContext} from "react";

export const AuthContext = createContext<{
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    sponsoredTransactionsEnabled: boolean,
    canUseSponsoredTransactions: boolean,
    setSponsoredTransactionsEnabled: (isEnabled: boolean) => void,
    updateTonProof: () => Promise<void>
}>({
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    sponsoredTransactionsEnabled: true,
    canUseSponsoredTransactions: false,
    setSponsoredTransactionsEnabled: () => {},
    updateTonProof: () => Promise.resolve()
})