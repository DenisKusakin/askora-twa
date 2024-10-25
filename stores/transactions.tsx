import {Address} from "@ton/core";
import {
    createQuestionTransaction,
    rejectQuestionTransaction,
    replyTransaction
} from "@/components/utils/transaction-utils";
import {tonConnectUI} from "@/stores/ton-connect";

export function replyToQuestion(qContractAddr: Address, replyContent: string) {
    if (tonConnectUI == null) {
        return Promise.reject()
    }
    const transaction = replyTransaction(qContractAddr, replyContent)
    return tonConnectUI?.sendTransaction(transaction)
}

export function submitQuestion(accountAddr: Address, msg: string, amount: bigint) {
    if (tonConnectUI == null) {
        return Promise.resolve()
    }
    const transaction = createQuestionTransaction(msg, amount, accountAddr)
    return tonConnectUI?.sendTransaction(transaction)
}

export function rejectQuestion(qContractAddr: Address) {
    if (tonConnectUI == null) {
        return Promise.reject()
    }
    return tonConnectUI?.sendTransaction(rejectQuestionTransaction(qContractAddr))
}