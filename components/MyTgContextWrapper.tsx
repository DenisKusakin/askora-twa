'use client'

import {ReactNode, useState} from "react";
import {MyTgContext} from "@/context/tg-context";

export default function MyTgContextWrapper({children}: { children: ReactNode }) {
    const [tgInfo, setTgInfo] = useState<undefined | null | { tgId: string, tgInitData: string }>(undefined)
    const [startParam, setStartParam] = useState<{isLoading: boolean, startParam: null | string}>({isLoading: true, startParam: null})
    return <MyTgContext.Provider value={{
        info: tgInfo,
        startParam,
        setTgStartParam: (param: string | null) => setStartParam({isLoading: false, startParam: param}),
        setTgInfo: (info: { tgId: string, tgInitData: string } | null) => setTgInfo(info)
    }}>
        {children}
    </MyTgContext.Provider>
}