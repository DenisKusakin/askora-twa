import {Address} from "@ton/core";
import {tonClient} from "@/wrappers/ton-client";
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

export async function fetchQuestionData(ownerAddress: Address, qId: number) {
    const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))

    const account = await rootContract.getAccount(ownerAddress)
    const questionContract = await account.getQuestion(qId)
    const data = await questionContract.getAllData()

    return {...data, from: data.submitterAddr, to: data.ownerAddr, addr: questionContract.address}
}