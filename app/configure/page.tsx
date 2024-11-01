'use client';

import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myAccountInfo, $myConnectedWallet} from "@/stores/profile-store";
import {useEffect, useState} from "react";
import {fromNano, toNano} from "@ton/core";
import Link from "next/link";
import {tonConnectUI} from "@/stores/ton-connect";
import {updatePriceTransaction} from "@/components/utils/transaction-utils";
import CreateAccount from "@/components/v2/create-account";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";

export default function ConfigurePrice() {
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const myProfileInfo = useStoreClientV2($myAccountInfo)
    const [newPrice, setNewPrice] = useState(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false)

    useEffect(() => {
        setNewPrice(myProfileInfo != null ? parseFloat(fromNano(myProfileInfo.price)) : 0)
    }, [myProfileInfo]);

    const onClick = () => {
        if (myProfileInfo?.address != null) {
            tonConnectUI
                ?.sendTransaction(updatePriceTransaction(myProfileInfo?.address, toNano(newPrice)))
                ?.then(() => setSuccessDialogVisible(true))
        }
    }

    const onConnectClick = () => {
        tonConnectUI?.modal?.open()
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
    const dialogContent = <Link href={"/"} className={"btn btn-outline btn-primary"}>My Account</Link>
    return <>
    {isSuccessDialogVisible && <TransactionSucceedDialog content={dialogContent}/>}
        <div className={"pt-10"}>
            <div className={"flex flex-col items-center"}>
                <div className={"text-neutral text-xl"}>Price (TON)</div>
                <div className={"w-full flex justify-center"}>
                    <input
                        value={newPrice}
                        type={"number"}
                        min={"0"}
                        className={`input text-5xl font-bold w-full text-center`}
                        onChange={(e) => {
                            const value = e.target.value
                            if (value != undefined) {
                                const valueParsed = parseFloat(value)
                                if (!isNaN(valueParsed)) {
                                    if (valueParsed < 0) {
                                        e.target.value = "0"
                                        setNewPrice(0)
                                    } else {
                                        setNewPrice(valueParsed)
                                    }
                                }
                            } else {
                                setNewPrice(0)
                            }
                        }}/>
                    {/*<CurrencyInput*/}
                    {/*    defaultValue={parseFloat(fromNano(myProfileInfo.price))}*/}
                    {/*    className={`input text-5xl font-bold w-full text-center`}*/}
                    {/*    readOnly={false}*/}
                    {/*    decimalScale={3}*/}
                    {/*    decimalsLimit={3}*/}
                    {/*    suffix={" TON"}*/}
                    {/*    allowNegativeValue={false}*/}
                    {/*    min={0.0}*/}
                    {/*    onValueChange={(value) => {*/}
                    {/*        if (value != undefined) {*/}
                    {/*            const valueParsed = parseFloat(value)*/}
                    {/*            if (!isNaN(valueParsed)) {*/}
                    {/*                setNewPrice(valueParsed)*/}
                    {/*            }*/}
                    {/*        } else {*/}
                    {/*            setNewPrice(0)*/}
                    {/*        }*/}
                    {/*    }}/>*/}
                </div>
            </div>
            <button className={"btn btn-lg btn-outline btn-block btn-primary mt-4"} onClick={onClick}>Save</button>
            <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel</Link>
        </div>
    </>
}