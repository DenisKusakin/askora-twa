import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAssignedQuestions} from "@/stores/questions-store";
import MessageListItem from "@/components/v2/msg-list-item";

export default function MyInbox() {
    const assigned = useStoreClient($myAssignedQuestions)

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Inbox</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {assigned?.isLoading && <div className={"loading loading-dots loading-xl"}></div>}
            {!assigned?.isLoading && assigned?.data?.length === 0 && <h2 className={"text text-sm font-italic"}>No incoming messages</h2>}
            {!assigned?.isLoading && assigned?.data?.map(x => <MessageListItem key={x.addr.toString()} addr={x.from}
                                                                               link={`/my-question?id=${x.id}`}
                                                                               isClosed={x.isClosed}
                                                                               isRejected={x.isRejected}
                                                                               className={"mt-1"}
                                                                               createdAt={x.createdAt * 1000}
                                                                               amount={x.minPrice}/>)}
        </div>
    </div>
}