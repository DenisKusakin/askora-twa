import {Address, fromNano, toNano} from "@ton/core";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {fetchAccountInfo} from "@/stores/profile-store";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import Link from "next/link";
import TransactionSucceedDialog from "@/components/v2/transaction-suceed-dialog";
import {AccountInfo} from "@/app/context/my-account-context";
import {MyTgContext} from "@/app/context/tg-context";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {createQuestionTransaction} from "@/components/utils/transaction-utils";
import {useMyConnectedWallet} from "@/app/hooks/ton-hooks";
import {TgMainButtonContext, TgMainButtonProps} from "@/app/context/tg-main-button-context";

export default function Ask({addr}: { addr: Address }) {
    const [text, setText] = useState("")
    const myConnectedWallet = useMyConnectedWallet()
    console.log("My Connected wallet", myConnectedWallet?.toString())
    const [accountInfo, setAccountInfo] = useState<{ isLoading: boolean, data?: AccountInfo }>({isLoading: true})
    const tgInitData = useContext(MyTgContext).info?.tgInitData
    const [tonConnectUI] = useTonConnectUI();
    const tgMainButton = useContext(TgMainButtonContext)

    const transactionFee = toNano(0.1)
    //@ts-expect-error todo
    const serviceFee = accountInfo.data != null ? (accountInfo.data.price / 100n) * 5n : null
    const totalFee = accountInfo.data != null && serviceFee != null ? accountInfo.data.price + transactionFee + serviceFee : null

    useEffect(() => {
        setAccountInfo({isLoading: true})
        fetchAccountInfo(addr)
            .then(data => setAccountInfo({isLoading: false, data}))
    }, [addr]);

    const onSubmit = useCallback(() => {
        if (accountInfo.data == null || totalFee == null) {
            return;
        }
        const transaction = createQuestionTransaction(text, totalFee, accountInfo.data?.address)
        tonConnectUI.sendTransaction(transaction)
            .then(() => setSuccessDialogVisible(true))
    }, [text, totalFee, accountInfo?.data])
    const isDisabled = text === ''

    const tgMainButtonProps: TgMainButtonProps = useMemo(() => ({
        text: `Submit ${text.length}`,
        visible: myConnectedWallet != null,
        enabled: !isDisabled,
        onClick: onSubmit
    }), [myConnectedWallet, isDisabled, onSubmit, text])
    useEffect(() => {
        tgMainButton.setProps(tgMainButtonProps)
    }, [tgMainButtonProps, tgMainButton]);
    useEffect(() => {
        return () => tgMainButton.setProps({...tgMainButtonProps, visible: false})
    }, []);

    const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false)

    if (accountInfo.isLoading || accountInfo.data == null || myConnectedWallet === undefined) {
        return <div className={"pt-10 loading loading-lg loading-dots"}/>
    }
    if (myConnectedWallet !== null && myConnectedWallet.equals(addr)) {
        return <>
            <h1 className={"pt-10 text-xl text-error"}>This is your account</h1>
            <Link href={"/"} className={"link link-primary link-lg"}>My Profile</Link>
        </>
    }

    const accountRewardFormatted = parseFloat(fromNano(accountInfo.data.price)).toFixed(3)
    const totalFeeFormatted = totalFee != null ? parseFloat(fromNano(totalFee)).toFixed(3) : null
    const serviceFeeFormatted = serviceFee != null ? parseFloat(fromNano(serviceFee)).toFixed(3) : null
    const transactionFeeFormatted = parseFloat(fromNano(transactionFee)).toFixed(3)

    const transactionSuccessLinks = <>
        <Link href={`/account?id=${addr}`}
              className={"btn btn-block btn-primary"}>Close</Link>
        <Link href={`/`} className={"btn btn-block btn-outline btn-primary mt-5"}>My Account Page</Link>
    </>
    const onConnectClick = () => {
        tonConnectUI.openModal()
    }
    const isInTelegram = !(tgInitData == null || tgInitData === '')

    return <>
        {isSuccessDialogVisible && <TransactionSucceedDialog content={transactionSuccessLinks}/>}
        <div className={"pt-10"}>
            <div>
                <div className={"text font-light"}>Question for</div>
                <div className={""}>{userFriendlyStr(accountInfo.data.address.toString())}</div>
                <div className={"text font-light mt-1"}>Price</div>
                <div className={"text text-sm"}>reward + service fee + transaction const</div>
                <div
                    className={"text"}>{totalFeeFormatted}={accountRewardFormatted} + {serviceFeeFormatted} + {transactionFeeFormatted}</div>
                <div className={"text text-sm"}>unused transaction fees are refunded instantly</div>
            </div>
            <textarea className={"textarea textarea-bordered textarea-lg mt-4 w-full h-[200px]"} value={text}
                      onChange={e => setText(e.target.value)}/>
            {myConnectedWallet != null && !isInTelegram && <button disabled={isDisabled} onClick={onSubmit}
                                                                   className={"btn btn-primary btn-block btn-lg mt-4"}>Submit
            </button>}
            {/*{<TgMainButton shown={myConnectedWallet != null} enabled={!isDisabled} onClick={onSubmit}*/}
            {/*               title={"Submit"}/>}*/}
            {myConnectedWallet === null &&
                <button className={"btn btn-block btn-primary btn-lg mt-4"} onClick={onConnectClick}>Connect
                </button>}
        </div>
    </>
}