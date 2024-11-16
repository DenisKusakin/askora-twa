import {QuestionData} from "@/stores/questions-store";
import {Address, Cell, fromNano} from "@ton/core";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import copyTextHandler from "@/utils/copy-util";
import {MyTgContext} from "@/context/tg-context";
import {rejectQuestionTransaction, replyTransaction} from "@/components/utils/transaction-utils";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {TgMainButtonContext, TgMainButtonProps} from "@/context/tg-main-button-context";
import {useAuth} from "@/hooks/auth-hook";
import {rejectQuestion, replyQuestion} from "@/services/api";
import TransactionErrorDialog from "@/components/v2/transaction-failed-dialog";
import {TONVIEWER_BASE_PATH} from "@/conf";

export default function QuestionDetails({question}: { question: QuestionData }) {
    const myConnectedWallet = useMyConnectedWallet()
    const [replyShown, setReplyShown] = useState(false)
    const [myReply, setMyReply] = useState<string>('')
    const tgInitData = useContext(MyTgContext).info?.tgInitData
    const [tonConnectUI] = useTonConnectUI();
    const tgMainButton = useContext(TgMainButtonContext)
    const [transaction, setTransaction] = useState<{
        hash: string | null, isSponsored: boolean,
        error?: string
    } | null>(null)
    const {sponsoredTransactionsEnabled, updateTonProof} = useAuth()

    const renewSession = useCallback(() => {
        updateTonProof().then(() => setTransaction(null))
    }, [updateTonProof, setTransaction])

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

    const onRejectClick = useCallback(() => {
        const transactionPromise = sponsoredTransactionsEnabled ? rejectQuestion(question.id) : tonConnectUI.sendTransaction(rejectQuestionTransaction(question.addr))
        transactionPromise
            .then(resp => {
                if (resp) {
                    const cell = Cell.fromBase64(resp.boc)
                    const buffer = cell.hash();
                    const hash = buffer.toString('hex');

                    setTransaction({hash, isSponsored: false})
                } else {
                    setTransaction({hash: null, isSponsored: true})
                }
            })
    }, [question.id, question.addr, sponsoredTransactionsEnabled, tonConnectUI])

    const onReplyClick = useCallback(() => {
        const transactionPromise = sponsoredTransactionsEnabled ? replyQuestion(question.id, myReply) : tonConnectUI.sendTransaction(replyTransaction(question.addr, myReply))
        transactionPromise
            .then(resp => {
                if (resp) {
                    const cell = Cell.fromBase64(resp.boc)
                    const buffer = cell.hash();
                    const hash = buffer.toString('hex');
                    setTransaction({hash, isSponsored: false})
                } else {
                    setTransaction({hash: null, isSponsored: true})
                }
            })
            .catch(e => {
                if (e instanceof Error) {
                    setTransaction({hash: null, isSponsored: sponsoredTransactionsEnabled, error: e.message})
                }
                console.log("Err", e)
            })
    }, [myReply, sponsoredTransactionsEnabled, question.addr, question.id, tonConnectUI])

    const dialogContent = <div>
        {transaction?.hash != null && <>
            <div className={"text text-xs break-all"} onClick={copyTextHandler(transaction.hash)}>
                <b>Hash</b>: {transaction.hash}</div>
            <Link className={"link link-primary"} href={`${TONVIEWER_BASE_PATH}/transaction/${transaction}`}
                  target={"_blank"}>Tonviewer</Link></>}
        <Link href={`/`}
              className={"btn btn-block btn-primary mt-6"}>Close</Link>
    </div>

    const sessionExpiredDialogContent = <>
        <div className={"text text-lg text-center w-full"}>Session has expired</div>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={renewSession}>Renew Session
        </button>
        <button className={"btn btn-block btn-primary btn-outline mt-6"}
                onClick={() => setTransaction(null)}>Close
        </button>
    </>
    const unknownErrorDialogContent = <div>
        <span className={"text text-error"}>Something went wrong...</span>
        <button className={"btn btn-block btn-primary mt-6"}
                onClick={() => setTransaction(null)}>Close
        </button>
    </div>

    const isInTelegram = !(tgInitData == null || tgInitData === '')
    const tgMainButtonProps: TgMainButtonProps = useMemo(() => ({
        text: "Send Reply",
        onClick: onReplyClick,
        enabled: myReply.trim() !== '',
        visible: replyShown && transaction === null
    }), [onReplyClick, myReply, replyShown, transaction])
    useEffect(() => {
        tgMainButton.setProps(tgMainButtonProps)
    }, [tgMainButtonProps, tgMainButton]);
    useEffect(() => {
        return () => {
            tgMainButton.setProps({...tgMainButtonProps, visible: false})
            setTransaction(null);
        }
    }, []);

    return <>
        {transaction != null && <TransactionSucceedDialog content={dialogContent}/>}
        {transaction !== null && transaction.error != null &&
            <TransactionErrorDialog
                content={transaction.error === 'unauthorized' ? sessionExpiredDialogContent : unknownErrorDialogContent}/>}
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