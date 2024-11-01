'use client';

import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myAccountInfo, $myConnectedWallet} from "@/stores/profile-store";
import CreateAccount from "@/components/v2/create-account";
import {tonConnectUI} from "@/stores/ton-connect";

export default function MyDetailsPage() {
    const myAccountInfo = useStoreClientV2($myAccountInfo)
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)

    if (myConnectedWallet === undefined || myAccountInfo === undefined) {
        return <div className={"pt-10 loading loading-dots loading-lg"}></div>
    }
    const onConnectClick = () => {
        tonConnectUI?.modal?.open()
    }
    if (myConnectedWallet === null) {
        return <div className={"pt-10"}>
            <button className={"btn btn-outline btn-block btn-primary btn-lg mt-50"} onClick={onConnectClick}>Connect
            </button>
        </div>
    }
    if (myAccountInfo === null) {
        return <CreateAccount/>
    }
    return <div className={"pt-10"}>
        <div className={"flex flex-col"}>
            <span className={"text-sm font-light"}>My Wallet Address</span>
            <div onClick={() => {
                if (myConnectedWallet == null) {
                    return
                }
                navigator.clipboard.writeText(myConnectedWallet.toString())
            }}>
                <span className={"text-base break-all"}>{myConnectedWallet.toString()}</span>
            </div>
        </div>
        <div className={"divider m-1"}></div>
        <div className={"flex flex-col mt-2"}>
            <span className={"text-sx font-light"}>My Account Address</span>
            <div onClick={() => {
                if (myAccountInfo == null) {
                    return
                }
                navigator.clipboard.writeText(myAccountInfo.address.toString())
            }}>
                <span className={"text-base break-all"}>{myAccountInfo.address.toString()}</span>
            </div>
        </div>
    </div>
}