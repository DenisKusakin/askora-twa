import MessageListItem from "@/components/v2/msg-list-item";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {useQueries, useQuery} from "@tanstack/react-query";
import {
    fetchAccountAddr,
    fetchQuestionDetailsOptions,
    fetchSubmittedQuestionAddrOptions, useAccountInfo
} from "@/components/queries/queries";

export default function MySent() {
    const myWallet = useMyConnectedWallet()
    const accountInfo = useAccountInfo(myWallet, myWallet != null)
    const accountContractAddr = useQuery(fetchAccountAddr({
        ownerAddr: myWallet?.toString() || '',
    }, myWallet != null)).data

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
        .map((x, i) => ({...x, id: i}))
        .sort((a, b) => b.createdAt - a.createdAt)
    const isLoading = questions.find(x => x.isPending) != null

    return <div className={"pt-10"}>
        <div className={"text-xl flex flex-row"}>
            <div>
                Sent
            </div>
            {isLoading && <div className={"loading loading-dots ml-2"}></div>}
        </div>
        <div className={"flex w-full mt-4 flex-col"}>
            {data.length === 0 && !isLoading && <h2 className={"text text-sm font-italic"}>No sent messages</h2>}
            {data.map(x => <MessageListItem key={x.addr.toString()}
                                                    addr={x.to}
                                                    link={`/q-details?owner_id=${x.to.toString()}&q_id=${x.id}`}
                                                    isClosed={x.isClosed}
                                                    isRejected={x.isRejected}
                                                    className={"mt-1"}
                                                    createdAt={x.createdAt * 1000}
                                                    amount={x.minPrice}/>)}
        </div>
    </div>
}