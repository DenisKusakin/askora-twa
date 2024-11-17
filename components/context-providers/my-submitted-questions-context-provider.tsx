import {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {MyAccountContext} from "@/context/my-account-context";
import {QuestionData} from "@/stores/questions-store";
import {MySubmittedQuestionsContext} from "@/context/my-questions-context";

export default function MySubmittedQuestionsContextProvider({children}: { children: ReactNode }) {
    const myAccount = useContext(MyAccountContext)//useStoreClientV2($myAccount)
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