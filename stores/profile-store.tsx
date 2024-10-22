'use client';

import {atom, onSet} from "nanostores";
import {Address} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {tonClient} from "@/wrappers/ton-client";
import {tonConnectUI} from "@/stores/ton-connect";

export const $myProfile = atom<{
    address: Address
} | null>(tonConnectUI != null && tonConnectUI.wallet != null ? {address: Address.parse(tonConnectUI.wallet.account.address)} : null)

if (tonConnectUI != null) {
    console.log("Subscribed on status change")
    tonConnectUI.onStatusChange(wallet => {
        console.log("Status changed", wallet)
        if (wallet === null) {
            $myProfile.set(null);
        } else {
            $myProfile.set({address: Address.parse(wallet.account.address)})
        }
    })
}

export const $myAccountInfo = atom<{
    price: bigint,
    assignedCount: number,
    submittedCount: number,
    status: 'active' | 'non-active',
    isLoading: boolean,
    address: Address
} | null>(null)

onSet($myProfile, ({newValue, abort}) => {
    if (newValue === null) {
        $myAccountInfo.set(null)
    } else {
        const account = Account.createFromConfig({
            owner: newValue.address,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        const accountContract = tonClient.open(account)

        $myAccountInfo.set({
            price: BigInt(0),
            assignedCount: 0,
            submittedCount: 0,
            isLoading: true,
            status: 'non-active',
            address: account.address
        })
        tonClient.getContractState(newValue.address).then(({state}) => {
            if (state === "active") {
                accountContract.getAllData().then(data => $myAccountInfo.set({
                    price: data.minPrice,
                    assignedCount: data.assignedQuestionsCount,
                    submittedCount: data.submittedQuestionsCount,
                    isLoading: false,
                    status: 'active',
                    address: account.address
                }))
            }
        })
    }
})