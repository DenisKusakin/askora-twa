'use client';

import {ReactNode, useCallback, useEffect, useState} from "react";
import {MyAssignedQuestionsContext, MySubmittedQuestionsContext} from "@/app/context/my-questions-context";
import {QuestionData} from "@/stores/questions-store";
import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myAccount, $myConnectedWallet, $tgId} from "@/stores/profile-store";
import {tonClient} from "@/wrappers/ton-client";
import {AccountInfo, MyAccountInfoContext, TgConnectionStatus} from "@/app/context/my-account-context";
import {fetchIsSubscribed} from "@/services/api";
//TODO: Simplify and make sure it is correct
function TgConnectionStatusWrapper({children}: { children: ReactNode }) {
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const tgId = useStoreClientV2($tgId)
    const [connectionStatus, setConnectionStatus] = useState<'subscribed' | 'not-subscribed' | undefined>(undefined)

    const refresh = useCallback(() => {
        if (myConnectedWallet == null || tgId == null) {
            return
        }
        return fetchIsSubscribed(tgId, myConnectedWallet.toString())
            .then(isSubscribed => isSubscribed ? 'subscribed' : 'not-subscribed')
            .then(setConnectionStatus)
    }, [tgId, myConnectedWallet])

    useEffect(() => {
        refresh()
        return;
    }, [myConnectedWallet, tgId, refresh]);

    return <TgConnectionStatus.Provider value={{info: connectionStatus, refresh}}>
        {children}
    </TgConnectionStatus.Provider>
}

function MyAccountInfoWrapper({children}: { children: ReactNode }) {
    const myAccount = useStoreClientV2($myAccount)
    const [myAccountInfo, setMyAccountInfo] = useState<undefined | null | AccountInfo>(undefined)

    const refresh = useCallback(() => {
        if (myAccount === undefined) {
            setMyAccountInfo(undefined)
        } else if (myAccount === null) {
            setMyAccountInfo(null)
        } else {
            const accountContract = myAccount
            tonClient.getContractState(myAccount.address).then(async ({state}) => {
                if (state === 'active') {
                    const data = await accountContract.getAllData();
                    setMyAccountInfo({
                        price: data.minPrice,
                        assignedCount: data.assignedQuestionsCount,
                        submittedCount: data.submittedQuestionsCount,
                        status: 'active',
                        address: accountContract.address
                    });
                } else {
                    setMyAccountInfo(null);
                }
            })
        }
    }, [myAccount])
    useEffect(refresh, [myAccount, refresh]);

    return <MyAccountInfoContext.Provider
        value={{info: myAccountInfo, refresh}}>{children}</MyAccountInfoContext.Provider>
}

function SubmittedQuestions({children}: { children: ReactNode }) {
    const myAccount = useStoreClientV2($myAccount)
    const [mySubmittedQuestions, setMySubmittedQuestions] = useState<{
        isLoading: boolean,
        startLoading: boolean,
        id: number,
        data: QuestionData | null
    }[]>([])
    useEffect(() => {
        if (myAccount == null) {
            setMySubmittedQuestions([])
        }
    }, [myAccount]);

    const fetch = useCallback((id: number) => {
        if (myAccount == null) {
            return
        }
        setMySubmittedQuestions(currentItems => {
            const xx = currentItems.find(x => x.id === id)
            if (xx !== undefined) {
                return currentItems;
            }

            const newItems: { isLoading: boolean, id: number, data: QuestionData | null, startLoading: boolean }[] = [];
            for (let i = 0; i < currentItems.length && currentItems[i].id != id; i++) {
                newItems.push(currentItems[i])
            }
            newItems.push({data: null, isLoading: true, id, startLoading: true})

            return newItems
        })
    }, [myAccount])
    useEffect(() => {
        if (myAccount == null) {
            return
        }
        for (let i = 0; i < mySubmittedQuestions.length; i++) {
            if (!mySubmittedQuestions[i].startLoading) {
                continue;
            }
            const id = mySubmittedQuestions[i].id;
            myAccount.getQuestionRef(id)
                .then(x => x.getQuestion())
                .then(x => x.getAllData().then(xx => ({data: xx, addr: x.address})))
                .then(({data, addr}) => ({...data, from: data.submitterAddr, to: data.ownerAddr, id: data.id, addr}))
                .then((x: QuestionData) => {
                    setMySubmittedQuestions(currentItems => {
                        const newItems: {
                            isLoading: boolean,
                            id: number,
                            data: QuestionData | null,
                            startLoading: boolean
                        }[] = [];
                        for (let i = 0; i < currentItems.length && currentItems[i].id != id; i++) {
                            newItems.push(currentItems[i])
                        }
                        newItems.push({data: x, isLoading: false, id, startLoading: false})
                        return newItems
                    })
                })
        }
    }, [myAccount, mySubmittedQuestions]);

    return <MySubmittedQuestionsContext.Provider value={{
        items: mySubmittedQuestions,
        fetch
    }}>
        {children}
    </MySubmittedQuestionsContext.Provider>
}

export default function MyAppWrapper({children}: { children: ReactNode }) {
    const myAccount = useStoreClientV2($myAccount)
    const [myAssignedQuestions, setMyAssignedQuestions] = useState<{
        isLoading: boolean,
        startLoading: boolean,
        id: number,
        data: QuestionData | null
    }[]>([])
    useEffect(() => {
        if (myAccount == null) {
            setMyAssignedQuestions([])
        }
    }, [myAccount]);

    const fetch = useCallback((id: number) => {
        if (myAccount == null) {
            return
        }
        setMyAssignedQuestions(currentItems => {
            const xx = currentItems.find(x => x.id === id)
            if (xx !== undefined) {
                return currentItems;
            }

            const newItems: { isLoading: boolean, id: number, data: QuestionData | null, startLoading: boolean }[] = [];
            for (let i = 0; i < currentItems.length && currentItems[i].id != id; i++) {
                newItems.push(currentItems[i])
            }
            newItems.push({data: null, isLoading: true, id, startLoading: true})

            return newItems
        })
    }, [myAccount])
    useEffect(() => {
        if (myAccount == null) {
            return
        }
        for (let i = 0; i < myAssignedQuestions.length; i++) {
            if (!myAssignedQuestions[i].startLoading) {
                continue;
            }
            const id = myAssignedQuestions[i].id;
            myAccount.getQuestion(id)
                .then(x => x.getAllData().then(xx => ({data: xx, addr: x.address})))
                .then(({data, addr}) => ({...data, from: data.submitterAddr, to: data.ownerAddr, id: data.id, addr}))
                .then((x: QuestionData) => {
                    setMyAssignedQuestions(currentItems => {
                        const newItems: {
                            isLoading: boolean,
                            id: number,
                            data: QuestionData | null,
                            startLoading: boolean
                        }[] = [];
                        for (let i = 0; i < currentItems.length && currentItems[i].id != id; i++) {
                            newItems.push(currentItems[i])
                        }
                        newItems.push({data: x, isLoading: false, id, startLoading: false})
                        return newItems
                    })
                })
        }
    }, [myAccount, myAssignedQuestions]);

    return <TgConnectionStatusWrapper>
        <MyAccountInfoWrapper>
            <MyAssignedQuestionsContext.Provider value={{
                items: myAssignedQuestions,
                fetch
            }}>
                <SubmittedQuestions>
                    {children}
                </SubmittedQuestions>
            </MyAssignedQuestionsContext.Provider>
        </MyAccountInfoWrapper>
    </TgConnectionStatusWrapper>
}