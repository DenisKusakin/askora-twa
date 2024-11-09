import {TonClient} from "@ton/ton";
import {TON_API_ENDPOINT, TON_API_TOKEN} from "@/conf";

export const tonClient = new TonClient({
    endpoint: TON_API_ENDPOINT,
    apiKey: TON_API_TOKEN
});