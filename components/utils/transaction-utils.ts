import {Address, beginCell, toNano} from "@ton/core";
import {APP_CONTRACT_ADDR} from "@/components/utils/constants";

export const createAccountTransaction = () => {
    const createAccountMsg = beginCell()
        .storeUint(1, 32)
        .storeUint(123, 64)
        .storeCoins(toNano(1.5))
        .endCell()

    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec,
        messages: [{
            address: APP_CONTRACT_ADDR,
            amount: toNano("0.6").toString(),
            payload: createAccountMsg.toBoc().toString('base64')
        }]
    }

    return transaction
}

export const createQuestionTransaction = (msg: string, amount: bigint, accountAddr: Address) => {
    const createQuestionMsg = beginCell()
        .storeUint(BigInt("0x28b1e47a"), 32)
        .storeRef(
            beginCell()
                .storeStringTail(msg)
                .endCell()
        ).endCell()

    const t = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: accountAddr.toRawString(),
            amount: amount.toString(),
            payload: createQuestionMsg.toBoc().toString('base64')
        }]
    }

    return t;
}

export const rejectQuestionTransaction = (questionAddr: Address) => {
    const msg = beginCell().storeUint(BigInt("0xa5c566b9"), 32).endCell()

    return {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: questionAddr.toRawString(),
            amount: toNano("0.01").toString(),
            payload: msg.toBoc().toString('base64')
        }]
    }
}