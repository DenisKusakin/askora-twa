import {Address, fromNano} from "@ton/core";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {rejectQuestionTransaction} from "@/components/utils/transaction-utils";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import CopyIcon from "@/components/copy-icon";

export function QuestionView({question, showButtons = false, showFrom = false, showTo = false}: {
    question: {
        content: string,
        balance: bigint,
        addr: Address,
        isRejected: boolean,
        isClosed: boolean,
        from: Address,
        to: Address
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
            <h1 className="card-title">{question.balance && fromNano(question.balance)} TON</h1>
            {showFrom && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>From</h2>
                <h2 className={"text-primary text-lg"}>{userFriendlyStr(question.from.toString())}</h2>
                <div className={"ml-3"}><CopyIcon/></div>
            </div>}
            {showTo && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>To</h2>
                <h2 className={"text-primary text-lg"}>{userFriendlyStr(question.to.toString())}</h2>
                <div className={"ml-3"}><CopyIcon/></div>
            </div>}
            {question.isRejected && <div className="badge badge-warning">Rejected</div>}
            <article className={"text-balance"}>{question.content}</article>
        </div>
        {!question.isClosed && showButtons && <div className="card-actions justify-end mb-2 mr-2">
            <button className={"btn btn-secondary btn-sm"} onClick={onRejectClick}>Reject</button>
            <button className={"btn btn-primary btn-sm"}>Reply</button>
        </div>}
    </div>
}