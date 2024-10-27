import {useStoreClient} from "@/components/hooks/use-store-client";
import {$mySubmittedQuestions} from "@/stores/questions-store";
import MessageListItem from "@/components/v2/msg-list-item";

export default function MySent() {
    const assigned = useStoreClient($mySubmittedQuestions)

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Sent</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {assigned?.isLoading && <div className={"loading loading-dots loading-xl"}></div>}
            {!assigned?.isLoading && assigned?.data?.length === 0 && <h2 className={"text text-sm font-italic"}>No sent messages</h2>}
            {!assigned?.isLoading && assigned?.data?.map(x => <MessageListItem key={x.addr.toString()}
                                                                               addr={x.to}
                                                                               link={`/q-details?owner_id=${x.to.toString()}&q_id=${x.id}`}
                                                                               isClosed={x.isClosed}
                                                                               isRejected={x.isRejected}
                                                                               className={"mt-1"}
                                                                               createdAt={x.createdAt * 1000}
                                                                               amount={x.minPrice}/>)}
        </div>
    </div>
}