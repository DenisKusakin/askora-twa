'use client';

import {useTonAddress} from "@tonconnect/ui-react";
import {useEffect, useState} from "react";
import {Address, OpenedContract} from "@ton/core";
import CreateAccount from "@/components/create-account";
import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import {tonClient} from "@/wrappers/ton-client";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {Account} from "@/wrappers/Account";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import AccountQuestions from "@/components/account-questions-component-v2";
import AccountInfo from "@/components/account-info";

export default function MyAccountPage() {
    const tonAddr = useTonAddress();
    const [accountState, setAccountState] = useState<{
        isLoading: boolean,
        state: "active" | "uninitialized" | "frozen" | null
    }>({isLoading: true, state: null});
    const [accountPrice, setAccountPrice] = useState<null | bigint>(null)
    const [account, setAccount] = useState<OpenedContract<Account> | null>(null)

    useEffect(() => {
        if (tonAddr == null || tonAddr === '') {
            return;
        }
        const account = tonClient.open(Account.createFromConfig({
            owner: Address.parse(tonAddr),
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE))
        tonClient.getContractState(account.address)
            .then(state => {
                setAccountState({isLoading: false, state: state.state})
                if (state.state === 'active') {
                    account.getPrice().then(setAccountPrice)
                }
            })
        setAccount(account)
    }, [tonAddr]);

    const alert = <div role="alert" className="alert alert-warning mt-10 flex flex-row">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>You need to create an account</span>
    </div>

    return <>
        <div><DisconnectWalletHeader/></div>
        {accountState.state !== 'active' && alert}
        {accountState.state !== 'active' && <div className={"mt-2"}><CreateAccount/></div>}
        {accountState.state === 'active' && accountPrice != null && account?.address != null && <AccountInfo
            accountPrice={accountPrice}
            tonAddr={tonAddr}
            accountAddr={account?.address?.toString()}/>}
        <div className={"mt-5"}>
            {accountState.state === 'active' && account !== null &&
                <AccountQuestions showButtons={true} account={account}/>}
        </div>
    </>
}