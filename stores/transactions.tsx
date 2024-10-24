import {Address} from "@ton/core";
import {rejectQuestionTransaction, replyTransaction} from "@/components/utils/transaction-utils";
import {tonConnectUI} from "@/stores/ton-connect";

export function replyToQuestion(qContractAddr: Address, replyContent: string) {
    const transaction = replyTransaction(qContractAddr, replyContent)
    tonConnectUI?.sendTransaction(transaction)
}

export function rejectQuestion(qContractAddr: Address) {
    tonConnectUI?.sendTransaction(rejectQuestionTransaction(qContractAddr))
}