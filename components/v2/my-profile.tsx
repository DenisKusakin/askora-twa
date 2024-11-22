import {fromNano} from "@ton/core";
import Link from "next/link";
import copyTextHandler from "@/utils/copy-util";
import {useContext, useEffect} from "react";
import {TgConnectionStatus} from "@/context/my-account-context";
import {MyTgContext} from "@/context/tg-context";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {useAuth} from "@/hooks/auth-hook";
import {useAccountInfo} from "@/components/queries/queries";
import {useRouter} from "next/navigation";
import CreateAccount from "@/components/v2/create-account";

export default function MyProfile() {
    const myConnectedWallet = useMyConnectedWallet()
    const myAccountInfoQuery = useAccountInfo(myConnectedWallet)
    const myAccountInfo = myAccountInfoQuery.data
    const auth = useAuth()

    const tgConnectionStatus = useContext(TgConnectionStatus).info
    const tgId = useContext(MyTgContext).info?.tgId

    const onDisconnectClick = () => {
        auth.disconnect()
    }
    const onConnectClick = () => {
        auth.connect()
    }
    const onShareClick = () => {
        if (myConnectedWallet == null) {
            return
        }
        navigator.share({
            url: `https://t.me/AskoraBot/app?startapp=0_${myConnectedWallet}`,
            title: 'Share this link with your audience'
        })
    }
    if(myConnectedWallet != null && myAccountInfoQuery.isError && myAccountInfoQuery.error?.message === 'account not found'){
        return <CreateAccount/>
    }
    if (myConnectedWallet === undefined || (myConnectedWallet != null && myAccountInfoQuery.isPending)) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }

    if (myConnectedWallet === null) {
        return <div className={"pt-10 text-center"}>
            <h1 className={"text text-center text-xl"}>Askora</h1>
            <h3 className={"text text-lg mt-4 font-light"}>Open Q&N platform powered by TON</h3>
            <div className={"mt-10 mb-10"}>
                {/*<h2 className={"text text-xl mt-2"}>Connect Your TON Wallet</h2>*/}
                {/*<h2 className={"text text-xl mt-2"}>Create an Account & Set Your Price</h2>*/}
                {/*<h2 className={"text text-xl mt-2"}>Share Your Link with Your Audience</h2>*/}
                {/*<h2 className={"text text-xl mt-2"}>Reply & Earn Rewards 💰</h2>*/}
                <div className="steps steps-vertical lg:steps-horizontal">
                    <div className="step step-primary">
                        <p className="font-bold">Connect Your TON Wallet</p>
                    </div>
                    <div className="step">
                        <p className="font-bold">Create an Account & Set Your Price</p>
                    </div>
                    <div className="step">
                        <p className="font-bold">Share Your Link with Your Audience</p>
                    </div>
                    <div className="step">
                        <p className="font-bold">Reply & Earn Rewards 💰</p>
                    </div>
                </div>
            </div>
            <button className={"btn btn-block btn-primary btn-lg mt-4"} onClick={onConnectClick}>Connect
            </button>
            <Link href={"/find"} className={"btn btn-primary btn-outline btn-lg mt-4 btn-block"}>Find User</Link>
            <Link href={"/about"} className={"btn btn-outline btn-info btn-lg btn-block mt-5"}>About</Link>
        </div>
    }

    let tgConnectionBadge = null;
    if (tgConnectionStatus != null && tgId != null) {
        if (tgConnectionStatus === 'subscribed') {
            tgConnectionBadge =
                <Link href={"/tg-status"} className={"badge badge-outline badge-success"}>Telegram Connected</Link>
        } else {
            tgConnectionBadge =
                <Link href={"/tg-status"} className={"badge badge-outline badge-error"}>Telegram Not Connected</Link>
        }
    }

    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            {/*<div className={"text-neutral text-xl"}>Price</div>*/}
            {myAccountInfo != null && <Link href={"/configure"}>
                <span className={"text-3xl font-bold"}>{parseFloat(fromNano(myAccountInfo.price))}</span>
                <span className={"text-xl ml-2"}>TON</span>
            </Link>}
            {(myAccountInfo?.description != null && myAccountInfo?.description !== '') ?
                <Link href={"/configure/description"} className={"text mt-2 text-base italic text-center"}>
                    &quot;{myAccountInfo?.description}&quot;
                </Link> : <Link href={"/configure/description"}
                                className={"text mt-2 text-base italic text-center font-extralight"}>Set
                    description</Link>}
            {tgConnectionBadge != null && <div className={"mt-5"}>{tgConnectionBadge}</div>}
            <div className={"mt-5 w-full"}>
                <Link href={"/inbox"} className="btn btn-block">
                    <span className={"text-2xl"}>Inbox</span>
                </Link>
                <Link href={"/sent"} className="btn btn-block mt-5">
                    <span className={"text-2xl"}>Sent</span>
                </Link>
                <button className={"btn btn-block btn-primary btn-lg mt-10"}
                        onClick={onShareClick}>Share
                </button>
                <Link href={"/find"} className={"btn btn-primary btn-outline btn-lg mt-4 btn-block"}>Find
                    User</Link>
                <button className={"btn btn-error btn-outline btn-block btn-lg mt-4"}
                        onClick={onDisconnectClick}>Disconnect
                </button>
                <Link href={"/about"} className={"btn btn-outline btn-info btn-lg btn-block mt-4"}>About</Link>
                <Link href={"/configure/sponsored-transactions"}
                      className={"btn btn-warning btn-outline btn-lg mt-4 btn-block"}>Advanced</Link>
            </div>
            <div className={"mt-20"}>
                <div className={"text-xs break-all font-light mb-1"}
                     onClick={copyTextHandler(myConnectedWallet.toString())}>{myConnectedWallet.toString()}</div>
                {myAccountInfo != null && <div className={"text-xs break-all font-light"}
                                               onClick={copyTextHandler(myAccountInfo?.address?.toString())}>{myAccountInfo?.address?.toString()}</div>}
            </div>
        </div>
    </div>
}