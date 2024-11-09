import {Address} from "@ton/core";
import {tonClient} from "@/wrappers/ton-client";
import {Root} from "@/wrappers/Root";
import {$myAccountRefresh} from "@/stores/profile-store";
import {APP_CONTRACT_ADDR} from "@/conf";

export async function waitUntilAccountCreated(ownerAddr: Address) {
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
    const accountContract = await rootContract.getAccount(ownerAddr)

    while (true) {
        const {state} = await tonClient.getContractState(accountContract.address)
        if (state === 'active') {
            $myAccountRefresh.set(true)
            return true
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
}