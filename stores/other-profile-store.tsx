import {atom, onSet} from "nanostores";
import {Address} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {tonClient} from "@/wrappers/ton-client";

export const $otherProfile = atom<{ address: Address } | null>(null)

export const $otherProfileInfo = atom<{
    price: bigint,
    assignedCount: number,
    submittedCount: number,
    status: 'active' | 'non-active',
    isLoading: boolean,
    address: Address
} | null>(null)

onSet($otherProfile, ({newValue}) => {
    if(newValue === null) {
        $otherProfileInfo.set(null)
    } else {
        const account = Account.createFromConfig({
            owner: newValue.address,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        const accountContract = tonClient.open(account)

        $otherProfileInfo.set({
            price: BigInt(0),
            assignedCount: 0,
            submittedCount: 0,
            isLoading: true,
            status: 'non-active',
            address: account.address
        })
        tonClient.getContractState(newValue.address).then(({state}) => {
            if (state === "active") {
                accountContract.getAllData().then(data => $otherProfileInfo.set({
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