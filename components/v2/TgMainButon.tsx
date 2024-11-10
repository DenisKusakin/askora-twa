import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$tgInitData} from "@/stores/profile-store";
import {useEffect} from "react";

export default function TgMainButton({title, onClick, enabled}: {
    title: string,
    onClick: () => void,
    enabled: boolean
}) {
    const tgInitData = useStoreClientV2($tgInitData)
    const isInTelegram = !(tgInitData === null || tgInitData === '')

    useEffect(() => {
        if (isInTelegram) {
            // @ts-expect-error todo
            if(window.Telegram.WebApp.MainButton !== title){
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.setText(title);
            }
            // @ts-expect-error todo
            if(!window.Telegram.WebApp.MainButton.isVisible){
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.show();
            }
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.onClick(onClick)
            if (enabled) {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.enable();
            } else {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.disable();
            }
            return () => {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.offClick(onClick)
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.hide()
            }
        }

        return () => {
        }
    }, [title, onClick, enabled]);

    return null;
}