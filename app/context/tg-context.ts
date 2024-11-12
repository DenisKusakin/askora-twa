import {createContext} from "react";

export const MyTgContext = createContext<{
    tgId: undefined | null | string,
    setTgId: (id: null | string) => void
}>({tgId: undefined, setTgId: () => {}})