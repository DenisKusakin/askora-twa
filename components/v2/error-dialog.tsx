import {ReactElement, useEffect} from "react";

export default function ErrorDialog({content, text}: { content: ReactElement, text: string }) {
    useEffect(() => {
        //@ts-expect-error todo
        if (window.Telegram?.WebApp?.HapticFeedback != null) {
            //@ts-expect-error todo
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
        }
    }, [])
    return <div
        className={"min-w-full min-h-full w-full h-full absolute z-30 bg-base-100 left-0 top-0 flex items-start"}>
        <div className={"flex flex-col items-center justify-center mt-20 w-full"}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[125px] w-[125px] shrink-0 stroke-current text-error"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className={"p-4 flex items-center justify-center flex-col"}>
                <div className={"text-lg"}>{text}</div>
                <div className={"mt-5"}>
                    {content}
                </div>
            </div>
        </div>
    </div>
}