import {atom, computed, onMount, onSet, task} from "nanostores";
import {Address} from "@ton/core";
import {$myProfile} from "@/stores/profile-store";
import {Account} from "@/wrappers/Account";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {tonClient} from "@/wrappers/ton-client";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";
import {Question} from "@/wrappers/Question";

export type QuestionData = {
    content: string,
    replyContent: string,
    balance: bigint,
    addr: Address,
    isRejected: boolean,
    isClosed: boolean,
    from: Address,
    to: Address,
    id: number
}

export const $myAssignedQuestions = atom<{ isLoading: boolean, data: QuestionData[] }>({isLoading: true, data: []})
export const $mySubmittedQuestions = atom<{ isLoading: boolean, data: QuestionData[] }>({isLoading: true, data: []})

onMount($myAssignedQuestions, () => {
    const myProfile = $myProfile.get()
    if (myProfile === null) {
        $myAssignedQuestions.set({isLoading: true, data: []})
    } else {
        const account = Account.createFromConfig({
            owner: myProfile.address,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        const accountContract = tonClient.open(account)
        $myAssignedQuestions.set({isLoading: true, data: []})
        getAsignedQuestions(accountContract).then(data => {
            $myAssignedQuestions.set({isLoading: false, data})
        })
    }
})

onMount($mySubmittedQuestions, () => {
    const myProfile = $myProfile.get()
    if (myProfile === null) {
        $mySubmittedQuestions.set({isLoading: true, data: []})
    } else {
        const account = Account.createFromConfig({
            owner: myProfile.address,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        const accountContract = tonClient.open(account)
        $mySubmittedQuestions.set({isLoading: true, data: []})
        getSubmittedQuestions(accountContract).then(data => $mySubmittedQuestions.set({isLoading: false, data}))
    }
})

onSet($myProfile, (newValue) => {
    if (newValue === null) {
        $myAssignedQuestions.set({isLoading: true, data: []})
        $mySubmittedQuestions.set({isLoading: true, data: []})
    }
})

export const $questionDetailsPage = atom<{ ownerAddress: Address, qId: number } | null>(null)
export const $questionDetailsData = computed(
    $questionDetailsPage,
    pageDetails => task(async () => {
        if (pageDetails === null) {
            return null
        }
        const {ownerAddress, qId} = pageDetails
        const account = Account.createFromConfig({
            owner: ownerAddress,
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)
        const question = Question.createFromConfig({accountAddr: account.address, id: qId}, QUESTION_CODE)
        const questionContract = tonClient.open(question)
        const data = await questionContract.getAllData()

        return data
    })
)