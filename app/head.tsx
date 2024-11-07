'use client';

import Script from "next/script";
import {$tgStartParam} from "@/stores/tg-store";
import {$tgId} from "@/stores/profile-store";

export default function MyHead() {
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
            if (window.Telegram.WebApp?.user?.id != null){
                // @ts-expect-error todo
                $tgId.set(window.Telegram.WebApp.user.id.toString())
            } else {
                $tgId.set(null)
            }
        }
    }}/>
}