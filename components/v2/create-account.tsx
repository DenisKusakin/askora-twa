import {useCallback, useContext, useState} from "react";
import {toNano} from "@ton/core";
import AccountCreationStatusDialog from "@/components/v2/account-creation-status-dialog";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {createAccountTransaction} from "@/components/utils/transaction-utils";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {MyTgContext} from "@/context/tg-context";
import {createAccount, subscribe} from "@/services/api";
import {useAuth} from "@/hooks/auth-hook";
import Link from "next/link";
import TransactionErrorDialog from "@/components/v2/transaction-failed-dialog";
import {useMutation} from "@tanstack/react-query";
import {useWaitForAccountActive} from "@/components/queries/queries";

export default function CreateAccount() {
    const myConnectedWallet = useMyConnectedWallet()
    const [price, setPrice] = useState(1)
    const [tonConnectUI] = useTonConnectUI();
    const [enableTgNotifications, setEnableTgNotifications] = useState(true)
    const tgInitData = useContext(MyTgContext).info?.tgInitData
    const isInTelegram = !(tgInitData == null || tgInitData === '')
    const [description, setDescription] = useState('')
    const {
        sponsoredTransactionsEnabled,
        setSponsoredTransactionsEnabled,
        updateTonProof,
        canUseSponsoredTransactions
    } = useAuth()
    const createAccountMutation = useMutation({
        mutationFn: () => {
            const sendTransactionPromise = sponsoredTransactionsEnabled ? createAccount(toNano(price), description) : tonConnectUI.sendTransaction(createAccountTransaction(toNano(price), description))
            return sendTransactionPromise
                .then(() => {
                    if (tgInitData == null || myConnectedWallet == null) {
                        return
                    }
                    return subscribe(tgInitData, myConnectedWallet?.toString())
                })
                .then(() => {
                })
        },
        onSuccess: () => {
        }
    })
    const infoQuery = useWaitForAccountActive(myConnectedWallet, createAccountMutation.isSuccess)

    const onClick = () => {
        if (myConnectedWallet != null) {
            createAccountMutation.mutate()
        }
    }
    const renewSession = useCallback(() => {
        updateTonProof().then(() => createAccountMutation.reset())
    }, [updateTonProof, createAccountMutation])

    const sessionExpiredDialogContent = <>
        <div className={"text text-lg text-center w-full"}>Session has expired</div>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={renewSession}>Renew Session
        </button>
        <button className={"btn btn-block btn-primary btn-outline mt-6"}
                onClick={() => createAccountMutation.reset()}>Close
        </button>
    </>
    const unknownErrorDialogContent = <div>
        <span className={"text text-error"}>Something went wrong...</span>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={() => createAccountMutation.reset()}>Close
        </button>
    </div>

    if(createAccountMutation.isPending) {
        return <AccountCreationStatusDialog transactionHash={null}/>
    } else if (createAccountMutation.isSuccess && !infoQuery.isSuccess) {
        return <AccountCreationStatusDialog transactionHash={''}/>
    } else if (createAccountMutation.isError) {
        return <TransactionErrorDialog
            content={createAccountMutation.error.message === 'unauthorized' ? sessionExpiredDialogContent : unknownErrorDialogContent}/>
    }
    return <>
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
                        <input checked={enableTgNotifications} onChange={() => setEnableTgNotifications(x => !x)}
                               type="checkbox"
                               className="checkbox checkbox-primary mr-2"/>
                        <span className="label-text text-lg">Receive notifications in Telegram</span>
                    </label>
                </div>}
            </div>
            <div className="form-control">
                <div className={"flex flex-row items-center justify-between"}>
                    <label className="label cursor-pointer">
                        <input type="checkbox" className="toggle toggle-primary" disabled={!canUseSponsoredTransactions}
                               checked={canUseSponsoredTransactions && sponsoredTransactionsEnabled}
                               onChange={() => setSponsoredTransactionsEnabled(!sponsoredTransactionsEnabled)}/>
                        <span className="label-text pl-2">Use Sponsored Transaction</span>
                    </label>
                    <Link className={"text-info pl-4"} href={"/configure/sponsored-transactions"}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-6 w-6 shrink-0 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </Link>
                </div>
                {!canUseSponsoredTransactions &&
                    <span className={"text text-xs text-red-700 italic"}>Sponsored transactions are not available at the moment. If you&apos;d like to use, please reconnect</span>}
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