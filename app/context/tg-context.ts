import {createContext} from "react";

export const MyTgContext = createContext<{
    info: {
        tgId: string,
        tgInitData: string
    } | undefined | null
    setTgInfo: (info: {tgId: string, tgInitData: string} | null) => void
}>({info: undefined, setTgInfo: () => {}})