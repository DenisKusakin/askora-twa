'use client';

import {subscribe, unsubscribe} from "@/services/api";
import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {TgConnectionStatus} from "@/app/context/my-account-context";
import {MyTgContext} from "@/app/context/tg-context";
import {useMyConnectedWallet} from "@/app/hooks/ton-hooks";

export default function TgStatusPage() {
    const myConnectedWallet = useMyConnectedWallet()
    const tgConnectionStatusContext = useContext(TgConnectionStatus)
    const tgConnectionStatus = tgConnectionStatusContext.info
    const tgInitData = useContext(MyTgContext).info?.tgInitData
    const [isStatusLoading, setStatusLoading] = useState(tgConnectionStatus === undefined)

    useEffect(() => {
        if (tgConnectionStatus != undefined) {
            setStatusLoading(false)
        }
    }, [tgConnectionStatus]);

    const onTgConnectClick = () => {
        if (tgInitData == null || myConnectedWallet == null) {
            return
        }
        setStatusLoading(true)
        subscribe(tgInitData, myConnectedWallet.toString())
            .then(tgConnectionStatusContext.refresh)
            .then(() => setStatusLoading(false))
    }
    const onTgDisconnectClick = () => {
        if (tgInitData == null || myConnectedWallet == null) {
            return
        }
        setStatusLoading(true)
        unsubscribe(tgInitData, myConnectedWallet.toString())
            .then(tgConnectionStatusContext.refresh)
            .then(() => setStatusLoading(false))
    }
    const isInTelegram = !(tgInitData == null || tgInitData === '')

    return <div className={"pt-10"}>
        <p className={"text text-sm font-light text-center mt-2"}>Linking your Telegram account is optional and allows
            you to receive notifications directly in Telegram. You can change this at any time.</p>
        {!isInTelegram &&
            <Link className={"btn btn-lg btn-block btn-primary mt-4"} target={"_blank"}
                  href={"https://t.me/AskoraBot/app"}>Open Bot</Link>}
        {isInTelegram && tgConnectionStatus === 'not-subscribed' &&
            <button className={"btn btn-lg btn-block btn-primary mt-4"}
                    disabled={isStatusLoading}
                    onClick={onTgConnectClick}>Link Telegram {isStatusLoading &&
                <span className={"loading loading-dots"}></span>}</button>}
        {isInTelegram && tgConnectionStatus === 'subscribed' &&
            <button className={"btn btn-lg btn-block btn-error mt-4"}
                    disabled={isStatusLoading}
                    onClick={onTgDisconnectClick}>Unlink Telegram {isStatusLoading &&
                <span className={"loading loading-dots loading-lg"}></span>}</button>}
        <p className={"text text-sm font-light text-center mt-2"}>🔐Your data is stored securely and only your Telegram
            ID is saved</p>
    </div>
}