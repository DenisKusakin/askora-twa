'use client';

import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import Link from "next/link";
import {$myProfile} from "@/stores/profile-store";
import {tonConnectUI} from "@/stores/ton-connect";
import {useStoreClient} from "@/components/hooks/use-store-client";

export default function Home() {
    const connectedProfile = useStoreClient($myProfile)
    return (
        <>
            <div><DisconnectWalletHeader/></div>
            <div className={"flex flex-col align-middle"}>
                <div className="hero bg-base-200 min-h-screen">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold">Askora</h1>
                            <p className="py-6">
                                Reply to questions and get reward {connectedProfile?.address.toString() || "error"}
                            </p>
                            {connectedProfile == null && <button className="btn btn-primary" onClick={() => tonConnectUI?.modal.open()}>Connect</button>}
                            {connectedProfile != null && <Link href={"/my-account"} className="btn btn-primary">My Account</Link>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
