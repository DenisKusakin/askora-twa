'use client';

import Script from "next/script";
import Router from 'next/router'

export default function MyHead(){
    // const router = useRouter()
    return <Script src="https://telegram.org/js/telegram-web-app.js" onReady={() => {
        if (typeof window !== 'undefined') {
            // @ts-expect-error todo
            window.Telegram.WebApp.BackButton.isVisible = true
            // @ts-expect-error todo
            window.Telegram.WebApp.BackButton.onClick(() => {
                Router.back()
            })
        }
    }}></Script>
}