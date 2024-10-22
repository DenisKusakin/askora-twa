'use client';

import {useEffect} from "react";
import {Address} from "@ton/core";
import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import AccountQuestions from "@/components/account-questions-component-v2";
import Link from "next/link";
import AccountInfo from "@/components/account-info";
import {$otherProfile, $otherProfileInfo} from "@/stores/other-profile-store";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$otherProfileAssignedQuestions, $otherProfileSubmittedQuestions} from "@/stores/other-profile-questions-store";

export default function AccountPage({id}: { id: string }) {
    useEffect(() => {
        $otherProfile.set({address: Address.parse(id)})
    }, [id])
    const accountState = useStoreClient($otherProfileInfo)
    const profile = useStoreClient($otherProfile)

    if (profile === null || accountState === null || accountState.status !== 'active') {
        return <div role="alert" className="alert alert-error mt-10">
            <span>Account does not exist</span>
        </div>
    }

    return <>
        <DisconnectWalletHeader/>
        {accountState.status === 'active' && <AccountInfo
            accountPrice={accountState.price}
            editable={false}
            tonAddr={profile.address.toString()}
            accountAddr={accountState.address.toString()}/>}
        <div className={"mt-5"}>
            {accountState.status === 'active' && <AccountQuestions showButtons={false}
                                                                   assignedQuestionsStore={$otherProfileAssignedQuestions}
                                                                   submittedQuestionsStore={$otherProfileSubmittedQuestions}/>}
        </div>
        <div className={"btm-nav w-full bg-primary"}>
            {accountState.status === 'active' &&
                <Link className="btn btn-block btn-primary" href={`/account?id=${id}&command=submit`}>
                    <h1 className={"text-xl"}>Ask</h1>
                </Link>}
        </div>
    </>
}