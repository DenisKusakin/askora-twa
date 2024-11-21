'use client';
import {useAuth} from "@/hooks/auth-hook";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function SponsoredTransactionsPage() {
    const auth = useAuth()
    const router = useRouter();
    const enabled = auth.sponsoredTransactionsEnabled
    const [isReady, setReady] = useState(false)
    useEffect(() => setReady(true), [])

    return <div className={"pt-10"}>
        <p className={"text text-base font-light text-center mt-2"}>Askora operates on-chain, meaning transaction fees
            apply. To improve your experience, we can cover these fees for you. You can enable and disable sponsored
            transactions
            anytime without affecting app functionality</p>
        <p className={"text text-base font-light text-center mt-2"}>Using your own wallet speeds up transactions and
            avoids delays, while sponsored transactions may take longer due to factors beyond the blockchain itself</p>
        {isReady && <label className="label cursor-pointer mt-4 mb-4">
            <input type="checkbox" className="toggle toggle-lg toggle-primary"
                   onChange={(e) => {
                       auth.setSponsoredTransactionsEnabled(e.target.checked)
                   }}
                   checked={enabled}/>
            <span className="label-text text-lg">Use Sponsored Transactions {enabled.toString()}</span>
        </label>}
        <button onClick={() => router.back()} className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel
        </button>
    </div>
}