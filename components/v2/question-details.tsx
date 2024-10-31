import {QuestionData} from "@/stores/questions-store";
import {Address, fromNano} from "@ton/core";
import {useState} from "react";
import {rejectQuestion, replyToQuestion} from "@/stores/transactions";
import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myConnectedWallet} from "@/stores/profile-store";
import Link from "next/link";
import {showSuccessNotification} from "@/stores/notifications-store";

export default function QuestionDetails({question}: { question: QuestionData }) {
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const [replyShown, setReplyShown] = useState(false)
    const [myReply, setMyReply] = useState<string>('')

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
        rejectQuestion(question.addr)
            .then(() => showSuccessNotification('Reject completed successfully!'))
    }
    const onReplyClick = () => {
        replyToQuestion(question.addr, myReply)
            .then(() => showSuccessNotification('Reply completed successfully'))
    }

    return <div className={"pt-10"}>
        <div className={""}>
            <span className={`${!replyShown ? 'text-5xl' : 'text-xl'} ${additional_class}`}>{parseFloat(fromNano(question.minPrice)).toFixed(3)}</span>
            <span className={`${!replyShown ? 'text-3xl' : 'text-base'} text-3xl ml-2 ${additional_class}`}>TON</span>
        </div>
        {!replyShown && <div className={"flex flex-col"}>
            <span className={"text-sm font-light"}>Sender</span>
            <div onClick={() => {
                navigator.clipboard.writeText(question.from.toString())
            }}>
                <span className={"text-base break-all"}>{question.from.toString()}</span>
                {isYou(question.from) && <span className={"text-base italic font-bold ml-1"}>(You)</span>}
                {!isYou(question.from) &&
                    <Link href={`/account?id=${question.from.toString()}`} className={"ml-2 link link-primary italic"}>Open
                        Profile</Link>}
            </div>
        </div>}
        {!replyShown && <div className={"divider m-1"}></div>}
        {!replyShown && <div className={"flex flex-col mt-2"}>
            <span className={"text-sx font-light"}>Receiver</span>
            <div onClick={() => {
                navigator.clipboard.writeText(question.to.toString())
            }}>
                <span className={"text-base break-all"}>{question.to.toString()}</span>
                {isYou(question.to) && <span className={"text-base italic font-bold ml-1"}>(You)</span>}
                {!isYou(question.to) &&
                    <Link href={`/account?id=${question.to.toString()}`} className={"ml-2 link link-primary italic"}>Open
                        Profile</Link>}
            </div>
            <div className={"divider m-1"}></div>
        </div>}
        <div className={"flex flex-col mt-2"}>
            <span className={"text-sx font-light"}>Message</span>
            <span className={"text-base break-all"}>{question.content}</span>
        </div>
        {replyShown && isMyQuestion && question.isClosed && !question.isRejected && <>
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
                    <button className={"btn btn-block btn-lg btn-primary"}
                            onClick={onReplyClick}
                            disabled={myReply.trim() === ''}>Send Reply
                    </button>
                    <button className={"btn btn-outline btn-block btn-lg btn-error mt-2"}
                            onClick={() => setReplyShown(false)}>Cancel
                    </button>
                </div>
            </>}
        </div>
        }