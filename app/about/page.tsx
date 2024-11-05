import {APP_CONTRACT_ADDR} from "@/components/utils/constants";
import Link from "next/link";

export default function AboutPage() {
    return <div className={"pt-10"}>
        <article className={"prose"}>
            <h2>Open Q&A platform</h2>
            <p className={"text text-lg font-bold"}>
                All data, including questions and replies, is stored on-chain and publicly visible to everyone
            </p>
            <h3>Submitting a Question</h3>
            <p>
                To ask a question, you&#39;ll need to pay a fee in TON tokens,
                which will be held in escrow until the answer is provided or the question is rejected.
            </p>
            <h3>Receiving a Response</h3>
            <p>
                If the recipient answers your question, the tokens you paid are transferred to them as a reward,
                minus a 5% service fee.
                This fee is only deducted if the question is answered and is paid by the person who submitted the
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
                Since every action on the platform (such as submitting a question, answering, rejecting, or requesting a
                refund)
                is processed on-chain, transaction fees apply (<b>≈0.06 TON</b>)
            </p>
        </article>
        <article className={"prose mt-2"}>
            <h3>Details</h3>
            <p>
                Askora is built completely on <Link target={"_blank"} href={"https://ton.org"} className={"link link-primary"}>TON</Link>.
                All the functionality backed by smart contracts, user interface runs completely on client.
                Source code is open
            </p>
        </article>
        <Link target={"_blank"} className={"link link-sm link-primary mb-1"}
              href={`https://testnet.tonviewer.com/${APP_CONTRACT_ADDR.toString()}`}>Root Contract</Link>
    </div>
}