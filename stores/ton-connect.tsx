'use client';

import {TonConnectUI} from "@tonconnect/ui";

let tonConnectUI2 = null
if (typeof window != 'undefined') {
    tonConnectUI2 = new TonConnectUI({
        // manifestUrl: 'https://gist.githubusercontent.com/DenisKusakin/de24b720a1cf30fb37a6e3f081e534c1/raw/5ab9448366149533f586cb77c43aa66768a455cf/gistfile1.txt',
        // TODO: Make it available under root
        manifestUrl: 'https://deniskusakin.github.io/askora-twa/manifest.json',
    })
}

export const tonConnectUI = tonConnectUI2