import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {TonProofApi} from "@/services/TonProofApi";

export function useAuth() {
    const firstProofLoading = useRef<boolean>(true);
    // const wallet = useTonWallet()
    // const [authorized, setAuthorized] = useState(false);
    const [tonConnectUI] = useTonConnectUI();
    const [sponsoredTransactionsEnabled] = useState(true)

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
                // setAuthorized(false);
                return;
            }
            if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
                await TonProofApi.checkProof(w.connectItems.tonProof.proof, w.account);
            }

            if (sponsoredTransactionsEnabled && !TonProofApi.accessToken) {
                tonConnectUI.disconnect();
                // setAuthorized(false);
                return;
            }

            // setAuthorized(true);
        }), [tonConnectUI, sponsoredTransactionsEnabled]);

    const connect = useCallback(() => {
        tonConnectUI.openModal()
    }, [tonConnectUI])
    const disconnect = useCallback(() => {
        tonConnectUI.disconnect()
        TonProofApi.reset()
    }, [tonConnectUI])

    return useMemo(() => ({
        connect,
        disconnect,
        sponsoredTransactionsEnabled,
        updateTonProof
    }), [connect, disconnect, sponsoredTransactionsEnabled, updateTonProof])
}