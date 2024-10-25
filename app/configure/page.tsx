'use client';

import CurrencyInput from "react-currency-input-field";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAccountInfo} from "@/stores/profile-store";
import {useState} from "react";
import {fromNano, toNano} from "@ton/core";
import Link from "next/link";
import {tonConnectUI} from "@/stores/ton-connect";
import {updatePriceTransaction} from "@/components/utils/transaction-utils";

export default function ConfigurePrice() {
    const myProfileInfo = useStoreClient($myAccountInfo)
    const [newPrice, setNewPrice] = useState(0)

    const onClick = () => {
        if (myProfileInfo?.address != null) {
            tonConnectUI?.sendTransaction(updatePriceTransaction(myProfileInfo.address, toNano(newPrice)))
        }
    }

    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            <div className={"text-neutral text-xl"}>Price</div>
            <div className={"w-full flex justify-center"}>
                {myProfileInfo != null && !myProfileInfo.isLoading && <CurrencyInput
                    defaultValue={parseFloat(fromNano(myProfileInfo.price))}
                    className={`input text-3xl font-bold w-full text-center`}
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
                {(myProfileInfo == null || myProfileInfo.isLoading) && <div className={"loading loading-lg loading-dots"}></div>}
            </div>
            <div className={"mt-10 flex flex-row"}>
                <Link href="/" className={"btn btn-sm btn-error btn-outline ml-4"}>Cancel</Link>
                <button className={"btn btn-sm btn-primary ml-4"} onClick={onClick}>Save</button>
            </div>
        </div>
    </div>
}