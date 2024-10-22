import {atom, onSet} from "nanostores";
import {Address} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {tonClient} from "@/wrappers/ton-client";
import {Question} from "@/wrappers/Question";
import {$myProfile} from "@/stores/profile-store";

export const $myQuestionId = atom<number | null>(null)
export const $myQuestionInfo = atom<{
    content: string,
    isRejected: boolean,
    isClosed: boolean,
    balance: bigint,
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
        const account = Account.createFromConfig({
            owner: myAddr,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)

        const question = tonClient.open(Question.createFromConfig({
            accountAddr: account.address,
            id: newValue
        }, QUESTION_CODE))

        question.getAllData().then(data => $myQuestionInfo.set({...data, addr: question.address}))
    }
})