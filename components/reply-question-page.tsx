'use client';

import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import {useEffect, useState} from "react";
import {fromNano} from "@ton/core";
import {replyTransaction} from "@/components/utils/transaction-utils";
import Link from "next/link";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myQuestionId, $myQuestionInfo} from "@/stores/reply-question-store";
import {tonConnectUI} from "@/stores/ton-connect";

export default function ReplyQuestionPage({id}: { id: number }) {
    useEffect(() => {
        $myQuestionId.set(id)
    }, [id]);
    const myQuestionInfo = useStoreClient($myQuestionInfo)

    const [replyText, setReplyText] = useState("")

    const onSubmitClick = () => {
        if (myQuestionInfo === null) {
            return;
        }
        const transaction = replyTransaction(myQuestionInfo.addr, replyText)
        tonConnectUI?.sendTransaction(transaction)
    }

    const isDisabled = replyText.trim() === '';
    return <div className={"ml-2 mr-2 mt-2"}>
        <DisconnectWalletHeader/>
        {myQuestionInfo?.submitterAddr != null &&
            <div className={"flex flex-row"}>
                <span className={"text-lg font-bold"}>From </span>
                <Link className={"text-primary text-lg"}
                      href={`/account?id=${myQuestionInfo?.submitterAddr?.toString()}`}>
                    {userFriendlyStr(myQuestionInfo.submitterAddr.toString())}
                </Link>
            </div>}
        <h1 className={"text-5xl"}>{myQuestionInfo?.balance != null && parseFloat(fromNano(myQuestionInfo.balance)).toFixed(3)} TON</h1>
        <p className={"text-lg"}>{myQuestionInfo?.content}</p>
        <textarea
            placeholder="Reply"
            onChange={e => setReplyText(e.target.value)}
            className="textarea textarea-bordered textarea-lg w-full h-[200px] mt-5"></textarea>
        <div className={`btm-nav w-full`}>
            <button className={`btn text-2xl btn-block btn-primary h-full rounded-none`} disabled={isDisabled}
                    onClick={onSubmitClick}>
                Submit
            </button>
        </div>
    </div>
}