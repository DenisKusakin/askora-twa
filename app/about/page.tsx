import {APP_CONTRACT_ADDR} from "@/components/utils/constants";
import Link from "next/link";

export default function AboutPage(){
    return <div className={"pt-10"}>
        <article className={"prose"}>
            <h2>Open Q&A platform</h2>
            <h3>What does &quot;open&quot; mean?</h3>
            <p>
                Askora is built completely on <a href={"https://ton.org"} className={"link link-primary"}>TON</a>.
                All the functionality backed by smart contracts, user interface runs completely on client.
                Source code is open
            </p>
        </article>
        <div className={"absolute bottom-2"}>
            <Link className={"link link-sm link-primary mb-1"} href={`https://testnet.tonviewer.com/${APP_CONTRACT_ADDR.toString()}`}>Tonviewer</Link>
        </div>
    </div>
}