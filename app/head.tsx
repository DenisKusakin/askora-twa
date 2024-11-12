'use client';

import Script from "next/script";
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
            tgContext.setTgStartParam(window.Telegram.WebApp.initDataUnsafe.start_param || null)
            // @ts-expect-error todo
            if (window.Telegram.WebApp?.initData != null && window.Telegram.WebApp?.initData != '') {
                tgContext.setTgInfo({
                    // @ts-expect-error todo
                    tgId: window.Telegram.WebApp.initDataUnsafe.user.id.toString(),
                    // @ts-expect-error todo
                    tgInitData: window.Telegram.WebApp?.initData
                })
            } else {
                tgContext.setTgInfo(null)
            }
        }
    }}/>
}