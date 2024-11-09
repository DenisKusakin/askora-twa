import {batched, computed, task} from "nanostores";
import {Address} from "@ton/core";
import {$myAccount, $myAccountInfo} from "@/stores/profile-store";
import {tonClient} from "@/wrappers/ton-client";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";
import {Root} from "@/wrappers/Root";
import {APP_CONTRACT_ADDR} from "@/conf";

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

export const $myAssignedQuestions = batched([$myAccount, $myAccountInfo], (myAccount, myAccountInfo) => task(async () => {
    if (myAccount === undefined || myAccountInfo === undefined) {
        return {isLoading: true, data: []}
    } else if (myAccount !== null && myAccountInfo !== null) {

        return getAsignedQuestions(myAccount, {from: 0, limit: myAccountInfo.assignedCount})
            .then(data => {
                return {isLoading: false, data}
            })
    } else {
        return {
            isLoading: false,
            data: []
        }
    }
}))

export const $mySubmittedQuestions = batched([$myAccount, $myAccountInfo], (myAccount, myAccountInfo) => task(async () => {
    if (myAccount === undefined || myAccountInfo === undefined) {
        return {isLoading: true, data: []}
    } else if (myAccount !== null && myAccountInfo !== null) {
        return getSubmittedQuestions(myAccount, {from: 0, limit: myAccountInfo.submittedCount})
            .then(data => ({isLoading: false, data}))
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