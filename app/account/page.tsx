'use client';

import {useSearchParams} from "next/navigation";
import AccountPageComponent from "@/components/account-page"
import CreateQuestionPage from "@/components/submit-question-page";
import {Suspense} from "react";

function Comp() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')//router//.query.id
    const isSubmit = searchParams.get('command') === 'submit'

    let res = <h1>Something wrong</h1>;

    if (isSubmit && id !== null) {
        res = <CreateQuestionPage id={id}/>
    } else if (id !== null) {
        res = <AccountPageComponent id={id}/>
    }

    return res;
}

export default function AccountPage() {
    return <Suspense>
        <Comp/>
    </Suspense>
}