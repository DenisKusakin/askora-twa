'use client';

import Script from "next/script";
import {$tgStartParam} from "@/stores/tg-store";

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
        }
    }}/>
}