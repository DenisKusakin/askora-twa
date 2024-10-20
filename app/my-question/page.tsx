'use client';

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import ReplyQuestionPage from "@/components/reply-question-page";

function Comp() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const isReply = searchParams.get('command') === 'reply'

    let res = <h1>Something wrong</h1>;

    if (isReply && id !== null) {
        res = <ReplyQuestionPage id={parseInt(id)}/>
    }

    return res;
}

export default function MyQuestionPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}