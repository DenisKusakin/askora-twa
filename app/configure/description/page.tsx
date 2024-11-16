'use client';

import {useCallback, useContext, useEffect, useState} from "react";
import Link from "next/link";
import {updateDescriptionTransaction} from "@/components/utils/transaction-utils";
import CreateAccount from "@/components/v2/create-account";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import {MyAccountInfoContext} from "@/context/my-account-context";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {Cell} from "@ton/core";
import copyTextHandler from "@/utils/copy-util";
import {useAuth} from "@/hooks/auth-hook";
import {changeDescription} from "@/services/api";
import TransactionErrorDialog from "@/components/v2/transaction-failed-dialog";
import {TONVIEWER_BASE_PATH} from "@/conf";

export default function ConfigurePrice() {
    const myConnectedWallet = useMyConnectedWallet()
    const myProfileInfo = useContext(MyAccountInfoContext).info
    const [description, setDescription] = useState(myProfileInfo?.description || '')
    const [tonConnectUI] = useTonConnectUI()
    const [transaction, setTransaction] = useState<{
        hash: string | null,
        isSponsored: boolean,
        error?: string
    } | null>(null)
    const {sponsoredTransactionsEnabled, updateTonProof} = useAuth()

    useEffect(() => {
        setDescription(myProfileInfo?.description || '')
    }, [myProfileInfo]);

    const onClick = useCallback(() => {
        if (myProfileInfo?.address != null) {
            const transactionPromise = sponsoredTransactionsEnabled ? changeDescription(description) : tonConnectUI
                .sendTransaction(updateDescriptionTransaction(myProfileInfo?.address, description))
            transactionPromise
                .then(resp => {
                    if (resp) {
                        const cell = Cell.fromBase64(resp.boc)
                        const buffer = cell.hash();
                        const hash = buffer.toString('hex');

                        setTransaction({hash, isSponsored: false})
                    } else {
                        setTransaction({hash: null, isSponsored: true})
                    }
                })
                .catch(e => {
                    if (e instanceof Error) {
                        setTransaction({hash: null, isSponsored: sponsoredTransactionsEnabled, error: e.message})
                    }
                    console.log("Err", e)
                })
        }
    }, [myProfileInfo?.address, description, tonConnectUI, sponsoredTransactionsEnabled])

    // useEffect(() => {
    //     if (sponsoredTransactionsEnabled && transaction?.error === 'unauthorized') {
    //         console.log("Unauthorized!")
    //         updateTonProof()
    //     }
    // }, [transaction, sponsoredTransactionsEnabled, updateTonProof]);
    const renewSession = useCallback(() => {
        updateTonProof().then(() => setTransaction(null))
    }, [updateTonProof, setTransaction])

    const onConnectClick = () => {
        tonConnectUI.openModal()
    }
    if (myConnectedWallet === null) {
        return <div className={"pt-10"}>
            <button className={"btn btn-outline btn-block btn-primary btn-lg mt-50"}
                    onClick={onConnectClick}>Connect
            </button>
        </div>
    }
    if (myProfileInfo === undefined) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    if (myProfileInfo === null) {
        return <CreateAccount/>
    }
    const descriptionChanged = description !== (myProfileInfo.description || '')
    const dialogContent = <div>
        {transaction?.hash != null && <>
            <div className={"text text-xs break-all"} onClick={copyTextHandler(transaction.hash)}>
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
            <div className={"w-full flex flex-col justify-center"}>
                <textarea
                    placeholder="Write a short description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="textarea mt-2 textarea-bordered text-center italic textarea-sm w-full h-[100px]"></textarea>
            </div>
            <p className={"text text-sm font-light text-center mt-2"}>This text will be shown on your account page</p>
            <button className={"btn btn-lg btn-block btn-primary mt-4"}
                    disabled={!descriptionChanged} onClick={onClick}>Save
            </button>
            <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel</Link>
        </div>
    </>
}