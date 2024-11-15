import {Account, ConnectAdditionalRequest, TonProofItemReplySuccess} from "@tonconnect/ui-react";
import {API_BASE_PATH} from "@/conf";

class TonProofApiService {
    private localStorageKey = 'access-token'
    public accessToken: string | null = null;

    constructor() {
        if(typeof window != 'undefined'){
            this.accessToken = localStorage.getItem(this.localStorageKey)
        }
    }

    async generatePayload(): Promise<ConnectAdditionalRequest | null> {
        try {
            const response = await fetch(`${API_BASE_PATH}/generate-payload`, {method: 'POST'})
                .then(x => x.json())
            return {tonProof: response.payload as string}
        } catch {
            return null;
        }
    }

    reset() {
        this.accessToken = null;
        localStorage.removeItem(this.localStorageKey);
    }

    async checkProof(proof: TonProofItemReplySuccess['proof'], account: Account): Promise<void> {
        try {
            const reqBody = {
                address: account.address,
                network: account.chain,
                public_key: account.publicKey,
                proof: {
                    ...proof,
                    state_init: account.walletStateInit
                }
            }

            const response = await fetch(`${API_BASE_PATH}/check_proof`, {
                method: 'POST',
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(x => x.json())
            if (response?.token) {
                localStorage.setItem(this.localStorageKey, response.token)
                this.accessToken = response.token
            }
        } catch (e) {
            console.log('Check proof error', e)
        }
    }
}

export const TonProofApi  = new TonProofApiService();