'use client';

import {useEffect, useState} from "react";
import {Address, fromNano, OpenedContract} from "@ton/core";
import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import {Account} from "@/wrappers/Account";
import {tonClient} from "@/wrappers/ton-client";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import AccountQuestions from "@/components/account-questions-component-v2";
import Link from "next/link";

export default function AccountPage({id}: {id: string}) {
    const [accountState, setAccountState] = useState<{
        isLoading: boolean,
        state: "active" | "uninitialized" | "frozen" | null
    }>({isLoading: true, state: null});
    const [accountOwnerAddr, setAccountOwnerAddr] = useState<Address | null>(null);
    const [accountPrice, setAccountPrice] = useState<bigint | null>(null);
    const [account, setAccount] = useState<OpenedContract<Account> | null>(null)

    useEffect(() => {
        if (id != null) {
            setAccountOwnerAddr(Address.parse(id))
            const acc = Account.createFromConfig({
                owner: Address.parse(id),
                serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
            }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
            const xx = tonClient.open(acc)
            setAccount(xx)
        }
    }, [id]);

    useEffect(() => {
        if (account === null) {
            return;
        }
        console.log("Effect 1")
        tonClient.getContractState(account.address).then(state => {
            setAccountState({isLoading: false, state: state.state})
            if (state.state !== 'active') {
                return;
            }
            account.getPrice().then(setAccountPrice)
        })
    }, [account])

    const accountAddress = accountOwnerAddr != null ? Account.createFromConfig({
        owner: accountOwnerAddr,
        serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
    }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE).address : null

    const alert = <div role="alert" className="alert alert-error mt-10">
        <span>Account does not exist</span>
    </div>

    return <>
        <DisconnectWalletHeader/>
        {accountState.state !== 'active' && alert}
        {accountState.state === 'active' && <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Account Info</h2>
                {accountPrice === null && <span className="loading loading-dots loading-xs"></span>}
                {accountPrice !== null && <h2>Price: {fromNano(accountPrice)} TON</h2>}
            </div>
        </div>}
        <div className={"mt-5"}>
            {accountState.state === 'active' && account !== null && <AccountQuestions account={account}/>}
        </div>
        <div className={"btm-nav w-full bg-primary"}>
            {accountAddress !== null && accountPrice !== null && <Link className="btn btn-block btn-primary" href={`/account?id=${id}&command=submit`}>
                <h1 className={"text-xl"}>Ask</h1>
            </Link>}
        </div>
    </>
}