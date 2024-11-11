import QuestionDetails from "@/components/v2/question-details";
import {useContext, useEffect} from "react";
import {MyAssignedQuestionsContext} from "@/app/context/my-questions-context";

export default function MyQuestionDetails({id}: { id: number }) {
    const d = useContext(MyAssignedQuestionsContext)

    useEffect(() => {
        d.fetch(id)
    }, [d.fetch, id]);
    const qData = d.items.find(x => x.id === id)
    if (qData === undefined || qData?.isLoading) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    if (qData?.data == null) {
        return <div className={"pt-10"}>Error: not found</div>
    }
    return <QuestionDetails question={qData.data}/>
}