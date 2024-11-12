'use client';

import Script from "next/script";
import {$tgStartParam} from "@/stores/tg-store";
import {$tgInitData} from "@/stores/profile-store";
import {useContext} from "react";
import {MyTgContext} from "@/app/context/tg-context";

export default function MyHead() {
    const tgContext = useContext(MyTgContext)

    return <Script src="https://telegram.org/js/telegram-web-app.js" onReady={() => {
        if (typeof window !== 'undefined') {
            // @ts-expect-error todo
            window.Telegram.WebApp.BackButton.isVisible = true
            // @ts-expect-error todo
            window.Telegram.WebApp.BackButton.onClick(() => {
                window.history.back()
            })
            // @ts-expect-error todo
            $tgStartParam.set({isLoading: false, startParam: window.Telegram.WebApp.initDataUnsafe.start_param})
            // @ts-expect-error todo
            if (window.Telegram.WebApp?.initData != null) {
                // @ts-expect-error todo
                $tgInitData.set(window.Telegram.WebApp.initData)
            } else {
                $tgInitData.set(null)
            }
            // @ts-expect-error todo
            if (window.Telegram.WebApp?.initDataUnsafe?.user?.id != null){
                // @ts-expect-error todo
                tgContext.setTgId(window.Telegram.WebApp.initDataUnsafe.user.id.toString())
            }
        }
    }}/>
}