'use client';
import {useAuth} from "@/hooks/auth-hook";
import {useRouter} from "next/navigation";

export default function SponsoredTransactionsPage() {
    const auth = useAuth()
    const router = useRouter();

    return <div className={"pt-10"}>
        <p className={"text text-base font-light text-center mt-2"}>Askora operates on-chain, meaning transaction fees
            apply. To improve your experience, we can cover these fees for you. You can enable and disable sponsored
            transactions
            anytime without affecting app functionality</p>
        <p className={"text text-base font-light text-center mt-2"}>Using your own wallet speeds up transactions and
            avoids delays, while sponsored transactions may take longer due to factors beyond the blockchain itself</p>
        {auth.sponsoredTransactionsEnabled &&
            <button className={"btn btn-lg btn-block btn-primary mt-4"}
                    onClick={() => auth.setSponsoredTransactionsEnabled(false)}>Disable Sponsored
                Transactions</button>}
        {!auth.sponsoredTransactionsEnabled &&
            <button className={"btn btn-lg btn-block btn-primary mt-4"}
                    onClick={() => auth.setSponsoredTransactionsEnabled(true)}>Enable Sponsored
                Transactions</button>}
        <button onClick={() => router.back()} className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Cancel
        </button>
    </div>
}