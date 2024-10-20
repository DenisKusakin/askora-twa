import {Address, fromNano} from "@ton/core";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {rejectQuestionTransaction} from "@/components/utils/transaction-utils";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import CopyIcon from "@/components/copy-icon";
import Link from "next/link";

export function QuestionView({question, showButtons = false, showFrom = false, showTo = false}: {
    question: {
        content: string,
        balance: bigint,
        addr: Address,
        isRejected: boolean,
        isClosed: boolean,
        from: Address,
        to: Address,
        replyContent: string
    },
    showButtons: boolean,
    showFrom: boolean,
    showTo: boolean
}) {
    const [tonConnectUI] = useTonConnectUI();
    const onRejectClick = () => {
        tonConnectUI.sendTransaction(rejectQuestionTransaction(question.addr))
    }

    return <div className="card bg-base-100 w-full shadow-xl mt-1 rounded-none">
        <div className="card-body">
            {!question.isClosed && <h1 className="card-title text-neutral">≈{question.balance && parseFloat(fromNano(question.balance)).toFixed(3)} TON</h1>}
            {showFrom && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>From</h2>
                <Link href={`/account?id=${question.from.toString()}`}><h2
                    className={"text-primary text-lg"}>{userFriendlyStr(question.from.toString())}</h2></Link>
                <div className={"ml-3"}
                     onClick={() => navigator.clipboard.writeText(question.from.toString())}>
                    <CopyIcon/></div>
            </div>}
            {showTo && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>To</h2>
                <Link href={`/account?id=${question.to.toString()}`}><h2
                    className={"text-primary text-lg"}>{userFriendlyStr(question.to.toString())}</h2></Link>
                <div className={"ml-3"} onClick={() => navigator.clipboard.writeText(question.to.toString())}>
                    <CopyIcon/>
                </div>
            </div>}
            <article className={"text-balance"}>{question.content}</article>
            <div className={"flex flex-row gap-1"}>
                {question.isClosed && !question.isRejected && <div className="badge badge-success">answered</div>}
                {question.isRejected && <div className="badge badge-warning">rejected</div>}
            </div>
        </div>
        {!question.isClosed && showButtons && <div className="card-actions justify-end mb-2 mr-2">
            <button className={"btn btn-secondary btn-sm"} onClick={onRejectClick}>Reject</button>
            <button className={"btn btn-primary btn-sm"}>Reply</button>
        </div>}
        {question.replyContent}
    </div>
}