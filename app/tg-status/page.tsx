'use client';

import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {
    $connectionStatusChanged,
    $myConnectedWallet,
    $tgConnectionStatus,
    $tgInitData
} from "@/stores/profile-store";
import {subscribe, unsubscribe} from "@/services/api";
import Link from "next/link";

export default function TgStatusPage() {
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const tgConnectionStatus = useStoreClientV2($tgConnectionStatus)
    const tgInitData = useStoreClientV2($tgInitData)

    const onTgConnectClick = () => {
        if (tgInitData == null || myConnectedWallet == null) {
            return
        }
        subscribe(tgInitData, myConnectedWallet.toString())
            .then(() => $connectionStatusChanged.set(true))
    }
    const onTgDisconnectClick = () => {
        if (tgInitData == null || myConnectedWallet == null) {
            return
        }
        unsubscribe(tgInitData, myConnectedWallet.toString())
            .then(() => $connectionStatusChanged.set(true))
    }
    const isInTelegram = !(tgInitData === null || tgInitData === '')

    return <div className={"pt-10"}>
        <p className={"text text-sm font-light text-center mt-2"}>Connecting your Telegram account is optional, but it
            lets you receive notifications directly in Telegram</p>
        <p className={"text text-sm font-light text-center mt-2"}>🔐Your data is stored securely, with only your Telegram
            ID saved</p>
        {!isInTelegram &&
            <Link className={"btn btn-lg btn-block btn-primary mt-4"} target={"_blank"}
                  href={"https://t.me/AskoraBot/app"}>Open Bot</Link>}
        {isInTelegram && tgConnectionStatus === 'not-subscribed' &&
            <button className={"btn btn-lg btn-block btn-primary mt-4"} onClick={onTgConnectClick}>Connect</button>}
        {isInTelegram && tgConnectionStatus === 'subscribed' &&
            <button className={"btn btn-lg btn-block btn-error mt-4"} onClick={onTgDisconnectClick}>Disconnect</button>}
    </div>
}