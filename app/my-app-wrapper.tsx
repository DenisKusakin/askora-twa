'use client';

import {ReactNode, useCallback, useEffect, useState} from "react";
import {MyAssignedQuestionsContext} from "@/app/context/my-questions-context";
import {QuestionData} from "@/stores/questions-store";
import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myAccount} from "@/stores/profile-store";

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
                .then(({data, addr}) => ({...data, from: data.submitterAddr, to: data.ownerAddr, id, addr}))
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

    return <MyAssignedQuestionsContext.Provider value={{
        items: myAssignedQuestions,
        fetch
    }}>
        {children}
    </MyAssignedQuestionsContext.Provider>
}