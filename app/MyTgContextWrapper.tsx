'use client'

import {ReactNode, useState} from "react";
import {MyTgContext} from "@/app/context/tg-context";

export default function MyTgContextWrapper({children}: { children: ReactNode }){
    const [tgId, setTgId] = useState<undefined | null | string>(undefined)

    return <MyTgContext.Provider value={{tgId, setTgId: (id: string | null) => setTgId(id)}}>
        {children}
    </MyTgContext.Provider>
}