'use client'

import {useSearchParams} from "next/navigation";
import {Address} from "@ton/core";
import {Suspense} from "react";
import Ask from "@/components/v2/ask";

function Comp() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    let res = <h1>Something wrong</h1>;

    if (id !== null) {
        res = <Ask addr={Address.parse(id)}/>
    }

    return res;
}

export default function AskPage(){

    return <Suspense>
        <Comp/>
    </Suspense>
}