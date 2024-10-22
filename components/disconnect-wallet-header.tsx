'use client';

import {$myProfile} from "@/stores/profile-store";
import {tonConnectUI} from "@/stores/ton-connect";
import {useStoreClient} from "@/components/hooks/use-store-client";
import Link from "next/link";

export default function DisconnectWalletHeader() {
    const myProfile = useStoreClient($myProfile)
    console.log("Profile", myProfile)

    return <div className="navbar bg-base-100">
        <div className="drawer z-20">
            <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content">
                <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-5 w-5 stroke-current">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <li><Link href={"/my-account"}>My Account</Link></li>
                    <li><Link href={"/"}>Home</Link></li>
                </ul>
            </div>
        </div>
        <div className="flex-1">
            <a className="btn btn-ghost text-sm">Askora</a>
        </div>
        <div className="navbar-end">
            {myProfile !== null &&
                <a className="btn btn-warning ml-1" onClick={() => tonConnectUI?.disconnect()}>Disconnect</a>}
        </div>
    </div>
}