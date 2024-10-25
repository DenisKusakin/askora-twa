'use client';

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {Address} from "@ton/core";
import AccountInbox from "@/components/v2/account-inbox";

function Comp() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    let res = <h1>Something wrong</h1>;

    if (id !== null) {
        res = <AccountInbox owner={Address.parse(id)}/>
    }

    return res;
}

export default function AccountInboxPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}