import {Address, fromNano} from "@ton/core";
import {rejectQuestionTransaction} from "@/components/utils/transaction-utils";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import CopyIcon from "@/components/copy-icon";
import Link from "next/link";
import {tonConnectUI} from "@/stores/ton-connect";

export function QuestionView({question, showButtons = false, showFrom = false, showTo = false}: {
    question: {
        content: string,
        balance: bigint,
        addr: Address,
        isRejected: boolean,
        isClosed: boolean,
        from: Address,
        to: Address,
        replyContent: string,
        id: number
    },
    showButtons: boolean,
    showFrom: boolean,
    showTo: boolean
}) {
    const onRejectClick = () => {
        tonConnectUI?.sendTransaction(rejectQuestionTransaction(question.addr))
    }

    return <div className="card bg-base-100 w-full shadow-xl mt-1 rounded-none">
        <div className="card-body">
            {!question.isClosed &&
                <h1 className="card-title text-neutral">≈{question.balance && parseFloat(fromNano(question.balance)).toFixed(3)} TON</h1>}
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
                {/*{question.isClosed && !question.isRejected && <div className="badge badge-success">answered</div>}*/}
                {question.isRejected && <div className="badge badge-warning">rejected</div>}
            </div>
            {question.replyContent != null && <div>
                <h2 className={"text-lg font-bold"}>Reply</h2>
                <div>{question.replyContent}</div>
            </div>}
        </div>
        <div className="card-actions justify-end mb-2 mr-2">
            <Link href={`/q-details?q_id=${question.id}&owner_id=${question.to.toString()}`}
                  className={"btn btn-outline btn-primary btn-sm"}>Details</Link>
            {!question.isClosed && showButtons &&
                <button className={"btn btn-secondary btn-sm"} onClick={onRejectClick}>Reject</button>}
            {!question.isClosed && showButtons && <Link href={`/my-question?id=${question.id}&command=reply`}
                                                        className={"btn btn-primary btn-sm"}>Reply</Link>}
        </div>
    </div>
}