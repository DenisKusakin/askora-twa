import QuestionDetails from "@/components/v2/question-details";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAssignedQuestions} from "@/stores/questions-store";

export default function MyQuestionDetails({id}: { id: number }) {
    const data = useStoreClient($myAssignedQuestions)
    if (data?.isLoading) {
        return <div className={"pt-10 loading loading-dots loading-lg"}></div>
    }
    const qData = data?.data.find(x => x.id === id)
    if (qData == null) {
        return <div className={"pt-10"}>Error: not found</div>
    }
    return <QuestionDetails question={qData}/>
}