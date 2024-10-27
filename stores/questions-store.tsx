import {atom, onMount, onSet} from "nanostores";
import {Address} from "@ton/core";
import {$myProfile} from "@/stores/profile-store";
import {APP_CONTRACT_ADDR} from "@/components/utils/constants";
import {tonClient} from "@/wrappers/ton-client";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";
import {Root} from "@/wrappers/Root";

export type QuestionData = {
    content: string,
    replyContent: string,
    minPrice: bigint,
    addr: Address,
    isRejected: boolean,
    isClosed: boolean,
    from: Address,
    to: Address,
    id: number,
    createdAt: number
}

export const $myAssignedQuestions = atom<{ isLoading: boolean, data: QuestionData[] }>({isLoading: true, data: []})
export const $mySubmittedQuestions = atom<{ isLoading: boolean, data: QuestionData[] }>({isLoading: true, data: []})

onMount($myAssignedQuestions, () => {
    const myProfile = $myProfile.get()
    if (myProfile === null) {
        $myAssignedQuestions.set({isLoading: true, data: []})
    } else {
        const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))

        $myAssignedQuestions.set({isLoading: true, data: []})
        if (myProfile.address === null) {
            return;
        }
        rootContract.getAccount(myProfile.address)
            .then(accountContract => getAsignedQuestions(accountContract)
                .then(data => {
                    $myAssignedQuestions.set({isLoading: false, data})
                }))
    }
})

onMount($mySubmittedQuestions, () => {
    const myProfile = $myProfile.get()
    if (myProfile === null) {
        $mySubmittedQuestions.set({isLoading: true, data: []})
    } else {
        const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
        $mySubmittedQuestions.set({isLoading: true, data: []})
        if (myProfile.address === null) {
            return;
        }
        rootContract.getAccount(myProfile.address)
            .then(accountContract => getSubmittedQuestions(accountContract)
                .then(data => $mySubmittedQuestions.set({isLoading: false, data})))
    }
})

onSet($myProfile, (newValue) => {
    if (newValue === null) {
        $myAssignedQuestions.set({isLoading: true, data: []})
        $mySubmittedQuestions.set({isLoading: true, data: []})
    }
})

export async function fetchQuestionData(ownerAddress: Address, qId: number) {
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))

    const account = await rootContract.getAccount(ownerAddress)
    const questionContract = await account.getQuestion(qId)
    const data = await questionContract.getAllData()

    return {...data, from: data.submitterAddr, to: data.ownerAddr, addr: questionContract.address}
}