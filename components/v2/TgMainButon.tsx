import {useEffect} from "react";

export default function TgMainButton({title, onClick, enabled}: {
    title: string,
    onClick: () => void,
    enabled: boolean,
    shown: boolean
}) {
    useEffect(() => {
        const onClickCopy = onClick;
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.setText(title);
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.show();
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.offClick(onClickCopy)
        // @ts-expect-error todo
        window.Telegram.WebApp.MainButton.onClick(onClick)
        if (enabled) {
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.enable();
        } else {
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.disable();
        }
    }, [title, enabled, onClick]);
    useEffect(() => {
        // @ts-expect-error todo
        return () => window.Telegram.WebApp.MainButton.hide()
    }, []);
    return null;
}