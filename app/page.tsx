'use client';

import MyProfile from "@/components/v2/my-profile";
import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$tgStartParam} from "@/stores/tg-store";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
    const tgStartParam = useStoreClientV2($tgStartParam)
    const router = useRouter()

    useEffect(() => {
        if (tgStartParam !== undefined && !tgStartParam.isLoading && tgStartParam.startParam != null) {
            let decodedUrl = null;
            if (tgStartParam.startParam.startsWith("0:")) {
                const accountId = tgStartParam.startParam.substring(2)
                decodedUrl = `/account?id=${accountId}`
            } else if (tgStartParam.startParam.startsWith("1:")) {
                const qId = tgStartParam.startParam.substring(2)
                decodedUrl = `/my-question?id=${qId}`
            } else if (tgStartParam.startParam.startsWith("2:")) {
                console.log(tgStartParam.startParam)
                const secondDelimeterIdx = tgStartParam.startParam.lastIndexOf(":")
                const qId = tgStartParam.startParam.substring(2, secondDelimeterIdx)
                const accountId = tgStartParam.startParam.substring(secondDelimeterIdx + 1)
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
