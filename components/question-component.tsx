import {Address, fromNano} from "@ton/core";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {rejectQuestionTransaction} from "@/components/utils/transaction-utils";

export function QuestionView({question, showButtons = false}: {
    question: { content: string, balance: bigint, addr: Address, isRejected: boolean, isClosed: boolean },
    showButtons: boolean
}) {
    const [tonConnectUI] = useTonConnectUI();
    const onRejectClick = () => {
        tonConnectUI.sendTransaction(rejectQuestionTransaction(question.addr))
    }

    return <div className="card bg-base-100 w-full shadow-xl">
        <div className="card-body">
            <h1 className="card-title">{question.balance && fromNano(question.balance)} TON</h1>
            {question.isRejected && <div className="badge badge-warning">Rejected</div>}
            <article className={"text-balance"}>{question.content}</article>
        </div>
        {!question.isClosed && showButtons && <div className="card-actions justify-end">
            <button className={"btn btn-warning btn-sm"} onClick={onRejectClick}>Reject</button>
            <button className={"btn btn-success btn-sm"}>Reply</button>
        </div>}
    </div>
}