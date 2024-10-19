'use client';

import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Address, fromNano, OpenedContract, toNano} from "@ton/core";
import {tonClient} from "@/wrappers/ton-client";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {Account} from "@/wrappers/Account";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {createQuestionTransaction} from "@/components/utils/transaction-utils";
import CurrencyInput from "react-currency-input-field";

export default function CreateQuestionPage() {
    const params = useParams<{ id: string }>();
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
        if (params.id != null) {
            setAccount(tonClient.open(Account.createFromConfig({
                owner: Address.parse(params.id),
                serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
            }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)))
        }
    }, [params.id]);
    useEffect(() => {
        console.log("Transaction")
        account?.getPrice()
            .then(x => parseFloat(fromNano(x)))
            .then(x => {
                const min = parseFloat(fromNano(x)) + 0.06;
                setMinPrice(min);
                setReward(min);
            })
    }, [account]);
    const isError = reward === null || minPrice === null || reward < minPrice;
    const isDisabled = isError || text == null || text.trim() !== ''
    return <div>
        <DisconnectWalletHeader/>
        <textarea
            placeholder="Your question"
            onChange={e => setText(e.target.value)}
            className="textarea textarea-bordered textarea-lg w-full h-[200px] mt-5"></textarea>
        {minPrice != null && reward != null ? <CurrencyInput
            defaultValue={reward}
            className={`input text-7xl input-lg max-w-full mt-5${isError ? ' input-error' : ''}`}
            decimalScale={3}
            decimalsLimit={3}
            allowNegativeValue={false}
            min={minPrice}
            onValueChange={(value) => {
                if (value != undefined) {
                    setReward(parseFloat(value))
                }
            }}/> : null}
        <div className={`btm-nav w-full`}>
            <button className={`btn btn-block btn-primary h-full rounded-none`} disabled={isDisabled} onClick={onClick}>
                <h1 className={"text-2xl"}>Submit</h1>
            </button>
        </div>
    </div>
}