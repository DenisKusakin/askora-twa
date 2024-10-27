import {atom, onSet} from "nanostores";
import {Address} from "@ton/core";
import {APP_CONTRACT_ADDR} from "@/components/utils/constants";
import {tonClient} from "@/wrappers/ton-client";
import {$myProfile} from "@/stores/profile-store";
import {Root} from "@/wrappers/Root";

export const $myQuestionId = atom<number | null>(null)
export const $myQuestionInfo = atom<{
    content: string,
    isRejected: boolean,
    isClosed: boolean,
    minPrice: bigint,
    submitterAddr: Address,
    addr: Address
} | null>(null)

onSet($myQuestionId, ({newValue}) => {
    if (newValue === null) {
        $myQuestionInfo.set(null)
    } else {
        const myAddr = $myProfile.get()?.address
        if (myAddr == null) {
            return
        }
        const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
        rootContract.getAccount(myAddr).then(account => account.getQuestion(newValue))
            .then(x => x.getAllData().then(data => $myQuestionInfo.set({...data, addr: x.address})))
    }
})