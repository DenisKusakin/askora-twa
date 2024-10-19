'use client';

import {useTonAddress, useTonConnectModal} from "@tonconnect/ui-react";
import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import Link from "next/link";

export default function Home() {
    const {open} = useTonConnectModal();
    const tonAddr = useTonAddress();

    return (
        <>
            <div><DisconnectWalletHeader/></div>
            <div className={"flex flex-col align-middle"}>
                <div className="hero bg-base-200 min-h-screen">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold">Askora</h1>
                            <p className="py-6">
                                Reply to questions and get reward
                            </p>
                            {tonAddr === '' && <button className="btn btn-primary" onClick={open}>Connect</button>}
                            {tonAddr !== '' && <Link href={"/my-account"} className="btn btn-primary">My Account</Link>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
