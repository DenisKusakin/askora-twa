'use client';

import {ReactNode} from "react";
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import AuthContextProvider from "@/components/context-providers/auth-context-provider";
import TgMainButtonContextProvider from "@/components/context-providers/tg-main-button-context-provider";
import TgConnectionStatusContextProvider from "@/components/context-providers/tg-connection-status-context-provider";
import MyAccountContextProvider from "@/components/context-providers/my-account-context-provider";
import MySubmittedQuestionsContextProvider
    from "@/components/context-providers/my-submitted-questions-context-provider";
import MyAssignedQuestionsContextProvider from "@/components/context-providers/my-assigned-questions-context-provider";


export default function MyAppWrapper({children}: { children: ReactNode }) {

    return <TonConnectUIProvider manifestUrl={'https://askora-twa.vercel.app/tonconnect-manifest.json'}
                                 actionsConfiguration={{
                                     twaReturnUrl: `https://t.me/AskoraBot/app`,
                                     returnStrategy: 'back'
                                 }}>
        <AuthContextProvider>
            <TgConnectionStatusContextProvider>
                <TgMainButtonContextProvider>
                    <MyAccountContextProvider>
                        <MyAssignedQuestionsContextProvider>
                            <MySubmittedQuestionsContextProvider>
                                {children}
                            </MySubmittedQuestionsContextProvider>
                        </MyAssignedQuestionsContextProvider>
                    </MyAccountContextProvider>
                </TgMainButtonContextProvider>
            </TgConnectionStatusContextProvider>
        </AuthContextProvider>
    </TonConnectUIProvider>
}