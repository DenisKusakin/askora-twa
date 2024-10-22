'use client';

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {QuestionDetails} from "@/components/question-details";
import {Address} from "@ton/core";

function Comp() {
    const searchParams = useSearchParams()
    const owner_id = searchParams.get('owner_id')
    const q_id = searchParams.get('q_id')

    let res = <h1>Something wrong</h1>;

    if (owner_id != null && q_id != null) {
        res = <QuestionDetails ownerAddress={Address.parse(owner_id)} qId={parseInt(q_id)}/>
    }

    return res;
}

export default function MyQuestionPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}