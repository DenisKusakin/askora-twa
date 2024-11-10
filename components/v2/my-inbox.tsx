import {useStoreClientV2} from "@/components/hooks/use-store-client";
import MessageListItem from "@/components/v2/msg-list-item";
import {useContext, useEffect} from "react";
import {MyAssignedQuestionsContext} from "@/app/context/my-questions-context";
import {$myAccountInfo} from "@/stores/profile-store";

export default function MyInbox() {
    const context = useContext(MyAssignedQuestionsContext)
    const myAccountInfo = useStoreClientV2($myAccountInfo)
    useEffect(() => {
        if (myAccountInfo != null) {
            for (let i = 0; i < myAccountInfo.assignedCount; i++) {
                setTimeout(() => context.fetch(i), 1000*i)
            }
        }
    }, [myAccountInfo, context.fetch]);

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Inbox</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {context.items.length === 0 &&
                <h2 className={"text text-sm font-italic"}>No incoming messages</h2>}
            {context.items.map(({data, isLoading, id}) => data != null && !isLoading ? <MessageListItem
                key={data.addr.toString()} addr={data.from}
                link={`/my-question?id=${id}`}
                isClosed={data.isClosed}
                isRejected={data.isRejected}
                className={"mt-1"}
                createdAt={data.createdAt * 1000}
                amount={data.minPrice}/> : null)}
        </div>
    </div>
}