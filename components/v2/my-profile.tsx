import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {
    $connectionStatusChanged,
    $myAccountInfo,
    $myConnectedWallet,
    $tgConnectionStatus,
    $tgId, $tgInitData
} from "@/stores/profile-store";
import {fromNano} from "@ton/core";
import Link from "next/link";
import {tonConnectUI} from "@/stores/ton-connect";
import CreateAccount from "@/components/v2/create-account";
import {$myAssignedQuestions, $mySubmittedQuestions} from "@/stores/questions-store";
import copyTextHandler from "@/utils/copy-util";
import {subscribe} from "@/services/api";

export default function MyProfile() {
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const myAccountInfo = useStoreClientV2($myAccountInfo)

    const myQuestionsAssigned = useStoreClientV2($myAssignedQuestions)
    const myQuestionsSubmitted = useStoreClientV2($mySubmittedQuestions)

    const tgConnectionStatus = useStoreClientV2($tgConnectionStatus)
    const tgId = useStoreClientV2($tgId)
    const tgInitData = useStoreClientV2($tgInitData)

    const onDisconnectClick = () => {
        tonConnectUI?.disconnect()
    }
    const onConnectClick = () => {
        tonConnectUI?.modal?.open()
    }
    const onShareClick = () => {
        if (myConnectedWallet == null) {
            return
        }
        navigator.share({url: `https://t.me/AskoraBot/app?startapp=${myConnectedWallet.toString()}`})
    }
    if (myConnectedWallet === undefined || myAccountInfo === undefined) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
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
                <h2 className={"text text-xl mt-2"}>💰 Reply and earn reward</h2>
            </div>
            <button className={"btn btn-block btn-primary btn-lg mt-4"} onClick={onConnectClick}>Connect
            </button>
            <Link href={"/find"} className={"btn btn-primary btn-outline btn-lg mt-4 btn-block"}>Find User</Link>
            <Link href={"/about"} className={"btn btn-outline btn-success btn-lg btn-block mt-5"}>About</Link>
        </div>
    }
    const onTgConnectClick = () => {
        if(tgInitData == null || myConnectedWallet == null) {
            return
        }
        subscribe(tgInitData, myConnectedWallet.toString())
            .then(() => $connectionStatusChanged.set(true))
    }

    let tgConnectionBadge = null;
    if (tgConnectionStatus != null) {
        if (tgConnectionStatus === 'subscribed') {
            tgConnectionBadge = <div className={"badge badge-outline badge-success"}>Telegram Connected</div>
        } else {
            tgConnectionBadge = <div className={"badge badge-outline badge-error"} onClick={onTgConnectClick}>Not Connected</div>
        }
    }
    const tgIdBadge = <div className={"text-sm font-light mt-2"}>Tg: {tgId}</div>

    const newQuestionsToMe = myQuestionsAssigned?.data?.filter(x => !x.isClosed)?.length
    const myQuestionsNotReplied = myQuestionsSubmitted?.data?.filter(x => !x.isClosed)?.length

    return <div className={"pt-10"}>
        <div className={"flex flex-col items-center"}>
            <div className={"text-neutral text-xl"}>Price</div>
            {myAccountInfo !== null && <div>
                <span className={"text-5xl font-bold"}>{parseFloat(fromNano(myAccountInfo.price))}</span>
                <span className={"text-3xl ml-2"}>TON</span>
            </div>}
            <div className={"mt-10 flex flex-row"}>
                <Link href={"/configure"} className={"btn btn-sm btn-primary btn-outline ml-4"}>Settings</Link>
                <button className={"btn btn-sm btn-primary ml-4"}
                        onClick={onShareClick}>Share
                </button>
            </div>
            {tgIdBadge}
            {tgConnectionBadge != null && <div className={"mt-5"}>{tgConnectionBadge}</div>}
            <div className={"mt-10 w-full"}>
                <Link href={"/inbox"} className="btn btn-block">
                    <span className={"text-2xl"}>Inbox</span>
                    {myQuestionsAssigned !== undefined && !myQuestionsAssigned.isLoading && newQuestionsToMe != null && newQuestionsToMe !== 0 &&
                        <div className="badge badge-secondary">+{newQuestionsToMe}</div>}
                    {myQuestionsAssigned === undefined || myQuestionsAssigned.isLoading &&
                        <div className={"loading loading-xs loading-dots"}></div>}
                </Link>
                <Link href={"/sent"} className="btn btn-block mt-5">
                    <span className={"text-2xl"}>Sent</span>
                    {myQuestionsSubmitted !== undefined && !myQuestionsSubmitted.isLoading && myQuestionsNotReplied !== 0 &&
                        <div className="badge badge-secondary">{myQuestionsNotReplied}</div>}
                    {myQuestionsSubmitted === undefined || myQuestionsSubmitted.isLoading &&
                        <div className={"loading loading-xs loading-dots"}></div>}
                </Link>
                <Link href={"/about"} className={"btn btn-outline btn-info btn-lg btn-block mt-10"}>About</Link>
                <Link href={"/find"} className={"btn btn-primary btn-outline btn-lg mt-4 btn-block"}>Find User</Link>
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