import {createContext} from "react";

export type TgMainButtonProps = {
    onClick: () => void,
    text: string,
    enabled: boolean,
    visible: boolean,
    isProgressVisible: boolean
}

export const TgMainButtonContext = createContext<{
    // setOnClick: (handler: () => void) => void,
    // setText: (text: string) => void,
    // enable: () => void,
    // disable: () => void,
    // hide: () => void,
    // show: () => void
    setProps: (props: TgMainButtonProps) => void
}>({
    setProps: () => {}
    // setOnClick: () => {
    // },
    // setText: () => {
    // },
    // hide: () => {
    // },
    // show: () => {
    // },
    // enable: () => {
    // },
    // disable: () => {
    // }
})