'use client';

import {TonConnectUI} from "@tonconnect/ui";

let tonConnectUI2 = null
if (typeof window != 'undefined') {
    tonConnectUI2 = new TonConnectUI({
        manifestUrl: 'https://askora-twa.vercel.app/tonconnect-manifest.json',
        actionsConfiguration: {
            twaReturnUrl: 'https://t.me/AskoraBot/app',
            returnStrategy: 'back'
        }
    })
}

export const tonConnectUI = tonConnectUI2