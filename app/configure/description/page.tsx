'use client';

import {useContext, useEffect, useState} from "react";
import Link from "next/link";
import {updateDescriptionTransaction} from "@/components/utils/transaction-utils";
import CreateAccount from "@/components/v2/create-account";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import {MyAccountInfoContext} from "@/app/context/my-account-context";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/app/hooks/ton-hooks";

export default function ConfigurePrice() {
    const myConnectedWallet = useMyConnectedWallet()
    const myProfileInfo = useContext(MyAccountInfoContext).info
    const [description, setDescription] = useState(myProfileInfo?.description || '')
    const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false)
    const [tonConnectUI] = useTonConnectUI()

    useEffect(() => {
        setDescription(myProfileInfo?.description || '')
    }, [myProfileInfo]);

    const onClick = () => {
        if (myProfileInfo?.address != null) {
            tonConnectUI
                .sendTransaction(updateDescriptionTransaction(myProfileInfo?.address, description))
                .then(() => setSuccessDialogVisible(true))
        }
    }

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
        return <div className={"loading loading-lg loading-dots pt-10"}></div>
    }
    if (myProfileInfo === null) {
        return <CreateAccount/>
    }
    const descriptionChanged = description !== (myProfileInfo.description || '')
    const dialogContent = <Link href={"/"} className={"btn btn-outline btn-primary"}>My Account</Link>

    return <>
        {isSuccessDialogVisible && <TransactionSucceedDialog content={dialogContent}/>}
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