'use client';

import {ReactNode} from "react";
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import AuthContextProvider from "@/components/context-providers/auth-context-provider";
import TgMainButtonContextProvider from "@/components/context-providers/tg-main-button-context-provider";
import TgConnectionStatusContextProvider from "@/components/context-providers/tg-connection-status-context-provider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient()

export default function MyAppWrapper({children}: { children: ReactNode }) {

    return <TonConnectUIProvider manifestUrl={'https://askora.vercel.app/tonconnect-manifest.json'}
                                 actionsConfiguration={{
                                     twaReturnUrl: `https://t.me/AskoraBot/app`,
                                     returnStrategy: 'back'
                                 }}>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false}/>
            <AuthContextProvider>
                <TgConnectionStatusContextProvider>
                    <TgMainButtonContextProvider>
                        {children}
                    </TgMainButtonContextProvider>
                </TgConnectionStatusContextProvider>
            </AuthContextProvider>
        </QueryClientProvider>
    </TonConnectUIProvider>
}