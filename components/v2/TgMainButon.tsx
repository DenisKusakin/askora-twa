// import {useStoreClientV2} from "@/components/hooks/use-store-client";
// import {$tgInitData} from "@/stores/profile-store";
import {useEffect} from "react";

export default function TgMainButton({title, onClick, enabled}: {
    title: string,
    onClick: () => void,
    enabled: boolean,
    shown: boolean
}) {
    //const tgInitData = useStoreClientV2($tgInitData)
    //const isInTelegram = !(tgInitData === null || tgInitData === '')

    useEffect(() => {
        console.log("Set")
        const onClickCopy = onClick;
        //if (isInTelegram) {
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.setText(title);
        // if (window.Telegram.WebApp.MainButton.text !== title) {
        //     // @ts-expect-error todo
        // }
        // if (!window.Telegram.WebApp.MainButton.isVisible) {
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.show();
        // }
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.offClick(onClickCopy)
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.onClick(onClick)
        // if (enabled && !window.Telegram.WebApp.MainButton.isActive) {
        if (enabled) {
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.enable();
        } else {
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.disable();
        }
        // } else {
        //     // @ts-expect-error todo
        //     window.Telegram.WebApp.MainButton.disable();
        // }
        // return () => {
        //     console.log("Cleanup")
        //     // @ts-expect-error todo
        //     // window.Telegram.WebApp.MainButton.offClick(onClickCopy)
        //     // @ts-expect-error todo
        //     window.Telegram.WebApp.MainButton.hide()
        // }
        //}
    }, [title, enabled, onClick]);
    useEffect(() => {
        // @ts-expect-error todo
        return () => window.Telegram.WebApp.MainButton.hide()
    }, []);
    return null;
}