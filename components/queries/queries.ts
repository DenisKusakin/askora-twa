import {queryOptions, useQuery} from "@tanstack/react-query";
import {Address} from "@ton/core";
import {tonClient} from "@/wrappers/ton-client";
import {Root} from "@/wrappers/Root";
import {APP_CONTRACT_ADDR} from "@/conf";
import {Account} from "@/wrappers/Account";
import {Question} from "@/wrappers/Question";

export function fetchQuestionAddrOptions(accountContractAddr: string | undefined, id: number, enabled: boolean = true){
    return queryOptions({
        queryKey: ['question-addr', accountContractAddr, id],
        queryFn: async () => {
            const accountContract = tonClient.open(Account.createFromAddress(Address.parse(accountContractAddr || '')))
            return await accountContract.getQuestionAccAddr(id)
        },
        staleTime: Infinity,
        enabled
    })
}

export function fetchSubmittedQuestionAddrOptions(submitterAccountContractAddr: string | undefined, id: number, enabled: boolean = true){
    return queryOptions({
        queryKey: ['submitted-question-addr', submitterAccountContractAddr, id],
        queryFn: async () => {
            const accountContract = tonClient.open(Account.createFromAddress(Address.parse(submitterAccountContractAddr || '')))
            const questionRef = await accountContract.getQuestionRef(id)
            return await questionRef.getQuestionAddress()
        },
        staleTime: Infinity,
        enabled
    })
}

export function fetchQuestionDetailsOptions(questionContractAddr: string | undefined){
    return queryOptions({
        queryKey: ['question-details', questionContractAddr],
        queryFn: async () => {
            const contract = tonClient.open(Question.createFromAddress(Address.parse(questionContractAddr || '')))
            const data = await contract.getAllData()
            const id = data.id;
            const content = data.content
            const replyContent = data.replyContent
            const minPrice = data.minPrice
            const isClosed = data.isClosed
            const isRejected = data.isRejected
            const from = data.submitterAddr;
            const to = data.ownerAddr;
            const createdAt = data.createdAt

            return {
                content,
                replyContent,
                minPrice,
                addr: contract.address,
                isClosed,
                isRejected,
                from,
                to,
                createdAt,
                id
            }
        },
        enabled: questionContractAddr != undefined
        //TODO: If question was closed, this can't be change, so we can cache forever
    })
}

export function fetchProfile({addr}: {addr: string}){
    return queryOptions({
        queryKey: ['profile', addr],
        queryFn: async () => {
            const accountContractAddr = Address.parse(addr)
            const {state} = await tonClient.getContractState(accountContractAddr)
            if(state === 'active') {
                const accountContract = await tonClient.open(Account.createFromAddress(accountContractAddr))
                const data = await accountContract.getAllData();
                return ({
                    price: data.minPrice,
                    description: data.description,
                    assignedCount: data.assignedQuestionsCount,
                    submittedCount: data.submittedQuestionsCount,
                    status: 'active',
                    address: accountContract.address
                });
            } else {
                return Promise.reject(Error("account not found"))
            }
        }
    })
}

export function fetchAccountAddr({ownerAddr}: {ownerAddr: string}, enabled: boolean = true) {
    return queryOptions({
        queryKey: ['account-addr', ownerAddr],
        queryFn: () => {
            const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))

            return rootContract.getAccountAddress(Address.parse(ownerAddr))
        },
        staleTime: Infinity,
        enabled
    })
}

export function useAccountInfo(ownerAddr: Address | undefined | null, enabled: boolean = true) {
    const ops = {
        ...fetchAccountAddr({ownerAddr: ownerAddr?.toString() || ''}),
        enabled: !!ownerAddr && enabled
    }
    const accountContractAddrQuery = useQuery(ops)
    const ops2 = {
        ...fetchProfile({addr: accountContractAddrQuery.data?.toString() || ''}),
        enabled: !!accountContractAddrQuery.data && enabled
    }
    const accountInfoQuery = useQuery(ops2)
    // const accountInfo = accountInfoQuery.data

    return accountInfoQuery
}

export function useWaitForAccountActive(ownerAddr: Address | undefined | null, enabled: boolean = true) {
    const ops = {
        ...fetchAccountAddr({ownerAddr: ownerAddr?.toString() || ''}),
        enabled: !!ownerAddr && enabled
    }
    const accountContractAddrQuery = useQuery(ops)
    const accountInfoQuery = useQuery({
        ...fetchProfile({addr: accountContractAddrQuery.data?.toString() || ''}),
        enabled: !!accountContractAddrQuery.data && enabled,
        retry: true,
        retryDelay: 3000
    })
    // const accountInfo = accountInfoQuery.data

    return accountInfoQuery
}