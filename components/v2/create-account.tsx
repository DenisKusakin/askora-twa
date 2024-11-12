import {useContext, useEffect, useState} from "react";
import {toNano} from "@ton/core";
import AccountCreationStatusDialog from "@/components/v2/account-creation-status-dialog";
import {MyAccountInfoContext} from "@/app/context/my-account-context";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {createAccountTransaction} from "@/components/utils/transaction-utils";
import {useMyConnectedWallet} from "@/app/hooks/ton-hooks";

export default function CreateAccount() {
    const myConnectedWallet = useMyConnectedWallet()
    const [price, setPrice] = useState(0)
    const {info, refresh} = useContext(MyAccountInfoContext)
    const [isInProgress, setIsInProgress] = useState(false)
    const [tonConnectUI] = useTonConnectUI();

    useEffect(() => {
        if (isInProgress) {
            if (info?.status === 'active') {
                setIsInProgress(false)
            } else {
                const id = setInterval(refresh, 1000)
                return () => clearInterval(id)
            }
        }
    }, [isInProgress, info, refresh]);

    const onClick = () => {
        if (myConnectedWallet !== null) {
            tonConnectUI.sendTransaction(createAccountTransaction(toNano(price)))
                .then(() => {
                    setIsInProgress(true)
                })
        }
    }

    return <>
        {isInProgress && <AccountCreationStatusDialog/>}
        <div className={"pt-10"}>
            <div className={"flex flex-col items-center"}>
                <div className={"text-neutral text-xl"}>Price (TON)</div>
                <div className={"w-full flex justify-center"}>
                    <input
                        value={isNaN(price) ? '' : price}
                        type={"number"}
                        inputMode="decimal"
                        min={"0"}
                        className={`input text-5xl font-bold w-full text-center`}
                        onChange={(e) => {
                            setPrice(e.target.valueAsNumber)
                        }}/>
                </div>
                <div className={"text text-sm text-center mb-5 mt-5"}>To receive questions, you need to create an
                    account.
                    Specify the price for your reply.
                </div>
            </div>
            <button disabled={isNaN(price)} className={"btn btn-block btn-lg btn-primary mt-2"} onClick={onClick}>Create
                Account
            </button>
            <button className={"btn btn-block btn-outline btn-lg btn-error mt-2"}
                    onClick={() => tonConnectUI?.disconnect()}>Disconnect
            </button>
        </div>
    </>
}