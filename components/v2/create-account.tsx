import {useContext, useEffect, useState} from "react";
import {toNano} from "@ton/core";
import AccountCreationStatusDialog from "@/components/v2/account-creation-status-dialog";
import {MyAccountInfoContext, TgConnectionStatus} from "@/context/my-account-context";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {createAccountTransaction} from "@/components/utils/transaction-utils";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {MyTgContext} from "@/context/tg-context";
import {createAccount, subscribe} from "@/services/api";
import {useAuth} from "@/hooks/auth-hook";

export default function CreateAccount() {
    const myConnectedWallet = useMyConnectedWallet()
    const [price, setPrice] = useState(1)
    const {info, refresh} = useContext(MyAccountInfoContext)
    const [isInProgress, setIsInProgress] = useState(false)
    const [tonConnectUI] = useTonConnectUI();
    const [enableTgNotifications, setEnableTgNotifications] = useState(true)
    const tgConnectionStatusContext = useContext(TgConnectionStatus)
    const tgInitData = useContext(MyTgContext).info?.tgInitData
    const isInTelegram = !(tgInitData == null || tgInitData === '')
    const [description, setDescription] = useState('')
    const {sponsoredTransactionsEnabled} = useAuth()

    useEffect(() => {
        if (isInProgress) {
            if (info?.status === 'active') {
                setIsInProgress(false)
            } else {
                const id = setInterval(refresh, 2000)
                return () => clearInterval(id)
            }
        }
    }, [isInProgress, info, refresh]);

    const onClick = () => {
        if (myConnectedWallet != null) {
            const sendTransactionPromise = sponsoredTransactionsEnabled ? createAccount(toNano(price), description) : tonConnectUI.sendTransaction(createAccountTransaction(toNano(price), description))
            setIsInProgress(true)
            sendTransactionPromise
                .then(() => {
                    if (isInTelegram && tgInitData != null) {
                        subscribe(tgInitData, myConnectedWallet.toString())
                            .then(tgConnectionStatusContext.refresh)
                    }
                })
        }
    }

    return <>
        {isInProgress && <AccountCreationStatusDialog/>}
        <div className={"pt-10"}>
            <div className={"flex flex-col items-center"}>
                <div className={"text-neutral text-xl"}>Price (TON)</div>
                <div className={"w-full flex flex-col justify-center"}>
                    <input
                        defaultValue={isNaN(price) ? '' : price}
                        type={"number"}
                        inputMode="decimal"
                        min={"0"}
                        className={`input text-5xl font-bold w-full text-center`}
                        onChange={(e) => {
                            setPrice(e.target.valueAsNumber)
                        }}/>
                    <textarea
                        placeholder="Write a short bio or a message to your visitors..."
                        onChange={e => setDescription(e.target.value)}
                        className="textarea mt-2 textarea-bordered text-center italic textarea-sm w-full h-[100px]"></textarea>
                </div>
                <div className={"text text-sm italic text-center mb-5 mt-5"}>To receive questions, you need to create an
                    account.
                    Specify the price of your reply. It could be changed later
                </div>
                {isInTelegram && <div className={"mt-2"}>
                    <label className="label cursor-pointer">
                        <input checked={enableTgNotifications} onChange={() => setEnableTgNotifications(x => !x)} type="checkbox"
                               className="checkbox checkbox-primary mr-2"/>
                        <span className="label-text text-lg">Receive notifications in Telegram</span>
                    </label>
                </div>}
            </div>
            <button disabled={isNaN(price)} className={"btn btn-block btn-lg btn-primary mt-5"} onClick={onClick}>Create
                Account
            </button>
            <button className={"btn btn-block btn-outline btn-lg btn-error mt-2"}
                    onClick={() => tonConnectUI?.disconnect()}>Disconnect
            </button>
        </div>
    </>
}