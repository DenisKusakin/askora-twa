'use client';

import MyProfile from "@/components/v2/my-profile";
import {useEffect, useState} from "react";
import Profile from "@/components/v2/profile";
import {Address} from "@ton/core";

export default function Home() {
    const [accountId, setAccountId] = useState<string | null>(null)
    useEffect(() => {
        // @ts-expect-error todo
        let startParam = window.Telegram.WebApp.initDataUnsafe.start_param
        if (startParam == null) {
            const params = new URL(document.location.toString()).searchParams;
            startParam = params.get('startapp')
        }
        if (startParam != null) {
            setAccountId(startParam)
        }
    }, []);
    let comp = <MyProfile/>;
    if (accountId !== null) {
        comp = <Profile owner={Address.parse(accountId)}/>
    }
    return <div>
        <p className={"text text-sm"}>Start: {accountId}</p>
        {comp}
    </div>
}
