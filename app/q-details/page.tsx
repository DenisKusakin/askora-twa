'use client';

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import {Address} from "@ton/core";
import QuestionDetailsPage from "@/components/v2/question-details-page";

function Comp() {
    const searchParams = useSearchParams()
    const owner_id = searchParams.get('owner_id')
    const q_id = searchParams.get('q_id')

    let res = <h1>Something wrong</h1>;

    if (owner_id != null && q_id != null) {
        res = <QuestionDetailsPage ownerAddress={Address.parse(owner_id)} id={parseInt(q_id)}/>
    }

    return res;
}

export default function MyQuestionPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}