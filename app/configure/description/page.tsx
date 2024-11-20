'use client';

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {updateDescriptionTransaction} from "@/components/utils/transaction-utils";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {Cell} from "@ton/core";
import copyTextHandler from "@/utils/copy-util";
import {useAuth} from "@/hooks/auth-hook";
import {changeDescription} from "@/services/api";
import TransactionErrorDialog from "@/components/v2/transaction-failed-dialog";
import {TONVIEWER_BASE_PATH} from "@/conf";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {useAccountInfo} from "@/components/queries/queries";

export default function ConfigurePrice() {
    const myConnectedWallet = useMyConnectedWallet()

    const myAccountInfoQuery = useAccountInfo(myConnectedWallet)
    const myProfileInfo = myAccountInfoQuery.data

    const [description, setDescription] = useState(myProfileInfo?.description || '')
    const [tonConnectUI] = useTonConnectUI()
    const {sponsoredTransactionsEnabled, updateTonProof} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (myConnectedWallet === null || myProfileInfo === null) {
            router.push("/")
        }
    }, [myConnectedWallet, myProfileInfo, router]);

    useEffect(() => {
        setDescription(myProfileInfo?.description || '')
    }, [myProfileInfo]);

    const updateDescriptionMutation = useMutation({
        mutationFn: () => {
            if (myProfileInfo == null) {
                return Promise.reject()
            }
            const transactionPromise = sponsoredTransactionsEnabled ? changeDescription(description) : tonConnectUI.sendTransaction(updateDescriptionTransaction(myProfileInfo?.address, description))
            return transactionPromise
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
        updateTonProof().then(() => updateDescriptionMutation.reset())
    }, [updateTonProof, updateDescriptionMutation])

    if (myProfileInfo === undefined) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    const descriptionChanged = description !== (myProfileInfo.description || '')
    const dialogContent = <div>
        {updateDescriptionMutation.data?.hash != null && <>
            <div className={"text text-xs break-all"} onClick={copyTextHandler(updateDescriptionMutation.data.hash)}>
                <b>Hash</b>: {updateDescriptionMutation.data.hash}</div>
            <Link className={"link link-primary"}
                  href={`${TONVIEWER_BASE_PATH}/transaction/${updateDescriptionMutation.data.hash}`}
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
                onClick={() => updateDescriptionMutation.reset()}>Close
        </button>
    </>
    const unknownErrorDialogContent = <div>
        <span className={"text text-error"}>Something went wrong...</span>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={() => updateDescriptionMutation.reset()}>Close
        </button>
    </div>

    return <>
        {updateDescriptionMutation.isSuccess && <TransactionSucceedDialog content={dialogContent}/>}
        {updateDescriptionMutation.error != null &&
            <TransactionErrorDialog
                content={updateDescriptionMutation.error.message === 'unauthorized' ? sessionExpiredDialogContent : unknownErrorDialogContent}/>}
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
                    disabled={!descriptionChanged || updateDescriptionMutation.isPending}
                    onClick={() => updateDescriptionMutation.mutate()}>Save
                {updateDescriptionMutation.isPending &&
                    <span className={"loading loading-dots"}></span>}
            </button>
            <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel</Link>
        </div>
    </>
}