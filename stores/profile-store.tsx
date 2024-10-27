import {atom, computed, task} from "nanostores";
import {Address} from "@ton/core";
import {APP_CONTRACT_ADDR} from "@/components/utils/constants";
import {tonClient} from "@/wrappers/ton-client";
import {tonConnectUI} from "@/stores/ton-connect";
import {QuestionData} from "@/stores/questions-store";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";
import {Root} from "@/wrappers/Root";

export const $myProfile = atom<{
    address: Address | null,
    isLoading: boolean
}>(tonConnectUI != null ? {
    address: tonConnectUI.wallet != null ? Address.parse(tonConnectUI.wallet.account.address) : null,
    isLoading: false
} : {isLoading: true, address: null})

if (tonConnectUI != null) {
    tonConnectUI.onStatusChange(wallet => {
        if (wallet === null) {
            $myProfile.set({isLoading: false, address: null});
        } else {
            $myProfile.set({address: Address.parse(wallet.account.address), isLoading: false})
        }
    })
}

export const $myAccountInfo = computed($myProfile, newValue => task(async () => {
    if (newValue.isLoading) {
        return {isLoading: true, data: null}
    } else {
        const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
        if (newValue.address == null) {
            return {isLoading: false, data: null}
        }
        const accountContract = await rootContract.getAccount(newValue.address)
        const {state} = await tonClient.getContractState(newValue.address)

        if (state === "active") {
            try{
                const data = await accountContract.getAllData()
                return {
                    data: {
                        price: data.minPrice,
                        assignedCount: data.assignedQuestionsCount,
                        submittedCount: data.submittedQuestionsCount,
                        status: 'active',
                        address: accountContract.address
                    },
                    isLoading: false
                }
            } catch {
                return {
                    isLoading: false,
                    data: null
                }
            }
        } else {
            return {
                isLoading: false,
                data: null
            }
        }
    }
}))

export type AccountInfo = {
    price: bigint,
    assignedCount: number,
    submittedCount: number,
    status: 'active' | 'non-active',
    address: Address
}

export async function fetchAccountInfo(ownerAddr: Address): Promise<AccountInfo> {
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
    const accountContract = await rootContract.getAccount(ownerAddr)

    return tonClient.getContractState(accountContract.address).then(({state}) => {
        if (state === "active") {
            return accountContract.getAllData().then(data => ({
                price: data.minPrice,
                assignedCount: data.assignedQuestionsCount,
                submittedCount: data.submittedQuestionsCount,
                status: 'active',
                address: accountContract.address
            }))
        } else {
            return Promise.reject()
        }
    })
}

export async function fetchAccountQuestions(ownerAddr: Address): Promise<QuestionData[]> {
    if (tonClient == null) {
        return Promise.resolve([])
    }
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
    const accountContract = await rootContract.getAccount(ownerAddr)

    return getAsignedQuestions(accountContract)
}

export async function fetchAccountSubmittedQuestions(ownerAddr: Address): Promise<QuestionData[]> {
    if (tonClient == null) {
        return Promise.resolve([])
    }
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
    const accountContract = await rootContract.getAccount(ownerAddr)

    return getSubmittedQuestions(accountContract)
}