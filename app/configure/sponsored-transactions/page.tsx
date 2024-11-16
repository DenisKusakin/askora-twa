'use client';
import {useAuth} from "@/hooks/auth-hook";

export default function SponsoredTransactionsPage() {
    const auth = useAuth()

    return <div className={"pt-10"}>
        <p className={"text text-sm font-light text-center mt-2"}>Askora operates entirely on-chain, meaning all actions
            require transaction fees. To enhance your experience, the service can cover these fees and send transactions
            on your behalf at no cost.</p>
        <p className={"text text-sm font-light text-center mt-2"}>
            You can disable sponsored transactions at any time to experience a true Web3 application. This setting is
            flexible and does not impact the core functionality of the app.
        </p>

        {auth.sponsoredTransactionsEnabled &&
            <button className={"btn btn-lg btn-block btn-primary mt-4"}
                    onClick={() => auth.setSponsoredTransactionsEnabled(false)}>Disable Sponsored
                Transactions</button>}
        {!auth.sponsoredTransactionsEnabled &&
            <button className={"btn btn-lg btn-block btn-primary mt-4"}
                    onClick={() => auth.setSponsoredTransactionsEnabled(true)}>Enable Sponsored
                Transactions</button>}
    </div>
}