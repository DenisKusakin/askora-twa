import {Address, fromNano} from "@ton/core";
import Link from "next/link";
import copyTextHandler from "@/utils/copy-util";
import {useQuery} from "@tanstack/react-query";
import {fetchAccountAddr, fetchProfile} from "@/components/queries/queries";

export default function Profile({owner}: { owner: Address }) {
    const addrQuery = useQuery(fetchAccountAddr({ownerAddr: owner.toString()}))
    const fetchProfileOptions = {
        ...fetchProfile({addr: addrQuery.data?.toString() || ''}),
        enabled: addrQuery.data != null
    }
    const {isLoading, data} = useQuery(fetchProfileOptions)
    if (isLoading || data === undefined) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    if (data === null) {
        return <div className={"pt-10 text text-error text-xl"}>
            Account does not exist
        </div>
    }

    const priceUserFriendly = parseFloat(fromNano(data.price))

    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            <div className={""}>
                <span className={"text-5xl font-bold"}>{priceUserFriendly}</span>
                <span className={"text-3xl ml-2"}>TON</span>
            </div>
            {data?.description != null && data?.description !== '' ?
                <div className={"text mt-2 text-base italic text-center"}>
                    &quot;{data?.description}&quot;
                </div> : null}
            <div className={"mt-10 w-full"}>
                <Link href={`/account/inbox?id=${owner.toString()}`} className="btn btn-block">
                    <span className={"text-2xl"}>Inbox</span>
                </Link>
                <Link href={`/account/sent?id=${owner.toString()}`} className="btn btn-block mt-5">
                    <span className={"text-2xl"}>Sent</span>
                </Link>
            </div>
            <div className={"mt-10 w-full"}>
                <Link href={`/account/ask?id=${owner.toString()}`}
                      className={"btn btn-primary btn-block btn-lg"}>Ask</Link>
            </div>
            <div className={"mt-20"}>
                <div className={"text-xs break-all font-light mb-1"}
                     onClick={copyTextHandler(owner.toString())}>{owner.toString()}</div>
                <div className={"text-xs break-all font-light"}
                     onClick={copyTextHandler(data.address.toString())}>{data.address.toString()}</div>
            </div>
        </div>
    </div>
}