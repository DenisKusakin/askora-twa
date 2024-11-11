'use client';

import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myConnectedWallet} from "@/stores/profile-store";
import CreateAccount from "@/components/v2/create-account";
import {tonConnectUI} from "@/stores/ton-connect";
import copyTextHandler from "@/utils/copy-util";
import {useContext} from "react";
import {MyAccountInfoContext} from "@/app/context/my-account-context";

export default function MyDetailsPage() {
    const myAccountInfo = useContext(MyAccountInfoContext).info
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
            <div onClick={copyTextHandler(myConnectedWallet.toString())}>
                <span className={"text-base break-all"}>{myConnectedWallet.toString()}</span>
            </div>
        </div>
        <div className={"divider m-1"}></div>
        <div className={"flex flex-col mt-2"}>
            <span className={"text-sx font-light"}>My Account Address</span>
            <div onClick={copyTextHandler(myAccountInfo.address.toString())}>
                <span className={"text-base break-all"}>{myAccountInfo.address.toString()}</span>
            </div>
        </div>
    </div>
}