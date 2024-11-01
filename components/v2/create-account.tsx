import CurrencyInput from "react-currency-input-field";
import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myConnectedWallet} from "@/stores/profile-store";
import {useState} from "react";
import {Address, toNano} from "@ton/core";
import {createAccount} from "@/stores/transactions";
import {tonConnectUI} from "@/stores/ton-connect";
import {waitUntilAccountCreated} from "@/utils/ton-utils";
import AccountCreationStatusDialog from "@/components/v2/account-creation-status-dialog";

export default function CreateAccount() {
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const [price, setPrice] = useState(0)
    const [isInProgress, setIsInProgress] = useState(false)

    const onClick = () => {
        if (myConnectedWallet !== null) {
            createAccount(toNano(price))
                .then(() => {
                    setIsInProgress(true)
                    return waitUntilAccountCreated(myConnectedWallet as Address)
                        .then(() => setIsInProgress(false))
                })
        }
    }

    return <>
        {isInProgress && <AccountCreationStatusDialog/>}
        <div className={"pt-10"}>
            <div className={"flex flex-col items-center"}>
                {/*<h1 className={"text-xl"}>Create Account</h1>*/}
                <div className={"text-neutral text-xl"}>Price</div>
                <div className={"w-full flex justify-center"}>
                    <CurrencyInput
                        defaultValue={0}
                        className={`input text-3xl font-bold w-full text-center`}
                        readOnly={false}
                        decimalScale={3}
                        decimalsLimit={3}
                        suffix={" TON"}
                        allowNegativeValue={false}
                        min={0.0}
                        onValueChange={(value) => {
                            if (value != undefined) {
                                const valueParsed = parseFloat(value)
                                if (!isNaN(valueParsed)) {
                                    setPrice(valueParsed)
                                }
                            } else {
                                setPrice(0)
                            }
                        }}/>
                </div>
                {/*<div className={"mt-10 flex flex-row w-full"}>*/}
                {/*    <button className={"btn btn-block btn-lg btn-primary ml-4"} onClick={onClick}>Submit</button>*/}
                {/*</div>*/}
                <div className={"text text-sm text-center mb-5"}>To receive questions, you need to create an account.
                    Specify the price for your reply.
                </div>
            </div>
            <button className={"btn btn-block btn-lg btn-primary mt-2"} onClick={onClick}>Submit</button>
            <button className={"btn btn-block btn-outline btn-lg btn-error mt-2"}
                    onClick={() => tonConnectUI?.disconnect()}>Disconnect
            </button>
        </div>
    </>
}