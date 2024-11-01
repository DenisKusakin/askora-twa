import {useStoreClient, useStoreClientV2} from "@/components/hooks/use-store-client";
import {$myAccountInfo, $myConnectedWallet} from "@/stores/profile-store";
import {fromNano} from "@ton/core";
import Link from "next/link";
import {tonConnectUI} from "@/stores/ton-connect";
import CreateAccount from "@/components/v2/create-account";
import {$myAssignedQuestions, $mySubmittedQuestions} from "@/stores/questions-store";

export default function MyProfile() {
    const myConnectedWallet = useStoreClientV2($myConnectedWallet)
    const myAccountInfo = useStoreClientV2($myAccountInfo)

    const myQuestionsAssigned = useStoreClientV2($myAssignedQuestions)
    const myQuestionsSubmitted = useStoreClientV2($mySubmittedQuestions)

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
        navigator.share({url: `${window.location.origin}/account?id=${myConnectedWallet.toString()}`})
    }
    if (myConnectedWallet === undefined || myAccountInfo === undefined) {
        return <div className={"pt-10 loading loading-lg loading-dots"}></div>
    }
    if (myConnectedWallet !== null && myAccountInfo === null) {
        console.log("!!!", myConnectedWallet, myAccountInfo)
        return <CreateAccount/>
    }
    if (myConnectedWallet === null) {
        return <div className={"pt-10 text-center"}>
            <h1 className={"text text-center text-xl"}>Askora</h1>
            <h2 className={"text text-xl mt-4"}>Open Q&N platform powered by TON</h2>
            <h2 className={"text text-sm mt-4"}>Connect your TON Wallet</h2>
            <h2 className={"text text-sm mt-4"}>Create an account and set a price of your reply</h2>
            <h2 className={"text text-sm mt-4"}>Share link with your audience and receive questions</h2>
            <h2 className={"text text-sm mt-4"}>Reply and get reward</h2>
            <Link href={"/about"} className={"btn btn-outline btn-success btn-xl btn-block mt-5"}>About</Link>
            <button className={"btn btn-block btn-primary btn-lg mt-4"} onClick={onConnectClick}>Connect
            </button>
        </div>
    }

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
                <Link href={"/configure"} className={"btn btn-sm btn-primary btn-outline ml-4"}>Configure</Link>
                <Link href={"/my-details"} className={"btn btn-sm btn-primary btn-outline ml-4"}>Details</Link>
                <button className={"btn btn-sm btn-primary btn-outline ml-4"}
                        onClick={onShareClick}>Share
                </button>
            </div>
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
                <Link href={"/find"} className={"btn btn-primary btn-outline btn-lg mt-10 btn-block"}>Find User</Link>
                <button className={"btn btn-error btn-outline btn-block btn-lg mt-4"}
                        onClick={onDisconnectClick}>Disconnect
                </button>
            </div>
        </div>
    </div>
}