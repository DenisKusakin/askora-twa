import {TonClient} from "@ton/ton";

export const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: "2de325fb6696fff5c78ea8da9bc0abc800f1133a6723c7d0fd953e729f9c9ace"
});