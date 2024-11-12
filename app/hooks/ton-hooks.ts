import {useTonAddress} from "@tonconnect/ui-react";
import {Address} from "@ton/core";
import {useEffect, useState} from "react";

export function useMyConnectedWallet(): Address | null {
    const [res, setRes] = useState<null | Address>(null)
    const myConnectedWallet = useTonAddress()
    useEffect(() => {
        if (myConnectedWallet === '') {
            setRes(null)
        } else {
            setRes(Address.parse(myConnectedWallet))
        }
    }, [myConnectedWallet]);
    return res
}