import {QuestionData} from "@/stores/questions-store";
import MessageListItem from "@/components/v2/msg-list-item";
import {Address} from "@ton/core";
import {useEffect, useState} from "react";
import {fetchAccountSubmittedQuestions} from "@/stores/profile-store";

export default function AccountSent({owner}: { owner: Address }) {
    const [questions, setQuestions] = useState<{ isLoading: boolean, data: QuestionData[] }>({isLoading: true, data: []})
    useEffect(() => {
        setQuestions({isLoading: true, data: []})
        fetchAccountSubmittedQuestions(owner)
            .then(data => setQuestions({isLoading: false, data}))
    }, [owner]);

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Sent</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {questions?.isLoading && <div className={"loading loading-dots loading-xl"}></div>}
            {!questions?.isLoading && questions?.data?.map(x => <MessageListItem key={x.addr.toString()} addr={x.from}
                                                                               link={`/q-details?owner_id=${owner.toString()}&q_id=${x.id}`}
                                                                               isClosed={x.isClosed}
                                                                               isRejected={x.isRejected}
                                                                               className={"mt-1"}
                                                                               createdAt={x.createdAt * 1000}
                                                                               amount={x.minPrice}/>)}
        </div>
    </div>
}