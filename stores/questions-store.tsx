import {computed, task} from "nanostores";
import {Address} from "@ton/core";
import {$myConnectedWallet} from "@/stores/profile-store";
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

export const $myAssignedQuestions = computed($myConnectedWallet, myConnectedWallet => task(async () => {
    if (myConnectedWallet === undefined) {
        return {isLoading: true, data: []}
    } else if (myConnectedWallet !== null){
        const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))

        return rootContract.getAccount(myConnectedWallet)
            .then(accountContract => getAsignedQuestions(accountContract)
                .then(data => {
                    return {isLoading: false, data}
                }))
    } else {
        return {
            isLoading: false,
            data: []
        }
    }
}))

export const $mySubmittedQuestions = computed($myConnectedWallet, myConnectedWallet => task(async () => {
    if (myConnectedWallet === undefined) {
        return {isLoading: true, data: []}
    } else if(myConnectedWallet !== null){
        const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))

        return rootContract.getAccount(myConnectedWallet)
            .then(accountContract => getSubmittedQuestions(accountContract)
                .then(data => ({isLoading: false, data})))
    } else {
        return {
            isLoading: false,
            data: []
        }
    }
}))

export async function fetchQuestionData(ownerAddress: Address, qId: number) {
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))

    const account = await rootContract.getAccount(ownerAddress)
    const questionContract = await account.getQuestion(qId)
    const data = await questionContract.getAllData()

    return {...data, from: data.submitterAddr, to: data.ownerAddr, addr: questionContract.address}
}