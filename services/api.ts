import {API_BASE_PATH} from "@/conf";

export async function fetchIsSubscribed(tgId: string, walletAddr: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_PATH}/subscribed?tg_id=${tgId}&wallet_addr=${walletAddr}`, {
        headers: {
            'skip_zrok_interstitial': 'true'
        }
    })
    return response.json().then(x => x.subscribed)
}

export async function subscribe(initData: string, walletAddr: string): Promise<void> {
    await fetch(`${API_BASE_PATH}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({initData, walletAddr}),
        headers: {
            'skip_zrok_interstitial': 'true',
            "Content-Type": 'application/json'
        }
    })
}

export async function unsubscribe(initData: string, walletAddr: string): Promise<void> {
    await fetch(`${API_BASE_PATH}/unsubscribe`, {
        method: 'POST',
        body: JSON.stringify({initData, walletAddr}),
        headers: {
            'skip_zrok_interstitial': 'true',
            "Content-Type": 'application/json'
        }
    })
}