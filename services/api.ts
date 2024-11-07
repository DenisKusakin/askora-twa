//const basePath = "https://sc7b1v7bywdj.share.zrok.io"
const basePath = "http://localhost:3002"

export async function fetchSubscriptions(tgId: string): Promise<string[]> {
    const response = await fetch(`${basePath}/subscriptions?tg_id=${tgId}`)
    return response.json().then(x => x.members)
}

export async function subscribe(tgId: string, walletAddr: string): Promise<void> {
    await fetch(`${basePath}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({tgId: tgId, walletAddr})
    })
}