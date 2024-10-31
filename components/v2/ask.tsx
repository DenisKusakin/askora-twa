import {Address, fromNano, toNano} from "@ton/core";
import {useEffect, useState} from "react";
import {$myConnectedWallet, AccountInfo, fetchAccountInfo} from "@/stores/profile-store";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import {submitQuestion} from "@/stores/transactions";
import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {showSuccessNotification} from "@/stores/notifications-store";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Ask({addr}: { addr: Address }) {
    const [text, setText] = useState("")
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const [accountInfo, setAccountInfo] = useState<{ isLoading: boolean, data?: AccountInfo }>({isLoading: true})
    const router = useRouter()
    useEffect(() => {
        setAccountInfo({isLoading: true})
        fetchAccountInfo(addr)
            .then(data => setAccountInfo({isLoading: false, data}))
    }, [addr]);
    if (accountInfo.isLoading || accountInfo.data == null || myConnectedWallet === undefined) {
        return <div className={"pt-10 loading loading-lg loading-dots"}/>
    }
    if (myConnectedWallet !== null && myConnectedWallet.equals(addr)) {
        return <>
            <h1 className={"pt-10 text-xl text-error"}>This is your account</h1>
            <Link href={"/"} className={"link link-primary link-lg"}>My Profile</Link>
        </>
    }

    const isDisabled = text === ''
    const transactionFee = toNano(0.06)
    //@ts-expect-error todo
    const serviceFee = (accountInfo.data.price / 100n) * 5n
    const totalFee = accountInfo.data.price + transactionFee + serviceFee
    const accountRewardFormatted = parseFloat(fromNano(accountInfo.data.price)).toFixed(3)
    const totalFeeFormatted = parseFloat(fromNano(totalFee)).toFixed(3)
    const serviceFeeFormatted = parseFloat(fromNano(serviceFee)).toFixed(3)
    const transactionFeeFormatted = parseFloat(fromNano(transactionFee)).toFixed(3)

    const onSubmit = () => {
        if (accountInfo.data == null) {
            return;
        }
        submitQuestion(accountInfo.data?.address, text, totalFee)
            .then(() => {
                showSuccessNotification('Success!')
                router.push(`/account?id=${addr}`)
            })
    }

    return <div className={"pt-10"}>
        <div>
            <div className={"text font-light"}>Question for</div>
            <div className={""}>{userFriendlyStr(accountInfo.data.address.toString())}</div>
            <div className={"text font-light mt-1"}>Price</div>
            <div className={"text text-sm"}>reward + service fee + transaction const</div>
            <div
                className={"text"}>{totalFeeFormatted}={accountRewardFormatted} + {serviceFeeFormatted} + {transactionFeeFormatted}</div>
        </div>
        <textarea className={"textarea textarea-bordered textarea-lg mt-4 w-full h-[200px]"} value={text}
                  onChange={e => setText(e.target.value)}/>
        <button disabled={isDisabled} onClick={onSubmit} className={"btn btn-primary btn-block btn-lg mt-4"}>Submit</button>
    </div>
}