'use client';

import Script from "next/script";
import {$tgStartParam} from "@/stores/tg-store";
import {$tgId, $tgInitData} from "@/stores/profile-store";

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
            // $tgStartParam.set({isLoading: false, startParam: '2:0:EQDmfkqHjo0oKBTASCZS2-CSEBt0NTdJz5kFyCsbPH5IgFdL'})
            // @ts-expect-error todo
            if (window.Telegram.WebApp?.initData != null) {
                // @ts-expect-error todo
                $tgInitData.set(window.Telegram.WebApp.initData)
            }
            // @ts-expect-error todo
            if (window.Telegram.WebApp?.initDataUnsafe?.user?.id != null){
                // @ts-expect-error todo
                $tgId.set(window.Telegram.WebApp.initDataUnsafe.user.id.toString())
            } else {
                $tgId.set("0")
            }
        }
    }}/>
}