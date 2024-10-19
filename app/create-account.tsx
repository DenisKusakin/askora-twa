import {useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {Address, fromNano} from "@ton/core";
import {useEffect, useState} from "react";
import {tonClient} from "@/wrappers/ton-client";
import {Account} from "@/wrappers/Account";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {createAccountTransaction} from "@/components/utils/transaction-utils";

export default function CreateAccount() {
    const [balance, setBalance] = useState<bigint | null>(null);

    const [tonConnectUI] = useTonConnectUI();
    const owner = useTonAddress()

    useEffect(() => {
        if (owner == null || owner == '') {
            return;
        }
        const account = tonClient.open(Account.createFromConfig({owner: Address.parse(owner), serviceOwner: Address.parse(SERVICE_OWNER_ADDR)}, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE))
        tonClient.getBalance(account.address)
            .then(balance => setBalance(balance))
    }, [owner])

    const onClick = () => {
        const transaction = createAccountTransaction()
        tonConnectUI.sendTransaction(transaction)
    }

    return <div>
        <h2>Balance: {balance !== null && fromNano(balance)}</h2>
        <button onClick={onClick}>Create Account</button>
    </div>
}