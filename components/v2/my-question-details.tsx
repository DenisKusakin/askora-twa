import QuestionDetails from "@/components/v2/question-details";
import {useQuery} from "@tanstack/react-query";
import {fetchAccountAddr, fetchQuestionAddrOptions, fetchQuestionDetailsOptions} from "@/components/queries/queries";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import ErrorDialog from "@/components/v2/error-dialog";

export default function MyQuestionDetails({id}: { id: number }) {
    const myWallet = useMyConnectedWallet()
    const accountContractAddr = useQuery(fetchAccountAddr({ownerAddr: myWallet?.toString() || ''}, myWallet != null))
    const questionContractAddr = useQuery(fetchQuestionAddrOptions(accountContractAddr.data?.toString(), id, accountContractAddr.data != null))
    const {isLoading, data, isError} = useQuery(fetchQuestionDetailsOptions(questionContractAddr.data?.toString()))

    if (isLoading) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    if (isError) {
        return <ErrorDialog content={<></>} text={"Something went wrong"}/>
    }
    return data != null && <QuestionDetails question={{...data, id}}/>
}