import {ReactNode, useCallback, useContext, useState} from "react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {MyTgContext} from "@/context/tg-context";
import {TgConnectionStatus} from "@/context/my-account-context";

export default function TgConnectionStatusContextProvider({children}: { children: ReactNode }) {
    const myConnectedWallet = useMyConnectedWallet()
    const tgId = useContext(MyTgContext).info?.tgId
    const [connectionStatus] = useState<'subscribed' | 'not-subscribed' | undefined>(undefined)

    const refresh = useCallback(() => {
        // if (myConnectedWallet == null || tgId == null) {
        //     return
        // }
        // return fetchIsSubscribed(tgId, myConnectedWallet.toString())
        //     .then(isSubscribed => isSubscribed ? 'subscribed' : 'not-subscribed')
        //     .then(setConnectionStatus)
    }, [tgId, myConnectedWallet])

    // useEffect(() => {
    //     refresh()
    //     return;
    // }, [myConnectedWallet, tgId, refresh]);

    return <TgConnectionStatus.Provider value={{info: connectionStatus, refresh}}>
        {children}
    </TgConnectionStatus.Provider>
}