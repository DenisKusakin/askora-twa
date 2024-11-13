import {ReactElement, useEffect} from "react";

export default function TransactionSucceedDialog({content}: { content: ReactElement }) {
    useEffect(() => {
        //@ts-expect-error todo
        if (window.Telegram?.WebApp?.HapticFeedback != null) {
            //@ts-expect-error todo
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
        }
    }, [])
    return <div
        className={"min-w-full min-h-full w-full h-full absolute z-30 bg-base-100 left-0 top-0 flex items-start"}>
        <div className={"flex flex-col items-center justify-center mt-20 w-full"}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[125px] w-[125px] shrink-0 stroke-current text-success"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className={"p-4 flex items-center justify-center flex-col"}>
                <div className={"text-lg"}>Transaction has been issued</div>
                <div className={"text-xs mt-2"}>It could take up to a minute for this change to be applied</div>
                <div className={"mt-5"}>
                    {content}
                </div>
            </div>
        </div>
    </div>
}