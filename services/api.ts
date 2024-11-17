import {API_BASE_PATH} from "@/conf";
import {TonProofApi} from "@/services/TonProofApi";
import {Address} from "@ton/core";

export async function fetchIsSubscribed(tgId: string, walletAddr: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_PATH}/subscribed?tg_id=${tgId}&wallet_addr=${walletAddr}`)
    return response.json().then(x => x.subscribed)
}

export async function subscribe(initData: string, walletAddr: string): Promise<void> {
    await fetch(`${API_BASE_PATH}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({initData, walletAddr}),
        headers: {
            "Content-Type": 'application/json'
        }
    })
}

export async function unsubscribe(initData: string, walletAddr: string): Promise<void> {
    await fetch(`${API_BASE_PATH}/unsubscribe`, {
        method: 'POST',
        body: JSON.stringify({initData, walletAddr}),
        headers: {
            "Content-Type": 'application/json'
        }
    })
}

async function callProtectedEndpoints(endpoint: string, body: object): Promise<void> {
    const resp = await fetch(`${API_BASE_PATH}/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": 'application/json',
            'Authorization': `Bearer ${TonProofApi.accessToken}`
        }
    })
    if (!resp.ok) {
        if (resp.status === 401) {
            throw new Error("unauthorized")
        } else {
            throw new Error("unknown")
        }
    }
}

export async function createAccount(price: bigint, description: string): Promise<void> {
    return callProtectedEndpoints('create-account', {price: price.toString(), description})
}

export async function replyQuestion(qId: number, replyContent: string): Promise<void> {
    return callProtectedEndpoints('reply-question', {qId, replyContent})
}

export async function rejectQuestion(qId: number): Promise<void> {
    return callProtectedEndpoints('reject-question', {qId})
}

export async function refundQuestion(questionAddr: Address): Promise<void> {
    return callProtectedEndpoints('refund-question', {questionAddr: questionAddr.toRawString()})
}

export async function changePrice(price: bigint): Promise<void> {
    return callProtectedEndpoints('change-price', {price: price.toString()})
}

export async function changeDescription(description: string): Promise<void> {
    return callProtectedEndpoints('change-description', {description})
}