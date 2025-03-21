import {Address, beginCell, toNano} from "@ton/core";
import {APP_CONTRACT_ADDR} from "@/conf";

export const createAccountTransaction = (price: bigint, description: string) => {
    const createAccountMsg = beginCell()
        .storeUint(BigInt("0x5f0ec1a3"), 32)
        .storeCoins(price)
        .storeRef(beginCell().storeStringTail(description).endCell())
        .endCell()

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec,
        messages: [{
            address: APP_CONTRACT_ADDR.toRawString(),
            amount: toNano(0.1).toString(),
            // amount: toNano(0.01).toString(),
            payload: createAccountMsg.toBoc().toString('base64')
        }]
    }
}

export const createQuestionTransaction = (msg: string, amount: bigint, accountAddr: Address) => {
    const createQuestionMsg = beginCell()
        .storeUint(BigInt("0x28b1e47a"), 32)
        .storeRef(
            beginCell()
                .storeStringTail(msg)
                .endCell()
        ).endCell()

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: accountAddr.toRawString(),
            amount: amount.toString(),
            payload: createQuestionMsg.toBoc().toString('base64')
        }]
    };
}

export const rejectQuestionTransaction = (questionAddr: Address) => {
    const msg = beginCell().storeUint(BigInt("0xa5c566b9"), 32).endCell()

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: questionAddr.toRawString(),
            amount: toNano("0.1").toString(),
            payload: msg.toBoc().toString('base64')
        }]
    }
}

export const refundQuestionTransaction = (questionAddr: Address) => {
    const msg = beginCell().storeUint(BigInt("0x5616c572"), 32).endCell()

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: questionAddr.toRawString(),
            amount: toNano("0.1").toString(),
            payload: msg.toBoc().toString('base64')
        }]
    }
}

export const updatePriceTransaction = (accountAddr: Address, price: bigint) => {
    const msg = beginCell()
        .storeUint(BigInt("0xaaacc05b"), 32)
        .storeCoins(price)
        .endCell()

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: accountAddr.toRawString(),
            amount: toNano("0.01").toString(),
            payload: msg.toBoc().toString('base64')
        }]
    }
}

export const updateDescriptionTransaction = (accountAddr: Address, description: string) => {
    const msg = beginCell()
        .storeUint(BigInt("0x901bca3e"), 32)
        .storeStringRefTail(description)
        .endCell()

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: accountAddr.toRawString(),
            amount: toNano("0.01").toString(),
            payload: msg.toBoc().toString('base64')
        }]
    }
}

export const replyTransaction = (questionAddr: Address, replyContent: string) => {
    const msg = beginCell()
        .storeUint(BigInt("0xfda8c6e0"), 32)
        .storeRef(
            beginCell()
                .storeStringTail(replyContent)
                .endCell()
        ).endCell()
    return {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: questionAddr.toRawString(),
            amount: toNano("0.01").toString(),
            payload: msg.toBoc().toString('base64')
        }]
    }
}