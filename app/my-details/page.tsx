'use client';

import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAccountInfo, $myProfile} from "@/stores/profile-store";
import CreateAccount from "@/components/v2/create-account";
import {tonConnectUI} from "@/stores/ton-connect";

export default function MyDetailsPage() {
    const myAccountInfo = useStoreClient($myAccountInfo)
    const myProfile = useStoreClient($myProfile)

    if (myProfile == null || myAccountInfo == null || myProfile?.isLoading || myAccountInfo?.isLoading) {
        return <div className={"pt-10 loading loading-dots loading-lg"}></div>
    }
    const onConnectClick = () => {
        tonConnectUI?.modal?.open()
    }
    if (myProfile?.isLoading === false && myProfile.address === null) {
        return <div className={"pt-10"}>
            <button className={"btn btn-outline btn-block btn-primary btn-lg mt-50"} onClick={onConnectClick}>Connect
            </button>
        </div>
    }
    if (myAccountInfo?.isLoading === false && myAccountInfo?.data == null) {
        return <CreateAccount/>
    }
    return <div className={"pt-10"}>
        <div className={"flex flex-col"}>
            <span className={"text-sm font-light"}>My Wallet Address</span>
            <div onClick={() => {
                if (myProfile?.address == null) {
                    return
                }
                navigator.clipboard.writeText(myProfile.address.toString())
            }}>
                <span className={"text-base break-all"}>{myProfile?.address?.toString()}</span>
            </div>
        </div>
        <div className={"divider m-1"}></div>
        <div className={"flex flex-col mt-2"}>
            <span className={"text-sx font-light"}>My Account Address</span>
            <div onClick={() => {
                if (myAccountInfo?.data == null) {
                    return
                }
                navigator.clipboard.writeText(myAccountInfo.data.address.toString())
            }}>
                <span className={"text-base break-all"}>{myAccountInfo?.data?.address.toString()}</span>
            </div>
        </div>
    </div>
}