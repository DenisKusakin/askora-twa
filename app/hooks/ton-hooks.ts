import {useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {Address} from "@ton/core";
import {useEffect, useState} from "react";

export function useMyConnectedWallet(): Address | null | undefined {
    const [res, setRes] = useState<undefined | null | Address>(undefined)
    const myConnectedWallet = useTonAddress()
    const [tonConnectUI] = useTonConnectUI()

    useEffect(() => {
        tonConnectUI.connectionRestored.then(restored => {
            if (!restored || myConnectedWallet === '') {
                setRes(null)
            } else {
                setRes(Address.parse(myConnectedWallet))
            }
        })
    }, [myConnectedWallet, tonConnectUI]);
    return res
}