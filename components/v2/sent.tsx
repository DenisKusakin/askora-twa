import Link from "next/link";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$mySubmittedQuestions} from "@/stores/questions-store";
import {Address, fromNano} from "@ton/core";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import {format} from "timeago.js";

function Item({amount, createdAt, className, owner, id, isClosed, isRejected}: {
    addr: Address,
    owner: Address,
    createdAt: number,
    amount: bigint,
    className?: string,
    id: number,
    isClosed: boolean,
    isRejected: boolean
}) {
    let additional_class = "text-base"
    if (isRejected) {
        additional_class = "text-error"
    } else if (isClosed) {
        additional_class = "text-success"
    }
    return <Link href={`/q-details?owner_id=${owner.toString()}&q_id=${id}`}
                 className={`btn btn-block ${className || ''}`}>
        <div className={"flex flex-row justify-between w-full"}>
            <div className={"flex flex-col w-9/12"}>
                <div>
                    <div className={"text-lg text-left"}>{userFriendlyStr(owner.toString())}</div>
                </div>
                <div className={"text-sx font-light text-left"}>{format(createdAt)}</div>
            </div>
            <div className={"flex flex-row w-3/12 justify-center"}>
                <div className={"flex flex-row justify-center items-center"}>
                    <div
                        className={`text-lg text-right ${additional_class}`}>{parseFloat(fromNano(amount)).toFixed(3)}</div>
                    <div className={`ml-1 text-xs ${additional_class}`}>TON</div>
                </div>
            </div>
        </div>
    </Link>
}

export default function MySent() {
    const assigned = useStoreClient($mySubmittedQuestions)

    return <div className={"pt-10"}>
        <div className={"text-xl"}>Sent</div>
        <div className={"flex w-full mt-4 flex-col"}>
            {assigned?.isLoading && <div className={"loading loading-dots loading-xl"}></div>}
            {!assigned?.isLoading && assigned?.data?.map(x => <Item key={x.addr.toString()} addr={x.from}
                                                                    id={x.id}
                                                                    owner={x.to}
                                                                    isClosed={x.isClosed}
                                                                    isRejected={x.isRejected}
                                                                    className={"mt-1"}
                                                                    createdAt={x.createdAt * 1000}
                                                                    amount={x.balance}/>)}
        </div>
    </div>
}