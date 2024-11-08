const basePath = "https://r2xeltz6rcrz.share.zrok.io"
// const basePath = "http://localhost:3002"

export async function fetchSubscriptions(tgId: string): Promise<string[]> {
    const response = await fetch(`${basePath}/subscriptions?tg_id=${tgId}`, {
        headers: {
            'skip_zrok_interstitial': 'true'
        }
    })
    return response.json().then(x => x.members)
}

export async function fetchIsSubscribed(tgId: string, walletAddr: string): Promise<boolean> {
    const response = await fetch(`${basePath}/subscribed?tg_id=${tgId}&wallet_addr=${walletAddr}`, {
        headers: {
            'skip_zrok_interstitial': 'true'
        }
    })
    return response.json().then(x => x.subscribed)
}

export async function fetchTgInfo(initData: string): Promise<unknown> {
    const response = await fetch(`${basePath}/info?${initData}`, {
        headers: {
            'skip_zrok_interstitial': 'true'
        }
    })
    return response.json()
}

export async function subscribe(initData: string, walletAddr: string): Promise<void> {
    await fetch(`${basePath}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({initData, walletAddr}),
        headers: {
            'skip_zrok_interstitial': 'true',
            "Content-Type": 'application/json'
        }
    })
}