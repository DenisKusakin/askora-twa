import {useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {useEffect, useState} from "react";
import {Address} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {tonClient} from "@/wrappers/ton-client";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {userFriendlyStr} from "@/components/utils/addr-utils";

export default function DisconnectWalletHeader() {
    const [tonConnectUi] = useTonConnectUI()
    const [accountState, setAccountState] = useState<{
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
            {tonAddr !== '' && <a className="btn btn-info" onClick={() => {
                // @ts-expect-error todo
                document.getElementById('connected_account_info').showModal()
            }}>Info</a>}
            {tonAddr !== '' && <a className="btn btn-warning ml-1" onClick={() => {tonConnectUi.disconnect(); console.log("Disconnect")}}>Disconnect</a>}
        </div>
        <dialog id="connected_account_info" className="modal">
            <div className="modal-box w-full">
                <h3 className="font-bold text-lg">Info</h3>
                <h5 className={"text-sm"}
                    onClick={() => navigator.clipboard.writeText(tonAddr)}>
                    Wallet: {tonAddr !== '' && userFriendlyStr(tonAddr)}
                </h5>
                <h5 className={"text-sm"}
                    onClick={() => navigator.clipboard.writeText(accountState.addr?.toString() || '')}>
                    Account: {accountState.addr && userFriendlyStr(accountState.addr.toString())}
                    {accountState.state !== 'active' && <span className={"badge badge-error ml-2"}>Not Active</span>}
                    {accountState.state === 'active' && <span className={"badge badge-success ml-2"}>Active</span>}
                </h5>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>
}