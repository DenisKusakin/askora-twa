import QuestionDetails from "@/components/v2/question-details";
import {fetchQuestionData, QuestionData} from "@/stores/questions-store";
import {useEffect, useState} from "react";
import {Address} from "@ton/core";

export default function QuestionDetailsPage({ownerAddress, id}: { ownerAddress: Address, id: number }) {
    const [data, setData] = useState<{
        isLoading: boolean,
        data?: QuestionData// & { from: Address, to: Address }
    }>({isLoading: true})

    useEffect(() => {
        setData({isLoading: true})
        fetchQuestionData(ownerAddress, id)
            .then(x => setData({isLoading: false, data: x}))
    }, [ownerAddress, id]);
    if (data.isLoading || data.data == null) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    // const qData = data?.data.find(x => x.id === id)
    // if (qData == null) {
    //     return <div className={"pt-10"}>Error: not found</div>
    // }
    return <QuestionDetails question={data.data}/>
}