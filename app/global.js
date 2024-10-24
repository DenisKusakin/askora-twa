import {router} from "next/client";

if (typeof window !== 'undefined') {
    window.Telegram.WebApp.BackButton.isVisible = true
    window.Telegram.WebApp.BackButton.onClick(() => {
        router.back()
    })
}
