import {QuestionData} from "@/stores/questions-store";
import {Address, fromNano} from "@ton/core";
import {useContext, useEffect, useState} from "react";
import Link from "next/link";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import copyTextHandler from "@/utils/copy-util";
import {MyTgContext} from "@/app/context/tg-context";
import {rejectQuestionTransaction, replyTransaction} from "@/components/utils/transaction-utils";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/app/hooks/ton-hooks";
import {TgMainButtonContext, TgMainButtonProps} from "@/app/context/tg-main-button-context";

export default function QuestionDetails({question}: { question: QuestionData }) {
    const myConnectedWallet = useMyConnectedWallet()
    const [replyShown, setReplyShown] = useState(false)
    const [myReply, setMyReply] = useState<string>('')
    const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false)
    const tgInitData = useContext(MyTgContext).info?.tgInitData
    const [tonConnectUI] = useTonConnectUI();
    const tgMainButton = useContext(TgMainButtonContext)

    let additional_class = ""
    if (question.isRejected) {
        additional_class = "text-error"
    } else if (question.isClosed) {
        additional_class = "text-success"
    }
    const isMyQuestion = myConnectedWallet?.toRawString() === question.to.toRawString()

    function isYou(addr: Address) {
        return myConnectedWallet != null && addr.equals(myConnectedWallet)
    }

    const onRejectClick = () => {
        tonConnectUI.sendTransaction(rejectQuestionTransaction(question.addr))
            .then(() => setSuccessDialogVisible(true))
    }
    const onReplyClick = () => {
        const transaction = replyTransaction(question.addr, myReply)
        tonConnectUI?.sendTransaction(transaction)
            .then(() => setSuccessDialogVisible(true))
    }

    const dialogContent = <button className={"btn btn-block btn-primary"}
                                  onClick={() => {
                                      setSuccessDialogVisible(false);
                                      setReplyShown(false);
                                  }}>Close</button>

    const isInTelegram = !(tgInitData === null || tgInitData === '')
    const tgMainButtonProps: TgMainButtonProps = {
        text: "Send Reply",
        onClick: onReplyClick,
        enabled: myReply.trim() !== '',
        visible: replyShown
    }
    useEffect(() => {
        tgMainButton.setProps(tgMainButtonProps)
    }, [tgMainButtonProps, tgMainButton]);
    useEffect(() => {
        return () => tgMainButton.setProps({...tgMainButtonProps, enabled: false})
    }, []);

    return <>
        {isSuccessDialogVisible && <TransactionSucceedDialog content={dialogContent}/>}
        <div className={"pt-10"}>
            <div className={"flex flex-row mb-2"}>
                <div className={"w-8/12"}>
                    <span
                        className={`${!replyShown ? 'text-3xl' : 'text-xl'} ${additional_class}`}>{parseFloat(fromNano(question.minPrice)).toFixed(3)}</span>
                    <span
                        className={`${!replyShown ? 'text-xl' : 'text-base'} text-3xl ml-2 ${additional_class}`}>TON</span>
                </div>
                <div className={"w-4/12 content-center"}>
                    {question.isClosed && !question.isRejected &&
                        <span className={"badge badge-outline badge-success"}>Replied</span>}
                    {question.isClosed && question.isRejected &&
                        <span className={"badge badge-outline badge-error"}>Rejected</span>}
                </div>
            </div>
            {!replyShown && <div className={"flex flex-col"}>
                <span className={"text-sm font-light"}>Sender</span>
                <div onClick={copyTextHandler(question.to.toString())}>
                    <span className={"text-base break-all"}>{question.from.toString()}</span>
                    {isYou(question.from) && <span className={"text-base italic font-bold ml-1"}>(You)</span>}
                    {!isYou(question.from) &&
                        <Link href={`/account?id=${question.from.toString()}`}
                              className={"ml-2 link link-primary italic"}>Open
                            Profile</Link>}
                </div>
            </div>}
            {!replyShown && <div className={"flex flex-col"}>
                <div className={"divider m-1"}></div>
                <span className={"text-sm font-light"}>Date</span>
                <div>
                    <span
                        className={"text-base break-all"}>{new Date(question.createdAt * 1000).toLocaleString()}</span>
                </div>
            </div>}
            {!replyShown && <div className={"divider m-1"}></div>}
            {!replyShown && <div className={"flex flex-col mt-2"}>
                <span className={"text-sx font-light"}>Receiver</span>
                <div onClick={copyTextHandler(question.to.toString())}>
                    <span className={"text-base break-all"}>{question.to.toString()}</span>
                    {isYou(question.to) && <span className={"text-base italic font-bold ml-1"}>(You)</span>}
                    {!isYou(question.to) &&
                        <Link href={`/account?id=${question.to.toString()}`}
                              className={"ml-2 link link-primary italic"}>Open
                            Profile</Link>}
                </div>
                <div className={"divider m-1"}></div>
            </div>}
            <div className={"flex flex-col mt-2"}>
                <span className={"text-sx font-light"}>Message</span>
                <span className={"text-base break-all"}>{question.content}</span>
            </div>
            {question.isClosed && !question.isRejected && <>
                <div className={"divider m-1"}></div>
                <div className={"flex flex-col mt-2"}>
                    <span className={"text-sx font-light"}>Reply</span>
                    <span className={"text-base break-all"}>{question.replyContent}</span>
                </div>
            </>}
            {!replyShown && isMyQuestion && !question.isClosed && <div className={"flex flex-col mt-4"}>
                <button className={"btn btn-outline btn-block btn-lg btn-primary mt-2"}
                        onClick={() => setReplyShown(true)}>
                    Reply
                </button>
                <button className={"btn btn-block btn-lg btn-error mt-2"}
                        onClick={onRejectClick}>Reject
                </button>
            </div>}
            {replyShown && !question.isClosed && isMyQuestion && <>
                <div className={"flex flex-col mt-2"}>
                    <div className={"divider m-1"}></div>
                    <span className={"text-sx font-light"}>Reply</span>
                    <textarea
                        placeholder="Your response"
                        onChange={e => setMyReply(e.target.value)}
                        className="textarea mt-2 textarea-bordered textarea-lg w-full h-[200px]"></textarea>
                </div>
                <div className={"mt-4"}>
                    {!isInTelegram && <button className={"btn btn-block btn-lg btn-primary"}
                                              onClick={onReplyClick}
                                              disabled={myReply.trim() === ''}>Send Reply
                    </button>}
                    <button className={"btn btn-outline btn-block btn-lg btn-error mt-2"}
                            onClick={() => setReplyShown(false)}>Cancel
                    </button>
                </div>
            </>}
        </div>
    </>
}