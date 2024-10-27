'use client';

import CurrencyInput from "react-currency-input-field";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAccountInfo} from "@/stores/profile-store";
import {useState} from "react";
import {fromNano, toNano} from "@ton/core";
import Link from "next/link";
import {tonConnectUI} from "@/stores/ton-connect";
import {updatePriceTransaction} from "@/components/utils/transaction-utils";
import CreateAccount from "@/components/v2/create-account";

export default function ConfigurePrice() {
    const myProfileInfo = useStoreClient($myAccountInfo)
    const [newPrice, setNewPrice] = useState(0)

    const onClick = () => {
        if (myProfileInfo?.data?.address != null) {
            tonConnectUI?.sendTransaction(updatePriceTransaction(myProfileInfo?.data?.address, toNano(newPrice)))
        }
    }

    const onConnectClick = () => {
        tonConnectUI?.modal?.open()
    }
    if (myProfileInfo?.isLoading === false && myProfileInfo.data === null) {
        return <div className={"pt-10"}>
            <button className={"btn btn-outline btn-block btn-primary btn-lg mt-50"} onClick={onConnectClick}>Connect
            </button>
        </div>
    }
    if (myProfileInfo?.isLoading === true) {
        return <div className={"loading loading-lg loading-dots pt-10"}></div>
    }
    if (myProfileInfo?.isLoading === false && myProfileInfo?.data == null) {
        return <CreateAccount/>
    }
    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            <div className={"text-neutral text-xl"}>Price</div>
            <div className={"w-full flex justify-center"}>
                {myProfileInfo?.data != null && <CurrencyInput
                    defaultValue={parseFloat(fromNano(myProfileInfo?.data?.price))}
                    className={`input text-5xl font-bold w-full text-center`}
                    readOnly={false}
                    decimalScale={3}
                    decimalsLimit={3}
                    suffix={" TON"}
                    allowNegativeValue={false}
                    min={0.0}
                    onValueChange={(value) => {
                        if (value != undefined) {
                            const valueParsed = parseFloat(value)
                            if (!isNaN(valueParsed)) {
                                setNewPrice(valueParsed)
                            }
                        } else {
                            setNewPrice(0)
                        }
                    }}/>}
            </div>
        </div>
        <button className={"btn btn-lg btn-outline btn-block btn-primary mt-4"} onClick={onClick}>Save</button>
        <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel</Link>
    </div>
}