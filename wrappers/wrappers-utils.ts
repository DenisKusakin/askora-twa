import {Address, OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";

export async function getAsignedQuestions(account: OpenedContract<Account>): Promise<{
    content: string,
    replyContent: string,
    minPrice: bigint,
    addr: Address,
    isClosed: boolean,
    isRejected: boolean,
    from: Address,
    to: Address,
    id: number,
    createdAt: number
}[]> {
    const count = await account.getNextId()
    const res: {
        content: string,
        replyContent: string,
        minPrice: bigint,
        addr: Address,
        isClosed: boolean,
        isRejected: boolean,
        from: Address,
        to: Address,
        id: number,
        createdAt: number
    }[] = []
    for (let i = 0; i < count; i++) {
        //TODO: Add error handling!!!
        try {
            const q = await account.getQuestion(i)
            const data = await q.getAllData()
            const content = data.content
            const replyContent = data.replyContent
            const minPrice = data.minPrice
            const isClosed = data.isClosed
            const isRejected = data.isRejected
            const from = data.submitterAddr;
            const to = data.ownerAddr;
            const createdAt = data.createdAt

            res.push({
                content,
                replyContent,
                minPrice,
                addr: q.address,
                isClosed,
                isRejected,
                from,
                to,
                id: i,
                createdAt
            })
        } catch (e) {
        }
    }

    return res
}

export async function getSubmittedQuestions(account: OpenedContract<Account>): Promise<{
    content: string,
    minPrice: bigint,
    addr: Address,
    isClosed: boolean,
    isRejected: boolean,
    from: Address,
    replyContent: string,
    to: Address,
    id: number,
    createdAt: number
}[]> {
    const count = await account.getNextSubmittedQuestionId()
    const res: {
        content: string,
        minPrice: bigint,
        addr: Address,
        isClosed: boolean,
        isRejected: boolean,
        from: Address,
        replyContent: string,
        to: Address,
        id: number,
        createdAt: number
    }[] = []
    for (let i = 0; i < count; i++) {
        try {
            const qRef = await account.getQuestionRef(i)
            const q = await qRef.getQuestion()
            const data = await q.getAllData()
            const content = data.content
            const replyContent = data.replyContent
            const minPrice = data.minPrice
            const isClosed = data.isClosed
            const isRejected = data.isRejected
            const from = data.submitterAddr
            const to = data.ownerAddr;
            const createdAt = data.createdAt

            res.push({
                content,
                minPrice,
                addr: q.address,
                isClosed,
                isRejected,
                from,
                to,
                replyContent,
                id: i,
                createdAt
            })
        } catch {
        }

    }

    return res
}