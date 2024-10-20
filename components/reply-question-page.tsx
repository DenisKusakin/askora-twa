'use client';

import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import {useEffect, useState} from "react";
import {Address, fromNano} from "@ton/core";
import {tonClient} from "@/wrappers/ton-client";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {Account} from "@/wrappers/Account";
import {useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {replyTransaction} from "@/components/utils/transaction-utils";
import {Question} from "@/wrappers/Question";
import Link from "next/link";
import {userFriendlyStr} from "@/components/utils/addr-utils";

export default function ReplyQuestionPage({id}: { id: number }) {
    const tonAddr = useTonAddress();

    const [questionData, setQuestionData] = useState<{
        content: string,
        isRejected: boolean,
        isClosed: boolean,
        balance: bigint,
        submitterAddr: Address
    } | null>(null)
    const [replyText, setReplyText] = useState("")
    const [questionAddr, setQuestionAddr] = useState<string>('')
    const [tonConnectUi] = useTonConnectUI()

    useEffect(() => {
        if (tonAddr === '') {
            return;
        }
        const account = Account.createFromConfig({
            owner: Address.parse(tonAddr),
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)

        const question = tonClient.open(Question.createFromConfig({
            accountAddr: account.address,
            id
        }, QUESTION_CODE))
        setQuestionAddr(question.address.toString())
        question.getAllData().then(setQuestionData)
    }, [tonAddr]);

    const onSubmitClick = () => {
        if (questionAddr === '') {
            return;
        }
        const transaction = replyTransaction(Address.parse(questionAddr), replyText)
        tonConnectUi.sendTransaction(transaction)
    }

    const isDisabled = replyText.trim() === '';
    return <div className={"ml-2 mr-2 mt-2"}>
        <h1>{questionAddr}</h1>
        <DisconnectWalletHeader/>
        {questionData?.submitterAddr != null &&
            <Link className={"text-primary text-lg"} href={`/account?id=${questionData?.submitterAddr?.toString()}`}>
                {userFriendlyStr(questionData.submitterAddr.toString())}
            </Link>}
        <h1 className={"text-5xl"}>{questionData?.balance != null && parseFloat(fromNano(questionData.balance)).toFixed(3)} TON</h1>
        <p className={"text-lg"}>{questionData?.content}</p>
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