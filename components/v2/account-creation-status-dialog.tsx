export default function AccountCreationStatusDialog({transactionSendingInProgress, pollingInProgress}: {
    transactionSendingInProgress: boolean,
    pollingInProgress: boolean
}) {
    return <div
        className={"min-w-full min-h-full w-full h-full absolute z-30 bg-base-100 left-0 top-0 flex items-start"}>
        <div className={"flex flex-col items-center justify-center mt-20 w-full"}>
            <div className={"w-[125px] h-[125px] loading loading-ring"}></div>
            <div className={"pt-4 flex items-start justify-center flex-col"}>
                <div className={"text-lg"}>Account creation is in progress...</div>
                <div className={"flex flex-col"}>
                    {transactionSendingInProgress && <div className={"text-sm mt-2"}>Sending transaction...</div>}
                    {!transactionSendingInProgress && <div className={"text-sm mt-1 text-success"}>Transaction has been issued</div>}
                    {pollingInProgress && <div className={"text-sm mt-1"}>Waiting for processing...</div>}
                </div>
            </div>
        </div>
    </div>
}