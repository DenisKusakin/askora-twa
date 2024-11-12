import MessageListItem from "@/components/v2/msg-list-item";
import {useContext, useEffect} from "react";
import {MyAssignedQuestionsContext} from "@/app/context/my-questions-context";
import {QuestionData} from "@/stores/questions-store";
import {MyAccountInfoContext} from "@/app/context/my-account-context";

export default function MyInbox() {
    const context = useContext(MyAssignedQuestionsContext)
    const myAccountInfo = useContext(MyAccountInfoContext).info
    useEffect(() => {
        if (myAccountInfo != null) {
            for (let i = 0; i < myAccountInfo.assignedCount; i++) {
                setTimeout(() => context.fetch(myAccountInfo.assignedCount - 1 - i), 1000 * i)
            }
        }
    }, [myAccountInfo, context.fetch]);

    const items: { isLoading: boolean; id: number; data: QuestionData }[] = context.items
        .filter(x => x != null)
        .filter(x => x.data != null)
        .map(x => x as { isLoading: boolean, id: number, data: QuestionData })
        .sort((a, b) => b.data.createdAt - a.data.createdAt)
    return <div className={"pt-10"}>
        <div className={"text-xl"}>Inbox</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {context.items.length === 0 &&
                <h2 className={"text text-sm font-italic"}>No incoming messages</h2>}
            {items.map(({data, id}) => <MessageListItem
                key={data.addr.toString()} addr={data.from}
             link={`/my-question?id=${id}`}
             isClosed={data.isClosed}
             isRejected={data.isRejected}
             className={"mt-1"}
             createdAt={data.createdAt * 1000}
             amount={data.minPrice}/>
        )}
    </div>
</div>
}