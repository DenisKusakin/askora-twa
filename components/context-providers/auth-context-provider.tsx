import {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {TonProofApi} from "@/services/TonProofApi";
import {AuthContext} from "@/context/auth-context";

export default function AuthContextProvider({children}: { children: ReactNode }) {
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