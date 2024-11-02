export default function AccountCreationStatusDialog() {
    return <div className={"min-w-full min-h-full w-full h-full absolute z-30 bg-base-100 left-0 top-0 flex items-start"}>
        <div className={"flex flex-col items-center justify-center mt-20 w-full"}>
            <div className={"w-[125px] h-[125px] loading loading-ring"}></div>
            <div className={"p-4 flex items-center justify-center flex-col"}>
                <div className={"text-lg"}>Account creation is in progress...</div>
                <div className={"text-xs mt-2"}>It could take up to a minute</div>
                <div className={"mt-5"}>

                </div>
            </div>
        </div>
    </div>
}