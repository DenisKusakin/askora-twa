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
            router.push(`/account?id=${tgStartParam.startParam}`)
        }
    }, [router, tgStartParam]);

    if (tgStartParam === undefined || tgStartParam.isLoading) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    return <MyProfile/>
}
