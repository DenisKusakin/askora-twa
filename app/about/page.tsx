import Link from "next/link";
import {APP_CONTRACT_ADDR, TONVIEWER_BASE_PATH} from "@/conf";

export default function AboutPage() {
    return <div className={"pt-10"}>
        <article className={"prose"}>
            <h2>Open Q&A platform</h2>
            <p className={"text text-lg font-bold"}>
                Questions and replies are stored on-chain and accessible to the public.
            </p>
            <h3>Submitting a Question</h3>
            <p>
                To ask a question, you&#39;ll need to pay a fee in TON,
                which will be held in escrow until the answer is provided or the question is rejected.
            </p>
            <h3>Receiving a Response</h3>
            <p>
                If the recipient answers your question, TON you paid are transferred to them as a reward,
                minus a 5% service fee.
                Service fee is only deducted if the question is answered and is paid by the person who submitted the
                question.
            </p>
            <p>
                If the recipient chooses not to answer, they can reject the question.
                When this happens, the full amount you paid (including service fee, minus transaction fee) is returned
                to your wallet.
            </p>
            <p>
                If the recipient doesn’t reply or reject the question within 7 days, you can refund the full amount by
                clicking the “Cancel” button in the question details
            </p>
            <h3>Why Transaction Fees Apply</h3>
            <p>
                Every action on the platform (such as submitting a question, answering, rejecting, or requesting a
                refund) is processed on-chain, which incurs transaction fees (<b>≈0.06 TON per transaction</b>).
            </p>
            <p>
                To enhance your experience, all actions—except for submitting a question—can be performed without
                requiring payment. In these cases, the service covers the transaction fees. Please note, this feature
                may have limits per account.
            </p>
            <h2>Links</h2>
            <div className={"flex flex-col"}>
                <span className={"text text-xs mb-1"}>Application Contract:</span>
                <span className={"text text-xs font-light break-all"}>{APP_CONTRACT_ADDR.toString()}</span>
                <Link target={"_blank"} className={"link link-sm text-xs link-primary mb-1"}
                      href={`${TONVIEWER_BASE_PATH}/${APP_CONTRACT_ADDR.toString()}`}>Open in Tonviewer</Link>
            </div>
            <div className={"flex flex-col mt-4"}>
                <span className={"text text-xs mb-1"}>Source Code:</span>
                <Link target={"_blank"} className={"link link-sm text-xs link-primary mb-1"}
                      href={`https://github.com/DenisKusakin/askora`}>Github</Link>
            </div>
        </article>
    </div>
}