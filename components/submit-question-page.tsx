'use client';

import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import {useEffect, useState} from "react";
import {Address, fromNano, OpenedContract, toNano} from "@ton/core";
import {tonClient} from "@/wrappers/ton-client";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {Account} from "@/wrappers/Account";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {createQuestionTransaction} from "@/components/utils/transaction-utils";
import CurrencyInput from "react-currency-input-field";

export default function CreateQuestionPage({id}: { id: string }) {
    const [account, setAccount] = useState<OpenedContract<Account> | null>(null)

    const [tonConnectUi] = useTonConnectUI()
    const [text, setText] = useState("")
    const [minPrice, setMinPrice] = useState<number | null>(null)
    const [reward, setReward] = useState<number | null>(null)

    const onClick = () => {
        if (account == null || minPrice == null || reward == null) {
            return;
        }
        const transaction = createQuestionTransaction(text, toNano(reward), account.address)
        tonConnectUi.sendTransaction(transaction)
    }

    useEffect(() => {
        if (id != null) {
            setAccount(tonClient.open(Account.createFromConfig({
                owner: Address.parse(id),
                serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
            }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)))
        }
    }, [id]);
    useEffect(() => {
        console.log("Transaction")
        account?.getPrice()
            .then(x => parseFloat(fromNano(x)))
            .then(x => {
                const min = x + 0.06;
                setMinPrice(min);
                setReward(min);
            })
    }, [account]);
    const isError = reward === null || minPrice === null || reward < minPrice;
    const isDisabled = isError || text == null || text.trim() === ''

    const rewardField = minPrice != null && reward != null ? <div className={"flex flex-row mt-5"}>
        <CurrencyInput
            defaultValue={reward}
            className={`input w-4/5 align-middle text-7xl input-lg max-w-full${isError ? ' input-error' : ''}`}
            decimalScale={3}
            decimalsLimit={3}
            allowNegativeValue={false}
            min={minPrice}
            onValueChange={(value) => {
                if (value != undefined) {
                    setReward(parseFloat(value))
                }
            }}/>
        <img className={"w-[50px] h-[50px] ml-1"} src={"/ton_symbol.png"}/>
    </div> : null

    return <div>
        <DisconnectWalletHeader/>
        <textarea
            placeholder="Your question"
            onChange={e => setText(e.target.value)}
            className="textarea textarea-bordered textarea-lg w-full h-[200px] mt-5"></textarea>
        {rewardField}
        <div className={`btm-nav w-full`}>
            <button className={`btn btn-block btn-primary h-full rounded-none`} disabled={isDisabled} onClick={onClick}>
                <h1 className={"text-2xl"}>Submit</h1>
            </button>
        </div>
    </div>
}