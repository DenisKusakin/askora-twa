'use client';

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import Profile from "@/components/v2/profile";
import {Address} from "@ton/core";

function Comp() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    let res = <h1>Something wrong</h1>;

    if (id !== null && (Address.isRaw(id) || Address.isFriendly(id))) {
        res = <Profile owner={Address.parse(id)}/>
    }

    return res;
}

export default function AccountPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}