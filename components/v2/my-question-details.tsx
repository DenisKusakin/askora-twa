import QuestionDetails from "@/components/v2/question-details";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAssignedQuestions} from "@/stores/questions-store";

export default function MyQuestionDetails({id}: { id: number }) {
    const data = useStoreClient($myAssignedQuestions)
    if (data?.isLoading) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    const qData = data?.data.find(x => x.id === id)
    if (qData == null) {
        return <div className={"pt-10"}>Error: not found</div>
    }
    return <QuestionDetails question={qData}/>
}