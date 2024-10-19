import {Address, OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {tonClient} from "@/wrappers/ton-client";

export async function getAsignedQuestions(account: OpenedContract<Account>): Promise<{
    content: string,
    balance: bigint,
    addr: Address,
    isClosed: boolean,
    isRejected: boolean
}[]> {
    const count = await account.getNextId()
    const res: { content: string, balance: bigint, addr: Address, isClosed: boolean, isRejected: boolean }[] = []
    for (let i = 0; i < count; i++) {
        const q = await account.getQuestion(i)
        const data = await q.getAllData()
        const content = data.content
        const balance = await tonClient.getBalance(q.address)
        const isClosed = data.isClosed
        const isRejected = data.isRejected

        res.push({content, balance, addr: q.address, isClosed, isRejected})
    }

    return res
}

export async function getSubmittedQuestions(account: OpenedContract<Account>): Promise<{
    content: string,
    balance: bigint,
    addr: Address,
    isClosed: boolean,
    isRejected: boolean
}[]> {
    const count = await account.getNextSubmittedQuestionId()
    const res: { content: string, balance: bigint, addr: Address, isClosed: boolean, isRejected: boolean }[] = []
    for (let i = 0; i < count; i++) {
        const qRef = await account.getQuestionRef(i)
        const q = await qRef.getQuestion()
        const data = await q.getAllData()
        const content = data.content
        const balance = await tonClient.getBalance(q.address)
        const isClosed = data.isClosed
        const isRejected = data.isRejected

        res.push({content, balance, addr: q.address, isClosed, isRejected})
    }

    return res
}