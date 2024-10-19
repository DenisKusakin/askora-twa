import {useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {useEffect, useState} from "react";
import {Address} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {tonClient} from "@/wrappers/ton-client";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";

export default function DisconnectWalletHeader() {
    const [tonConnectUi] = useTonConnectUI()
    const [, setAccountState] = useState<{
        isLoading: boolean,
        state: "active" | "uninit",
        addr: null | Address
    }>({isLoading: true, state: "uninit", addr: null})

    const tonAddr = useTonAddress()
    useEffect(() => {
        if (tonAddr === '') {
            return;
        }
        const account = Account.createFromConfig({
            owner: Address.parse(tonAddr),
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        tonClient.getContractState(account.address)
            .then(x => {
                setAccountState({
                    isLoading: false,
                    state: (x.state === 'active' ? 'active' : 'uninit'),
                    addr: account.address
                })
            })
    }, [tonAddr]);

    return <div className="navbar bg-base-100">
        <div className="flex-1">
            <a className="btn btn-ghost text-sm">Askora</a>
        </div>
        <div className="navbar-end">
            {tonAddr !== '' && <a className="btn btn-warning ml-1" onClick={() => {tonConnectUi.disconnect(); console.log("Disconnect")}}>Disconnect</a>}
        </div>
    </div>
}