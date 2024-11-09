import {atom, computed, task} from "nanostores";
import {Address} from "@ton/core";
import {tonClient} from "@/wrappers/ton-client";
import {tonConnectUI} from "@/stores/ton-connect";
import {QuestionData} from "@/stores/questions-store";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";
import {Root} from "@/wrappers/Root";
import {fetchIsSubscribed} from "@/services/api";
import {APP_CONTRACT_ADDR} from "@/conf";

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

export const $myAccount = computed($myConnectedWallet, walletAddr => task(async () => {
    if (walletAddr === undefined) {
        return undefined
    } else if (walletAddr === null) {
        return null
    }
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
    return await rootContract.getAccount(walletAddr)
}))

export const $myAccountRefresh = atom(false)

export const $myAccountInfo = computed([$myAccount, $myAccountRefresh], (myAccount) => task(async () => {
    if (myAccount === undefined) {
        return undefined
    }
    if (myAccount === null) {
        return null
    } else {
        const accountContract = myAccount
        const {state} = await tonClient.getContractState(myAccount.address)

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

export const $tgInitData = atom<undefined | null | string>(undefined)
export const $tgId = atom<undefined | null | string>(undefined)
//TODO: this should be done in other way
export const $connectionStatusChanged = atom(0)

export function refreshTgConnectionStatus() {
    $connectionStatusChanged.set($connectionStatusChanged.get() + 1)
}

export const $tgConnectionStatus = computed([$myConnectedWallet, $tgId, $connectionStatusChanged], (myConnectedWallet, tgId) => task(async () => {
    if (myConnectedWallet === undefined || tgId === undefined) {
        return undefined
    } else if (myConnectedWallet === null || tgId === null) {
        return null
    } else {
        const isSubscribed = await fetchIsSubscribed(tgId, myConnectedWallet.toString())
        return isSubscribed ? 'subscribed' : 'not-subscribed';
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

    return tonClient.getContractState(accountContract.address).then(async ({state}) => {
        if (state === "active") {
            const data = await accountContract.getAllData();
            return ({
                price: data.minPrice,
                assignedCount: data.assignedQuestionsCount,
                submittedCount: data.submittedQuestionsCount,
                status: 'active',
                address: accountContract.address
            });
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