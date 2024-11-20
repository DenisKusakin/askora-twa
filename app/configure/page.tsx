'use client';

import {useCallback, useEffect, useState} from "react";
import {Cell, fromNano, toNano} from "@ton/core";
import Link from "next/link";
import {updatePriceTransaction} from "@/components/utils/transaction-utils";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import copyTextHandler from "@/utils/copy-util";
import {useAuth} from "@/hooks/auth-hook";
import {changePrice} from "@/services/api";
import TransactionErrorDialog from "@/components/v2/transaction-failed-dialog";
import {TONVIEWER_BASE_PATH} from "@/conf";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {useAccountInfo} from "@/components/queries/queries";

export default function ConfigurePrice() {
    const myConnectedWallet = useMyConnectedWallet()

    const myAccountInfoQuery = useAccountInfo(myConnectedWallet)
    const myProfileInfo = myAccountInfoQuery.data

    const [newPrice, setNewPrice] = useState(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    const [tonConnectUI] = useTonConnectUI()
    const {sponsoredTransactionsEnabled, updateTonProof} = useAuth()

    const router = useRouter()
    useEffect(() => {
        if (myConnectedWallet === null) {
            router.push("/")
        }
    }, [myConnectedWallet, router]);

    const updatePriceMutation = useMutation({
        mutationFn: () => {
            if (myProfileInfo == null) {
                return Promise.reject()
            }
            const sendTransactionPromise = sponsoredTransactionsEnabled ? changePrice(toNano(newPrice)) : tonConnectUI.sendTransaction(updatePriceTransaction(myProfileInfo?.address, toNano(newPrice)))
            return sendTransactionPromise
                .then(resp => {
                    if (resp) {
                        const cell = Cell.fromBase64(resp.boc)
                        const buffer = cell.hash();
                        const hash = buffer.toString('hex');

                        return {hash, isSponsored: false}
                    } else {
                        return {hash: null, isSponsored: true}
                    }
                })
        }
    })

    const renewSession = useCallback(() => {
        updateTonProof().then(() => updatePriceMutation.reset())
    }, [updateTonProof, updatePriceMutation])

    useEffect(() => {
        setNewPrice(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    }, [myProfileInfo]);

    useEffect(() => {
        if(myProfileInfo === null){
            router.push('/')
        }
    }, [myProfileInfo, router]);
    if (myProfileInfo === undefined) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    const priceChanged = !isNaN(newPrice) && toNano(newPrice) !== myProfileInfo.price
    const dialogContent = <div>
        {updatePriceMutation.data?.hash != null && <>
            <div className={"text text-xs break-all"} onClick={copyTextHandler(updatePriceMutation.data?.hash || '')}>
                <b>Hash</b>: {updatePriceMutation.data?.hash}</div>
            <Link className={"link link-primary"}
                  href={`${TONVIEWER_BASE_PATH}/transaction/${updatePriceMutation.data.hash}`}
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
                onClick={() => updatePriceMutation.reset()}>Close
        </button>
    </>
    const unknownErrorDialogContent = <div>
        <span className={"text text-error"}>Something went wrong...</span>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={() => updatePriceMutation.reset()}>Close
        </button>
    </div>

    return <>
        {updatePriceMutation.isSuccess && <TransactionSucceedDialog content={dialogContent}/>}
        {updatePriceMutation.error != null &&
            <TransactionErrorDialog
                content={updatePriceMutation.error.message === 'unauthorized' ? sessionExpiredDialogContent : unknownErrorDialogContent}/>}
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
                    disabled={isNaN(newPrice) || !priceChanged || updatePriceMutation.isPending}
                    onClick={() => updatePriceMutation.mutate()}>Save
                {updatePriceMutation.isPending &&
                    <span className={"loading loading-dots"}></span>}
            </button>
            <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel</Link>
        </div>
    </>
}