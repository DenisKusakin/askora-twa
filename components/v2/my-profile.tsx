import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAccountInfo, $myProfile} from "@/stores/profile-store";
import {fromNano} from "@ton/core";
import Link from "next/link";
import {tonConnectUI} from "@/stores/ton-connect";

export default function MyProfile() {
    const connectedProfile = useStoreClient($myProfile)
    const myProfile = useStoreClient($myAccountInfo)
    const onDisconnectClick = () => {
        tonConnectUI?.disconnect()
    }
    const onConnectClick = () => {
        // tonConnectUI?.openModal()
        tonConnectUI?.modal?.open()
    }
    if (connectedProfile === null) {
        return <div className={"pt-10"}>
            <button className={"btn btn-outline btn-block btn-primary btn-lg mt-50"} onClick={onConnectClick}>Connect
            </button>
        </div>
    }
    const priceUserFriendly = myProfile?.price != null ? parseFloat(fromNano(myProfile?.price)) : 0
    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            <div className={"text-neutral text-xl"}>Price</div>
            <div className={""}>
                <span className={"text-5xl font-bold"}>{priceUserFriendly}</span>
                <span className={"text-3xl ml-2"}>TON</span>
            </div>
            <div className={"mt-10 flex flex-row"}>
                <Link href={"/configure"} className={"btn btn-sm btn-primary btn-outline ml-4"}>Configure</Link>
                <button className={"btn btn-sm btn-primary btn-outline ml-4"}>Share</button>
                <button className={"btn btn-sm btn-error btn-outline ml-4"} onClick={onDisconnectClick}>Disconnect
                </button>
            </div>
            <div className={"mt-10 w-full"}>
                <Link href={"/inbox"} className="btn btn-block">
                    <span className={"text-2xl"}>Inbox</span>
                    <div className="badge badge-secondary">+99</div>
                </Link>
                <Link href={"/sent"} className="btn btn-block mt-5">
                    <span className={"text-2xl"}>Sent</span>
                    <div className="badge badge-secondary">3</div>
                </Link>
                <Link href={"/find"} className={"btn btn-primary btn-outline mt-10 btn-block"}>Find User</Link>
            </div>
        </div>
    </div>
}