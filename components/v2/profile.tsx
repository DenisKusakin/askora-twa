import {fetchAccountInfo} from "@/stores/profile-store";
import {Address, fromNano} from "@ton/core";
import Link from "next/link";
import {useEffect, useState} from "react";
import copyTextHandler from "@/utils/copy-util";
import {AccountInfo} from "@/context/my-account-context";

export default function Profile({owner}: { owner: Address }) {
    const [data, setData] = useState<{ isLoading: boolean, data: AccountInfo | null }>({isLoading: true, data: null})

    useEffect(() => {
        setData({isLoading: true, data: null})
        fetchAccountInfo(owner)
            .then(data => setData({isLoading: false, data}))
            .catch(() => setData({isLoading: false, data: null}))
    }, [owner]);
    if (data.isLoading) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    if (data.data == null) {
        return <div className={"pt-10 text text-error text-xl"}>
            Account does not exist
        </div>
    }

    const priceUserFriendly = parseFloat(fromNano(data.data.price))

    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            <div className={"text-neutral text-xl"}>Price</div>
            <div className={""}>
                <span className={"text-5xl font-bold"}>{priceUserFriendly}</span>
                <span className={"text-3xl ml-2"}>TON</span>
            </div>
            {data?.data?.description != null && data?.data?.description !== '' ? <div className={"text mt-2 text-base italic text-center"}>
                &quot;{data?.data?.description}&quot;
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
                     onClick={copyTextHandler(data.data.address.toString())}>{data.data.address.toString()}</div>
            </div>
        </div>
    </div>
}