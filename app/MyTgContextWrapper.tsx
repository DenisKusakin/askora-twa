'use client'

import {ReactNode, useState} from "react";
import {MyTgContext} from "@/app/context/tg-context";

export default function MyTgContextWrapper({children}: { children: ReactNode }){
    const [tgInfo, setTgInfo] = useState<undefined | null | {tgId: string, tgInitData: string}>(undefined)

    return <MyTgContext.Provider value={{info: tgInfo, setTgInfo: (info: {tgId: string, tgInitData: string} | null) => setTgInfo(info)}}>
        {children}
    </MyTgContext.Provider>
}