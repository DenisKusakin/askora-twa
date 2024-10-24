'use client';

import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
// import ReplyQuestionPage from "@/components/reply-question-page";
import MyQuestionDetails from "@/components/v2/my-question-details";

function Comp() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    // const isReply = searchParams.get('command') === 'reply'

    let res = <h1>Something wrong</h1>;

    if (id !== null) {
        res = <MyQuestionDetails id={parseInt(id)}/>
        // res = <ReplyQuestionPage id={parseInt(id)}/>
    }

    return res;
}

export default function MyQuestionPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}