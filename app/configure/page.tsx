'use client';

import {useContext, useEffect, useState} from "react";
import {fromNano, toNano} from "@ton/core";
import Link from "next/link";
import {updatePriceTransaction} from "@/components/utils/transaction-utils";
import CreateAccount from "@/components/v2/create-account";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import {MyAccountInfoContext} from "@/app/context/my-account-context";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/app/hooks/ton-hooks";

export default function ConfigurePrice() {
    const myConnectedWallet = useMyConnectedWallet()
    const myProfileInfo = useContext(MyAccountInfoContext).info
    const [newPrice, setNewPrice] = useState(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false)
    const [tonConnectUI] = useTonConnectUI()

    useEffect(() => {
        setNewPrice(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    }, [myProfileInfo]);

    const onClick = () => {
        if (myProfileInfo?.address != null) {
            tonConnectUI
                .sendTransaction(updatePriceTransaction(myProfileInfo?.address, toNano(newPrice)))
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
    const priceChanged = !isNaN(newPrice) && toNano(newPrice) !== myProfileInfo.price
    const dialogContent = <Link href={"/"} className={"btn btn-outline btn-primary"}>My Account</Link>
    return <>
        {isSuccessDialogVisible && <TransactionSucceedDialog content={dialogContent}/>}
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
            <p className={"text text-sm font-light text-center mt-2"}>You could update the price, it will be applied to
                all new messages</p>
            <button className={"btn btn-lg btn-outline btn-block btn-primary mt-4"}
                    disabled={isNaN(newPrice) || !priceChanged} onClick={onClick}>Save
            </button>
            <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel</Link>
        </div>
    </>
}