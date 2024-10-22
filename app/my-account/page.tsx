'use client';

import CreateAccount from "@/components/create-account";
import DisconnectWalletHeader from "@/components/disconnect-wallet-header";
import AccountQuestions from "@/components/account-questions-component-v2";
import AccountInfo from "@/components/account-info";
import {$myProfile, $myAccountInfo} from "@/stores/profile-store";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myAssignedQuestions, $mySubmittedQuestions} from "@/stores/questions-store";

export default function MyAccountPage() {
    const myAccountInfo = useStoreClient($myAccountInfo)
    const myAddr = useStoreClient($myProfile)?.address?.toString()
    const alert = <div role="alert" className="alert alert-warning mt-10 flex flex-row">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span>You need to create an account</span>
    </div>

    return <>
        {/*<div className={"drawer"}>*/}
        {/*    <input id="my-drawer" type="checkbox" className="drawer-toggle"/>*/}
        {/*    /!*<HamburgerButton id="my-drawer" className="drawer-toggle"/>*!/*/}
        {/*    <div className="drawer-content">*/}
        {/*        <HamburgerButton htmlFor="my-drawer" id="my-drawer" className="drawer-toggle"/>*/}
        {/*        /!*<label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>*!/*/}
        {/*    </div>*/}
        {/*    <div className="drawer-side z-20">*/}
        {/*        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>*/}
        {/*        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">*/}
        {/*            <li><a>Sidebar Item 1</a></li>*/}
        {/*            <li><a>Sidebar Item 2</a></li>*/}
        {/*        </ul>*/}
        {/*    </div>*/}
        {/*</div>*/}
        <DisconnectWalletHeader/>
        {myAccountInfo?.status !== 'active' && alert}
        {myAccountInfo?.status !== 'active' && <div className={"mt-2"}><CreateAccount/></div>}
        {myAccountInfo != null && myAddr != null && <AccountInfo
            accountPrice={myAccountInfo.price}
            editable={true}
            tonAddr={myAddr}
            accountAddr={myAccountInfo?.address.toString()}/>}
        <div className={"mt-5"}>
            {myAccountInfo?.status === 'active' &&
                <AccountQuestions showButtons={true}
                                  submittedQuestionsStore={$mySubmittedQuestions}
                                  assignedQuestionsStore={$myAssignedQuestions}/>}
        </div>
    </>
}