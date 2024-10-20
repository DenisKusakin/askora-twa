import {Address, OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {tonClient} from "@/wrappers/ton-client";

export async function getAsignedQuestions(account: OpenedContract<Account>): Promise<{
    content: string,
    replyContent: string,
    balance: bigint,
    addr: Address,
    isClosed: boolean,
    isRejected: boolean,
    from: Address,
    to: Address
}[]> {
    const count = await account.getNextId()
    const res: {
        content: string,
        replyContent: string,
        balance: bigint,
        addr: Address,
        isClosed: boolean,
        isRejected: boolean,
        from: Address,
        to: Address
    }[] = []
    for (let i = 0; i < count; i++) {
        //TODO: Add error handling!!!
        try {
            const q = await account.getQuestion(i)
            const data = await q.getAllData()
            const content = data.content
            const replyContent = data.replyContent
            const balance = await tonClient.getBalance(q.address)
            const isClosed = data.isClosed
            const isRejected = data.isRejected
            const from = data.submitterAddr;
            const to = data.ownerAddr;

            res.push({content, replyContent, balance, addr: q.address, isClosed, isRejected, from, to})
        } catch (e) {
            console.log(`Failed to retrieve question ${i}`, e)
        }
    }

    return res
}

export async function getSubmittedQuestions(account: OpenedContract<Account>): Promise<{
    content: string,
    balance: bigint,
    addr: Address,
    isClosed: boolean,
    isRejected: boolean,
    from: Address,
    replyContent: string,
    to: Address
}[]> {
    const count = await account.getNextSubmittedQuestionId()
    const res: {
        content: string,
        balance: bigint,
        addr: Address,
        isClosed: boolean,
        isRejected: boolean,
        from: Address,
        replyContent: string,
        to: Address
    }[] = []
    for (let i = 0; i < count; i++) {
        try {
            const qRef = await account.getQuestionRef(i)
            const q = await qRef.getQuestion()
            const data = await q.getAllData()
            const content = data.content
            const replyContent = data.replyContent
            const balance = await tonClient.getBalance(q.address)
            const isClosed = data.isClosed
            const isRejected = data.isRejected
            const from = data.submitterAddr
            const to = data.ownerAddr;

            res.push({content, balance, addr: q.address, isClosed, isRejected, from, to, replyContent})
        } catch (e) {
            console.log(`Failed to retrieve submitted question ${i}`, e)
        }

    }

    return res
}