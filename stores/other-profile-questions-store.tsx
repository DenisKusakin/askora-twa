import {atom, onMount} from "nanostores";
import {QuestionData} from "@/stores/questions-store";
import {$otherProfile} from "@/stores/other-profile-store";
import {Account} from "@/wrappers/Account";
import {Address} from "@ton/core";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {tonClient} from "@/wrappers/ton-client";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";

export const $otherProfileAssignedQuestions = atom<{ isLoading: boolean, data: QuestionData[] }>({
    isLoading: true,
    data: []
})
export const $otherProfileSubmittedQuestions = atom<{ isLoading: boolean, data: QuestionData[] }>({
    isLoading: true,
    data: []
})

onMount($otherProfileAssignedQuestions, () => {
    const myProfile = $otherProfile.get()
    if (myProfile === null) {
        $otherProfileAssignedQuestions.set({isLoading: true, data: []})
    } else {
        const account = Account.createFromConfig({
            owner: myProfile.address,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        const accountContract = tonClient.open(account)
        $otherProfileAssignedQuestions.set({isLoading: true, data: []})
        getAsignedQuestions(accountContract).then(data => {
            $otherProfileAssignedQuestions.set({isLoading: false, data})
        })
    }
})

onMount($otherProfileSubmittedQuestions, () => {
    const otherProfile = $otherProfile.get()
    if (otherProfile === null) {
        $otherProfileSubmittedQuestions.set({isLoading: true, data: []})
    } else {
        const account = Account.createFromConfig({
            owner: otherProfile.address,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        const accountContract = tonClient.open(account)
        $otherProfileSubmittedQuestions.set({isLoading: true, data: []})
        getSubmittedQuestions(accountContract).then(data => $otherProfileSubmittedQuestions.set({
            isLoading: false,
            data
        }))
    }
})