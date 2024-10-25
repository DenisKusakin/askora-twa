import {AccountInfo, fetchAccountInfo} from "@/stores/profile-store";
import {Address, fromNano} from "@ton/core";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function Profile({owner}: { owner: Address }) {
    const [data, setData] = useState<{ isLoading: boolean, data: AccountInfo | null }>({isLoading: true, data: null})
    // const connectedProfile = useStoreClient($myProfile)

    useEffect(() => {
        setData({isLoading: true, data: null})
        fetchAccountInfo(owner).then(data => setData({isLoading: false, data}))
    }, [owner]);
    if (data.isLoading) {
        return <div className={"pt-10"}>
            <div className={"loading loading-dots loading-lg"}></div>
        </div>
    }

    const priceUserFriendly = data?.data != null ? parseFloat(fromNano(data.data.price)) : 0

    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            <div className={"text-neutral text-xl"}>Price</div>
            <div className={""}>
                <span className={"text-5xl font-bold"}>{priceUserFriendly}</span>
                <span className={"text-3xl ml-2"}>TON</span>
            </div>
            <div className={"mt-10 w-full"}>
                <Link href={`/account/inbox?id=${owner.toString()}`} className="btn btn-block">
                    <span className={"text-2xl"}>Inbox</span>
                    <div className="badge badge-secondary">+99</div>
                </Link>
                <Link href={`/account/sent?id=${owner.toString()}`} className="btn btn-block mt-5">
                    <span className={"text-2xl"}>Sent</span>
                    <div className="badge badge-secondary">3</div>
                </Link>
            </div>
            <div className={"mt-10 w-full"}>
                <Link href={`/account/ask?id=${owner.toString()}`} className={"btn btn-primary btn-block btn-lg"}>Ask</Link>
            </div>
        </div>
    </div>
}