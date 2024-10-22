import {Address, fromNano} from "@ton/core";
import {useEffect} from "react";
import {$questionDetailsData, $questionDetailsPage} from "@/stores/questions-store";
import {useStoreClient} from "@/components/hooks/use-store-client";
import Link from "next/link";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import CopyIcon from "@/components/copy-icon";
import DisconnectWalletHeader from "@/components/disconnect-wallet-header";

export function QuestionDetails({ownerAddress, qId}: { ownerAddress: Address, qId: number }) {
    useEffect(() => {
        $questionDetailsPage.set({ownerAddress, qId})
    }, [ownerAddress, qId]);
    const question = useStoreClient($questionDetailsData)
    if (question == null) {
        return <div className={"ml-2 mr-2 mt-2"}>
            <DisconnectWalletHeader/>
            <div className={"loading loading-dots loading-lg"}></div>
        </div>
    }
    return <div className={"ml-2 mr-2 mt-2"}>
        <DisconnectWalletHeader/>
        {!question.isClosed &&
            <h1 className="card-title text-neutral">≈{question.balance && parseFloat(fromNano(question.balance)).toFixed(3)} TON</h1>}
        {<div className={"flex flex-row items-center"}>
            <h2 className={"text-lg mr-1 font-bold"}>From</h2>
            <Link href={`/account?id=${question.submitterAddr.toString()}`}><h2
                className={"text-primary text-lg"}>{userFriendlyStr(question.submitterAddr.toString())}</h2></Link>
            <div className={"ml-3"}
                 onClick={() => navigator.clipboard.writeText(question.submitterAddr.toString())}>
                <CopyIcon/></div>
        </div>}
        {<div className={"flex flex-row items-center"}>
            <h2 className={"text-lg mr-1 font-bold"}>To</h2>
            <Link href={`/account?id=${question.ownerAddr.toString()}`}><h2
                className={"text-primary text-lg"}>{userFriendlyStr(question.ownerAddr.toString())}</h2></Link>
            <div className={"ml-3"} onClick={() => navigator.clipboard.writeText(question.ownerAddr.toString())}>
                <CopyIcon/>
            </div>
        </div>}
        <article className={"text-balance"}>{question.content}</article>
        <div className={"flex flex-row gap-1"}>
            {/*{question.isClosed && !question.isRejected && <div className="badge badge-success">answered</div>}*/}
            {question.isRejected && <div className="badge badge-warning">rejected</div>}
        </div>
        {question.replyContent != null && <div>
            <h2 className={"text-lg font-bold"}>Reply</h2>
            <div>{question.replyContent}</div>
        </div>}
    </div>
}