import {createContext} from "react";

export const AuthContext = createContext<{
    connect: () => Promise<void>,
    disconnect: () => Promise<void>,
    sponsoredTransactionsEnabled: boolean,
    setSponsoredTransactionsEnabled: (isEnabled: boolean) => void,
    updateTonProof: () => Promise<void>
}>({
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    sponsoredTransactionsEnabled: true,
    setSponsoredTransactionsEnabled: () => {},
    updateTonProof: () => Promise.resolve()
})