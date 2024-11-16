'use client';

import {ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {MyAssignedQuestionsContext, MySubmittedQuestionsContext} from "@/context/my-questions-context";
import {QuestionData} from "@/stores/questions-store";
import {tonClient} from "@/wrappers/ton-client";
import {
    AccountInfo,
    MyAccountContext,
    MyAccountInfoContext,
    TgConnectionStatus
} from "@/context/my-account-context";
import {fetchIsSubscribed} from "@/services/api";
import {MyTgContext} from "@/context/tg-context";
import {OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {Root} from "@/wrappers/Root";
import {APP_CONTRACT_ADDR} from "@/conf";
import {TonConnectUIProvider, useTonConnectUI} from "@tonconnect/ui-react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {TgMainButtonContext, TgMainButtonProps} from "@/context/tg-main-button-context";
import {AuthContext} from "@/context/auth-context";
import {TonProofApi} from "@/services/TonProofApi";

function AuthWrapper({children}: { children: ReactNode }) {
    const firstProofLoading = useRef<boolean>(true);
    const [tonConnectUI] = useTonConnectUI();
    const sponsoredTransactionsSetting = typeof localStorage != 'undefined' ? localStorage.getItem('sponsored-transactions') : null
    const [sponsoredTransactionsEnabled, setSponsoredTransactionsEnabled] = useState(sponsoredTransactionsSetting != null ? sponsoredTransactionsSetting === "true" : true)

    const recreateProofPayload = useCallback(async () => {
        if (tonConnectUI == null) {
            return;
        }
        if (firstProofLoading.current) {
            tonConnectUI.setConnectRequestParameters({state: 'loading'});
            firstProofLoading.current = false;
        }

        const payload = sponsoredTransactionsEnabled ? await TonProofApi.generatePayload() : null;
        if (payload) {
            tonConnectUI.setConnectRequestParameters({state: 'ready', value: payload});
        } else {
            tonConnectUI.setConnectRequestParameters(null);
        }
    }, [tonConnectUI, firstProofLoading, sponsoredTransactionsEnabled])

    const updateTonProof = useCallback(async () => {
        await tonConnectUI.disconnect()
        await recreateProofPayload()
        return tonConnectUI.openModal()
    }, [tonConnectUI, recreateProofPayload])

    if (firstProofLoading.current) {
        recreateProofPayload();
    }

    useEffect(() =>
        tonConnectUI.onStatusChange(async w => {
            if (!w) {
                TonProofApi.reset();
                return;
            }
            if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
                await TonProofApi.checkProof(w.connectItems.tonProof.proof, w.account);
            }

            if (sponsoredTransactionsEnabled && !TonProofApi.accessToken) {
                await tonConnectUI.disconnect();
                return;
            }
        }), [tonConnectUI, sponsoredTransactionsEnabled]);

    const connect = useCallback(() => {
        return tonConnectUI.openModal()
    }, [tonConnectUI])
    const disconnect = useCallback(async () => {
        await tonConnectUI.disconnect()
        TonProofApi.reset()
    }, [tonConnectUI])

    const res = useMemo(() => ({
        connect,
        disconnect,
        sponsoredTransactionsEnabled,
        setSponsoredTransactionsEnabled: (enabled: boolean) => {
            if (typeof localStorage != 'undefined') {
                localStorage.setItem('sponsored-transactions', enabled ? "true" : "false")
            }
            setSponsoredTransactionsEnabled(enabled);
        },
        updateTonProof
    }), [connect, disconnect, sponsoredTransactionsEnabled, updateTonProof])

    return <AuthContext.Provider value={res}>
        {children}
    </AuthContext.Provider>
}

function TgMainButtonWrapper({children}: { children: ReactNode }) {
    const [currentProps, setCurrentProps] = useState<TgMainButtonProps | null>(null)
    //TODO: What if TG Api is not yet available?
    const setProps = (newProps: TgMainButtonProps) => {
        if (newProps.visible != !currentProps?.visible) {
            if (newProps.visible) {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.show();
            } else {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.hide();
            }
        }
        if (newProps.enabled !== !currentProps?.enabled) {
            if (newProps.enabled) {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.enable();
            } else {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.disable();
            }
        }
        if (currentProps?.text !== newProps.text) {
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.setText(newProps.text);
        }
        if (currentProps?.onClick != newProps.onClick) {
            if (currentProps?.onClick != null) {
                // @ts-expect-error todo
                window.Telegram.WebApp.MainButton.offClick(currentProps?.onClick)
            }
            // @ts-expect-error todo
            window.Telegram.WebApp.MainButton.onClick(newProps.onClick)
        }
        setCurrentProps(newProps)
    }
    return <TgMainButtonContext.Provider value={{setProps}}>
        {children}
    </TgMainButtonContext.Provider>
}

//TODO: Simplify and make sure it is correct
function TgConnectionStatusWrapper({children}: { children: ReactNode }) {
    const myConnectedWallet = useMyConnectedWallet()
    const tgId = useContext(MyTgContext).info?.tgId
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
    const myConnectedWallet = useMyConnectedWallet()//useTonAddress()//useStoreClientV2($myConnectedWallet)
    const [myAccount, setMyAccount] = useState<undefined | null | OpenedContract<Account>>(undefined)

    useEffect(() => {
        if (myConnectedWallet === undefined) {
            setMyAccount(undefined)
        } else if (myConnectedWallet === null) {
            setMyAccount(null)
        } else {
            const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
            rootContract.getAccount(myConnectedWallet)
                .then(acc => setMyAccount(acc))
        }
    }, [myConnectedWallet]);
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
                        description: data.description,
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
        value={{info: myAccountInfo, refresh}}>
        <MyAccountContext.Provider value={myAccount}>
            {children}
        </MyAccountContext.Provider>
    </MyAccountInfoContext.Provider>
}

function SubmittedQuestions({children}: { children: ReactNode }) {
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

function MyAssignedQuestionsWrapper({children}: { children: ReactElement }) {
    const myAccount = useContext(MyAccountContext)//useStoreClientV2($myAccount)
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

    return <MyAssignedQuestionsContext.Provider value={{
        items: myAssignedQuestions,
        fetch
    }}>
        {children}
    </MyAssignedQuestionsContext.Provider>
}

export default function MyAppWrapper({children}: { children: ReactNode }) {

    return <TonConnectUIProvider manifestUrl={'https://askora-twa.vercel.app/tonconnect-manifest.json'}
                                 actionsConfiguration={{
                                     twaReturnUrl: `https://t.me/AskoraBot/app`,
                                     returnStrategy: 'back'
                                 }}>
        <AuthWrapper>
            <TgConnectionStatusWrapper>
                <TgMainButtonWrapper>
                    <MyAccountInfoWrapper>
                        <MyAssignedQuestionsWrapper>
                            <SubmittedQuestions>
                                {children}
                            </SubmittedQuestions>
                        </MyAssignedQuestionsWrapper>
                    </MyAccountInfoWrapper>
                </TgMainButtonWrapper>
            </TgConnectionStatusWrapper>
        </AuthWrapper>
    </TonConnectUIProvider>
}