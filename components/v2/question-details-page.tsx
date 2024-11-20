import QuestionDetails from "@/components/v2/question-details";
import {Address} from "@ton/core";
import {useQuery} from "@tanstack/react-query";
import {fetchAccountAddr, fetchQuestionAddrOptions, fetchQuestionDetailsOptions} from "@/components/queries/queries";

export default function QuestionDetailsPage({ownerAddress, id}: { ownerAddress: Address, id: number }) {
    const accountContractAddr = useQuery(fetchAccountAddr({ownerAddr: ownerAddress.toString()}))
    const questionContractAddr = useQuery(fetchQuestionAddrOptions(accountContractAddr.data?.toString(), id, accountContractAddr.data != null))
    const {isLoading, data} = useQuery(fetchQuestionDetailsOptions(questionContractAddr.data?.toString()))

    if (isLoading || data == null) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    return <QuestionDetails question={{...data, id}}/>
}