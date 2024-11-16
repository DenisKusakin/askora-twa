'use client';

import {useCallback, useContext, useEffect, useState} from "react";
import {Cell, fromNano, toNano} from "@ton/core";
import Link from "next/link";
import {updatePriceTransaction} from "@/components/utils/transaction-utils";
import CreateAccount from "@/components/v2/create-account";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import {MyAccountInfoContext} from "@/context/my-account-context";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import copyTextHandler from "@/utils/copy-util";
import {useAuth} from "@/hooks/auth-hook";
import {changePrice} from "@/services/api";
import TransactionErrorDialog from "@/components/v2/transaction-failed-dialog";
import {TONVIEWER_BASE_PATH} from "@/conf";
import {useRouter} from "next/navigation";

export default function ConfigurePrice() {
    const myConnectedWallet = useMyConnectedWallet()
    const myProfileInfo = useContext(MyAccountInfoContext).info
    const [newPrice, setNewPrice] = useState(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    const [tonConnectUI] = useTonConnectUI()
    const [transaction, setTransaction] = useState<{
        hash: string | null,
        isSponsored: boolean,
        error?: string
    } | null>(null)
    const {sponsoredTransactionsEnabled, updateTonProof} = useAuth()
    const [isInProgress, setInProgress] = useState(false)

    const router = useRouter()
    useEffect(() => {
        if (myConnectedWallet === null) {
            router.push("/")
        }
    }, [myConnectedWallet, router]);

    const renewSession = useCallback(() => {
        updateTonProof().then(() => setTransaction(null))
    }, [updateTonProof, setTransaction])

    useEffect(() => {
        setNewPrice(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    }, [myProfileInfo]);

    const onClick = useCallback(() => {
        if (myProfileInfo?.address != null) {
            setInProgress(true)
            const sendTransactionPromise = sponsoredTransactionsEnabled ? changePrice(toNano(newPrice)) : tonConnectUI.sendTransaction(updatePriceTransaction(myProfileInfo?.address, toNano(newPrice)))
            sendTransactionPromise
                .then(resp => {
                    if (resp) {
                        const cell = Cell.fromBase64(resp.boc)
                        const buffer = cell.hash();
                        const hash = buffer.toString('hex');

                        setTransaction({hash, isSponsored: false})
                    } else {
                        setTransaction({hash: null, isSponsored: true})
                    }
                }).catch(e => {
                if (e instanceof Error) {
                    setTransaction({hash: null, isSponsored: sponsoredTransactionsEnabled, error: e.message})
                }
                console.log("Err", e)
            })
                .then(() => setInProgress(false))
        }
    }, [myProfileInfo?.address, tonConnectUI, sponsoredTransactionsEnabled, newPrice])

    if (myProfileInfo === undefined) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    if (myProfileInfo === null) {
        return <CreateAccount/>
    }
    const priceChanged = !isNaN(newPrice) && toNano(newPrice) !== myProfileInfo.price
    const dialogContent = <div>
        {transaction?.hash != null && <>
            <div className={"text text-xs break-all"} onClick={copyTextHandler(transaction.hash || '')}>
                <b>Hash</b>: {transaction.hash}</div>
            <Link className={"link link-primary"} href={`${TONVIEWER_BASE_PATH}/transaction/${transaction.hash}`}
                  target={"_blank"}>Tonviewer</Link></>}
        <Link href={`/`}
              className={"btn btn-block btn-primary mt-6"}>Close</Link>
    </div>
    const sessionExpiredDialogContent = <>
        <div className={"text text-lg text-center w-full"}>Session has expired</div>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={renewSession}>Renew Session
        </button>
        <button className={"btn btn-block btn-primary btn-outline mt-6"}
                onClick={() => setTransaction(null)}>Close
        </button>
    </>
    const unknownErrorDialogContent = <div>
        <span className={"text text-error"}>Something went wrong...</span>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={() => setTransaction(null)}>Close
        </button>
    </div>

    return <>
        {transaction !== null && transaction.error == null && <TransactionSucceedDialog content={dialogContent}/>}
        {transaction !== null && transaction.error != null &&
            <TransactionErrorDialog
                content={transaction.error === 'unauthorized' ? sessionExpiredDialogContent : unknownErrorDialogContent}/>}
        <div className={"pt-10"}>
            <div className={"flex flex-col items-center"}>
                <div className={"text-neutral text-xl"}>Price (TON)</div>
                <div className={"w-full flex justify-center"}>
                    <input
                        value={isNaN(newPrice) ? '' : newPrice}
                        type={"number"}
                        inputMode="decimal"
                        min={"0"}
                        className={`input text-5xl font-bold w-full text-center`}
                        onChange={(e) => {
                            setNewPrice(e.target.valueAsNumber)
                        }}/>
                </div>
            </div>
            <p className={"text text-sm font-light text-center mt-2"}>The new price will apply to all future
                messages</p>
            <button className={"btn btn-lg btn-block btn-primary mt-4"}
                    disabled={isNaN(newPrice) || !priceChanged || isInProgress} onClick={onClick}>Save
                {isInProgress &&
                    <span className={"loading loading-dots"}></span>}
            </button>
            <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel</Link>
        </div>
    </>
}