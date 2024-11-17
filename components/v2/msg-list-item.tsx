import {Address, fromNano} from "@ton/core";
import Link from "next/link";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import {format} from "timeago.js";

export default function MessageListItem({addr, amount, createdAt, className, isClosed, isRejected, link}: {
    addr: Address,
    createdAt: number,
    amount: bigint,
    className?: string,
    isClosed: boolean,
    isRejected: boolean,
    link: string
}) {
    let additional_class = "text-base"
    if (isRejected) {
        additional_class = "text-error"
    } else if (isClosed) {
        additional_class = "text-success"
    }
    // const link = `/?view=my-inbox-q-details&id=${id}`
    return <Link href={link} className={`btn btn-block ${className || ''}`}>
        <div className={"flex flex-row justify-between w-full"}>
            <div className={"flex flex-col w-9/12"}>
                <div className={"text-lg text-left"}>{userFriendlyStr(addr.toString())}</div>
                <div className={"text-sx font-light text-left"}>{format(createdAt)}</div>
            </div>
            <div className={"flex flex-row w-3/12 justify-center"}>
                <div className={"flex flex-row justify-center items-center"}>
                    <div
                        className={`text-lg text-right ${additional_class}`}>{parseFloat(fromNano(amount))}</div>
                    <div className={`ml-1 text-xs ${additional_class}`}>TON</div>
                </div>
            </div>
        </div>
    </Link>
}