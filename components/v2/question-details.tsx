import {QuestionData} from "@/stores/questions-store";
import {Address, fromNano} from "@ton/core";
import {useState} from "react";
import {rejectQuestion, replyToQuestion} from "@/stores/transactions";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myProfile} from "@/stores/profile-store";

export default function QuestionDetails({question}: { question: QuestionData }) {
    const myProfile = useStoreClient($myProfile)
    const [myReply, setMyReply] = useState<string>('')

    let additional_class = "text-base"
    if (question.isRejected) {
        additional_class = "text-error"
    } else if (question.isClosed) {
        additional_class = "text-success"
    }
    const isMyQuestion = myProfile?.address?.toRawString() === question.to.toRawString()
    function isYou(addr: Address){
        return myProfile?.address != null && addr.equals(myProfile?.address)
    }

    return <div className={"pt-10"}>
        <div className={"mt-4"}>
            <span className={`text-5xl ${additional_class}`}>{parseFloat(fromNano(question.balance)).toFixed(3)}</span>
            <span className={`ml-2 text-3xl ${additional_class}`}>TON</span>
        </div>
        <div className={"flex flex-col"}>
            <span className={"text-sm font-light"}>Sender</span>
            <div>
                <span className={"text-base break-all"}>{question.from.toString()}</span>
                {isYou(question.from) && <span className={"text-base italic font-bold ml-1"}>(You)</span>}
            </div>
        </div>
        <div className={"divider m-1"}></div>
        <div className={"flex flex-col mt-2"}>
            <span className={"text-sx font-light"}>Receiver</span>
            <div>
                <span className={"text-base break-all"}>{question.to.toString()}</span>
                {isYou(question.to) && <span className={"text-base italic font-bold ml-1"}>(You)</span>}
            </div>
        </div>
        <div className={"divider m-1"}></div>
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
        {!question.isClosed && isMyQuestion && <>
            <div className={"flex flex-col mt-2"}>
                <div className={"divider m-1"}></div>
                <span className={"text-sx font-light"}>Reply</span>
                <textarea
                    placeholder="Your response"
                    onChange={e => setMyReply(e.target.value)}
                    className="textarea mt-2 textarea-bordered textarea-lg w-full h-[200px]"></textarea>
            </div>
            <div className={"mt-4 flex flex-row items-center justify-between"}>
                <button className={"btn btn-outline btn-xl btn-error"}
                        onClick={() => rejectQuestion(question.addr)}>Reject
                </button>
                <button className={"btn btn-outline btn-xl btn-primary"}
                        onClick={() => replyToQuestion(question.addr, myReply)}
                        disabled={myReply.trim() === ''}>Send Reply
                </button>
            </div>
        </>}
    </div>
}