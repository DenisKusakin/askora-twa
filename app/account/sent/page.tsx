'use client';

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {Address} from "@ton/core";
import AccountSent from "@/components/v2/account-sent";

function Comp() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    let res = <h1>Something wrong</h1>;

    if (id !== null) {
        res = <AccountSent owner={Address.parse(id)}/>
    }

    return res;
}

export default function AccountSentPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}