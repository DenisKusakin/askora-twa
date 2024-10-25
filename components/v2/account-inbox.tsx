import {QuestionData} from "@/stores/questions-store";
import MessageListItem from "@/components/v2/msg-list-item";
import {Address} from "@ton/core";
import {useEffect, useState} from "react";
import {fetchAccountQuestions} from "@/stores/profile-store";

export default function AccountInbox({owner}: { owner: Address }) {
    const [assigned, setAssigned] = useState<{ isLoading: boolean, data: QuestionData[] }>({isLoading: true, data: []})
    useEffect(() => {
        setAssigned({isLoading: true, data: []})
        fetchAccountQuestions(owner)
            .then(data => setAssigned({isLoading: false, data}))
    }, [owner]);

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Inbox</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {assigned?.isLoading && <div className={"loading loading-dots loading-xl"}></div>}
            {!assigned?.isLoading && assigned?.data?.map(x => <MessageListItem key={x.addr.toString()} addr={x.from}
                                                                               link={`/my-question?id=${x.id}`}
                                                                               isClosed={x.isClosed}
                                                                               isRejected={x.isRejected}
                                                                               className={"mt-1"}
                                                                               createdAt={x.createdAt * 1000}
                                                                               amount={x.balance}/>)}
        </div>
    </div>
}