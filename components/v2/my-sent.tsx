import MessageListItem from "@/components/v2/msg-list-item";
import {useContext, useEffect} from "react";
import {MySubmittedQuestionsContext} from "@/context/my-questions-context";
import {QuestionData} from "@/stores/questions-store";
import {MyAccountInfoContext} from "@/context/my-account-context";

export default function MySent() {
    const context = useContext(MySubmittedQuestionsContext)
    const myAccountInfo = useContext(MyAccountInfoContext).info
    useEffect(() => {
        if (myAccountInfo != null) {
            for (let i = 0; i < myAccountInfo.submittedCount; i++) {
                setTimeout(() => context.fetch(myAccountInfo.submittedCount - 1 - i), 1000 * i)
            }
        }
    }, [myAccountInfo, context.fetch]);
    const items: { isLoading: boolean; id: number; data: QuestionData }[] = context.items
        .filter(x => x != null)
        .filter(x => x.data != null)
        .map(x => x as { isLoading: boolean, id: number, data: QuestionData })
        .sort((a, b) => b.data.createdAt - a.data.createdAt)

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Sent</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {items.length === 0 && <h2 className={"text text-sm font-italic"}>No sent messages</h2>}
            {items.map(({data}) => <MessageListItem key={data.addr.toString()}
                                                    addr={data.to}
                                                    link={`/q-details?owner_id=${data.to.toString()}&q_id=${data.id}`}
                                                    isClosed={data.isClosed}
                                                    isRejected={data.isRejected}
                                                    className={"mt-1"}
                                                    createdAt={data.createdAt * 1000}
                                                    amount={data.minPrice}/>)}
        </div>
    </div>
}