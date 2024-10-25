'use client';

import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAccountInfo, $myProfile} from "@/stores/profile-store";

export default function MyDetailsPage(){
    const myAccountInfo = useStoreClient($myAccountInfo)
    const myProfile = useStoreClient($myProfile)
    if(myProfile == null || myAccountInfo == null) {
        return <div className={"loading loading-dots loading-lg pt-10"}></div>
    }
    return <div className={"pt-10"}>
        <div className={"flex flex-col"}>
            <span className={"text-sm font-light"}>My Wallet Address</span>
            <div onClick={() => {
                navigator.clipboard.writeText(myProfile.address.toString())
            }}>
                <span className={"text-base break-all"}>{myProfile.address.toString()}</span>
            </div>
        </div>
        <div className={"divider m-1"}></div>
        <div className={"flex flex-col mt-2"}>
            <span className={"text-sx font-light"}>My Account Address</span>
            <div onClick={() => {
                navigator.clipboard.writeText(myAccountInfo.address.toString())
            }}>
                <span className={"text-base break-all"}>{myAccountInfo.address.toString()}</span>
            </div>
        </div>
    </div>
}