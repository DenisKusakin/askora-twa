import {createContext} from "react";

export const MyTgContext = createContext<{
    info: {
        tgId: string,
        tgInitData: string
    } | undefined | null,
    startParam: {isLoading: boolean, startParam:  string | null},
    setTgInfo: (info: { tgId: string, tgInitData: string } | null) => void
    setTgStartParam: (param: string) => void
}>({
    info: undefined,
    setTgInfo: () => {
    },
    startParam: {
        isLoading: true,
        startParam: null
    },
    setTgStartParam: () => {

    }
})