import MessageListItem from "@/components/v2/msg-list-item";
import {Address} from "@ton/core";
import {useQueries, useQuery} from "@tanstack/react-query";
import {
    fetchAccountAddr,
    fetchQuestionDetailsOptions,
    fetchSubmittedQuestionAddrOptions, useAccountInfo
} from "@/components/queries/queries";

export default function AccountSent({owner}: { owner: Address }) {
    const accountInfo = useAccountInfo(owner)
    const accountContractAddr = useQuery(fetchAccountAddr({
        ownerAddr: owner.toString(),
    })).data

    const questionContractsAddressesQuery = useQueries({
        queries: Array.from(Array(accountInfo.data?.submittedCount).keys())
            .map(i => fetchSubmittedQuestionAddrOptions(accountContractAddr?.toString() as string, i, accountContractAddr != null))
    })
    const questions = useQueries({
        queries: questionContractsAddressesQuery
            .map(x => x?.data?.toString())
            .map(x => fetchQuestionDetailsOptions(x))
    })
    const data = questions
        .map(x => x.data)
        .filter(x => x != null)
        .sort((a, b) => b.createdAt - a.createdAt)
    const isLoading = questions.find(x => x.isPending) != null

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Sent</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {isLoading && <div className={"loading loading-dots loading-xl"}></div>}
            {!isLoading && data?.map(x => <MessageListItem key={x.addr.toString()} addr={x.from}
                                                                               link={`/q-details?owner_id=${x.to.toString()}&q_id=${x.id}`}
                                                                               isClosed={x.isClosed}
                                                                               isRejected={x.isRejected}
                                                                               className={"mt-1"}
                                                                               createdAt={x.createdAt * 1000}
                                                                               amount={x.minPrice}/>)}
        </div>
    </div>
}