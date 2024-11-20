import {Address} from "@ton/core";

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