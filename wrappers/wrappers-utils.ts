import {Address, OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";

function sleep(delay: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, delay))
}

export async function getAsignedQuestions(account: OpenedContract<Account>, params: {
    from: number,
    limit: number
} | undefined = undefined): Promise<{
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
    const fromIdx = params === undefined ? 0 : params.from
    const toIdx = params === undefined ? await account.getNextId() : params.from + params.limit

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
    for (let i = fromIdx; i < toIdx; i++) {
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

            await sleep(1000)

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
        } catch {
        }
    }

    return res
}

export async function getSubmittedQuestions(account: OpenedContract<Account>, params: {
    from: number,
    limit: number
} | undefined = undefined): Promise<{
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
    const fromIdx = params === undefined ? 0 : params.from
    const toIdx = params === undefined ? await account.getNextSubmittedQuestionId() : params.from + params.limit
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
    for (let i = fromIdx; i < toIdx; i++) {
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

            await sleep(1000)

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
            console.log("Failed")
        }

    }

    return res
}