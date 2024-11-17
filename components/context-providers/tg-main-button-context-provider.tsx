import {ReactNode, useState} from "react";
import {TgMainButtonContext, TgMainButtonProps} from "@/context/tg-main-button-context";

export default function TgMainButtonContextProvider({children}: { children: ReactNode }) {
    const [currentProps, setCurrentProps] = useState<TgMainButtonProps | null>(null)
    //TODO: What if TG Api is not yet available?
    const setProps = (newProps: TgMainButtonProps) => {
        if (newProps.visible != !currentProps?.visible) {
            if (newProps.visible) {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.show();
            } else {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.hide();
            }
        }
        if (newProps.enabled !== !currentProps?.enabled) {
            if (newProps.enabled) {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.enable();
            } else {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.disable();
            }
        }
        if (currentProps?.text !== newProps.text) {
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.setText(newProps.text);
        }
        if (currentProps?.onClick != newProps.onClick) {
            if (currentProps?.onClick != null) {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.offClick(currentProps?.onClick)
            }
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.onClick(newProps.onClick)
        }
        setCurrentProps(newProps)
    }
    return <TgMainButtonContext.Provider value={{setProps}}>
        {children}
    </TgMainButtonContext.Provider>
}