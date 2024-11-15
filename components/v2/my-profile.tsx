import {fromNano} from "@ton/core";
import Link from "next/link";
import CreateAccount from "@/components/v2/create-account";
import copyTextHandler from "@/utils/copy-util";
import {useContext} from "react";
import {MyAccountInfoContext, TgConnectionStatus} from "@/app/context/my-account-context";
import {MyTgContext} from "@/app/context/tg-context";
import {useMyConnectedWallet} from "@/app/hooks/ton-hooks";
import {useAuth} from "@/app/hooks/auth-hook";

export default function MyProfile() {
    const myConnectedWallet = useMyConnectedWallet()
    const myAccountInfo = useContext(MyAccountInfoContext).info
    const auth = useAuth()

    const tgConnectionStatus = useContext(TgConnectionStatus).info
    const tgId = useContext(MyTgContext).info?.tgId
    // const [tonConnectUI] = useTonConnectUI();

    const onDisconnectClick = () => {
        //tonConnectUI?.disconnect()
        auth.disconnect()
    }
    const onConnectClick = () => {
        //tonConnectUI?.modal?.open()
        auth.connect()
    }
    const onShareClick = () => {
        if (myConnectedWallet == null) {
            return
        }
        navigator.share({url: `https://t.me/AskoraBot/app?startapp=0_${myConnectedWallet}`})
    }
    if (myConnectedWallet === undefined || myAccountInfo === undefined) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    //TODO: Right after connecting a wallet, it is possible that this condition would be true even though account could exist
    //need to fix
    if (myConnectedWallet !== null && myAccountInfo === null) {
        return <CreateAccount/>
    }
    if (myConnectedWallet === null) {
        return <div className={"pt-10 text-center"}>
            <h1 className={"text text-center text-xl"}>Askora</h1>
            <h2 className={"text text-xl mt-4"}>Open Q&N platform powered by TON</h2>
            <div className={"mt-20 mb-20"}>
                <h2 className={"text text-xl mt-2"}>Connect TON Wallet</h2>
                <h2 className={"text text-xl mt-2"}>Create an account and set a price</h2>
                <h2 className={"text text-xl mt-2"}>Share link with your audience</h2>
                <h2 className={"text text-xl mt-2"}>💰Reply and earn reward</h2>
            </div>
            <button className={"btn btn-block btn-primary btn-lg mt-4"} onClick={onConnectClick}>Connect
            </button>
            <Link href={"/find"} className={"btn btn-primary btn-outline btn-lg mt-4 btn-block"}>Find User</Link>
            <Link href={"/about"} className={"btn btn-outline btn-success btn-lg btn-block mt-5"}>About</Link>
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
            {myAccountInfo !== null && <Link href={"/configure"}>
                <span className={"text-3xl font-bold"}>{parseFloat(fromNano(myAccountInfo.price))}</span>
                <span className={"text-xl ml-2"}>TON</span>
            </Link>}
            {(myAccountInfo?.description != null && myAccountInfo?.description !== '') ?
                <Link href={"/configure/description"} className={"text mt-2 text-base italic text-center"}>
                    &quot;{myAccountInfo?.description}&quot;
                </Link> : <Link href={"/configure/description"}
                                className={"text mt-2 text-base italic text-center font-extralight"}>Set
                    description</Link>}
            {/*<div className={"mt-5 flex flex-row"}>*/}
            {/*    <Link href={"/configure"} className={"btn btn-sm btn-primary btn-outline ml-4"}>Change The*/}
            {/*        Price</Link>*/}
            {/*    <button className={"btn btn-sm btn-primary ml-4"}*/}
            {/*            onClick={onShareClick}>Share*/}
            {/*    </button>*/}
            {/*</div>*/}
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
                <Link href={"/about"} className={"btn btn-outline btn-info btn-lg btn-block mt-4"}>About</Link>
                <Link href={"/find"} className={"btn btn-primary btn-outline btn-lg mt-4 btn-block"}>Find
                    User</Link>
                <button className={"btn btn-error btn-outline btn-block btn-lg mt-4"}
                        onClick={onDisconnectClick}>Disconnect
                </button>
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