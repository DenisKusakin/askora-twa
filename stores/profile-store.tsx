import {atom, computed, task} from "nanostores";
import {Address} from "@ton/core";
import {APP_CONTRACT_ADDR} from "@/components/utils/constants";
import {tonClient} from "@/wrappers/ton-client";
import {tonConnectUI} from "@/stores/ton-connect";
import {QuestionData} from "@/stores/questions-store";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";
import {Root} from "@/wrappers/Root";

export const $myConnectedWallet = atom<Address | null | undefined>(undefined)

if (tonConnectUI != null) {
    if (tonConnectUI.connected && tonConnectUI.wallet !== null) {
        $myConnectedWallet.set(Address.parse(tonConnectUI.wallet.account.address))
    } else {
        tonConnectUI.connectionRestored.then(isConnected => {
            if (isConnected && tonConnectUI !== null && tonConnectUI.wallet !== null) {
                $myConnectedWallet.set(Address.parse(tonConnectUI.wallet.account.address))
            } else {
                $myConnectedWallet.set(null)
            }
        })
    }
}

if (tonConnectUI != null) {
    tonConnectUI.onStatusChange(wallet => {
        if (wallet === null) {
            $myConnectedWallet.set(null)
        } else {
            $myConnectedWallet.set(Address.parse(wallet.account.address))
        }
    })
}

export const $myAccountInfo2 = computed($myConnectedWallet, newValue => task(async () => {
    if (newValue === undefined) {
        return undefined
    }
    if (newValue === null) {
        return null
    } else {
        const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
        const accountContract = await rootContract.getAccount(newValue)
        const {state} = await tonClient.getContractState(newValue)

        if (state === "active") {
            const data = await accountContract.getAllData()
            return {
                price: data.minPrice,
                assignedCount: data.assignedQuestionsCount,
                submittedCount: data.submittedQuestionsCount,
                status: 'active',
                address: accountContract.address
            }
        } else {
            return null
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