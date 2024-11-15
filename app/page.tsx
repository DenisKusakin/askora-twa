'use client';

import MyProfile from "@/components/v2/my-profile";
import {useContext, useEffect} from "react";
import {useRouter} from "next/navigation";
import {MyTgContext} from "@/app/context/tg-context";

export default function Home() {
    const tgStartParam = useContext(MyTgContext).startParam
    const router = useRouter()

    useEffect(() => {
        if (tgStartParam !== undefined && !tgStartParam.isLoading && tgStartParam.startParam != null) {
            let decodedUrl = null;
            if (tgStartParam.startParam.startsWith("0_")) {
                const accountId = tgStartParam.startParam.substring(2)
                decodedUrl = `/account?id=${accountId}`
            } else if (tgStartParam.startParam.startsWith("1_")) {
                const qId = tgStartParam.startParam.substring(2)
                decodedUrl = `/my-question?id=${qId}`
            } else if (tgStartParam.startParam.startsWith("2_")) {
                const secondDelIdx = tgStartParam.startParam.lastIndexOf("_")
                const qId = tgStartParam.startParam.substring(2, secondDelIdx)
                const accountId = tgStartParam.startParam.substring(secondDelIdx + 1)
                decodedUrl = `/q-details?q_id=${qId}&owner_id=${accountId}`
            }
            if(decodedUrl != null) {
                router.push(decodedUrl)
            }
        }
    }, [router, tgStartParam]);
    if (tgStartParam === undefined || tgStartParam.isLoading) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    return <MyProfile/>
}
