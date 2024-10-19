'use client';

import {useSearchParams} from "next/navigation";
import AccountPageComponent from "@/components/account-page"
import CreateQuestionPage from "@/components/submit-question-page";

export default function AccountPage(){
    const searchParams = useSearchParams()
    const id = searchParams.get('id')//router//.query.id
    const isSubmit = searchParams.get('command') === 'submit'

    if (id == null) {
        return <h1>Something wrong</h1>
    }
    if (isSubmit) {
        return <CreateQuestionPage id={id}/>
    }

    return <AccountPageComponent id={id}/>
}