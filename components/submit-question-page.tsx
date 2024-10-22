'use client';

import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import {useEffect, useState} from "react";
import {Address, fromNano, toNano} from "@ton/core";
import {createQuestionTransaction} from "@/components/utils/transaction-utils";
import {$otherProfile, $otherProfileInfo} from "@/stores/other-profile-store";
import {tonConnectUI} from "@/stores/ton-connect";
import {useStoreClient} from "@/components/hooks/use-store-client";
import Link from "next/link";
import {userFriendlyStr} from "@/components/utils/addr-utils";

export default function CreateQuestionPage({id}: { id: string }) {
    useEffect(() => {
        $otherProfile.set({address: Address.parse(id)})
    }, [id])
    const otherProfileInfo = useStoreClient($otherProfileInfo)

    const [text, setText] = useState("")

    const reward = otherProfileInfo != null ? otherProfileInfo.price + toNano(0.06) : null
    const onClick = () => {
        if (otherProfileInfo == null || reward == null) {
            return;
        }
        const transaction = createQuestionTransaction(text, reward, otherProfileInfo.address)
        tonConnectUI?.sendTransaction(transaction)
    }

    const isDisabled = text == null || text.trim() === ''

    return <div>
        <DisconnectWalletHeader/>
        <div className={"mt-3 p-2"}>
            <div className={"flex flex-row"}>
                <h2 className={"text-lg"}>Message To</h2>
                <Link className={"text-lg text-primary ml-4"} href={`/account?id=${id}`}>{userFriendlyStr(id)}</Link>
            </div>
            s{otherProfileInfo != null && reward != null && <h2 className={"text-3xl mt-4"}>
                Total Cost: {parseFloat(fromNano(reward))} TON</h2>}
            <textarea
                placeholder="Your question"
                onChange={e => setText(e.target.value)}
                className="textarea textarea-bordered textarea-lg w-full h-[200px] mt-5"></textarea>
            {/*{rewardField}*/}
            <div className={`btm-nav w-full`}>
                <button className={`btn btn-block btn-primary h-full rounded-none`} disabled={isDisabled}
                        onClick={onClick}>
                    <h1 className={"text-2xl"}>Submit</h1>
                </button>
            </div>
        </div>
    </div>
}