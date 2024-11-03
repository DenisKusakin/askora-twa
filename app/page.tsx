'use client';

import MyProfile from "@/components/v2/my-profile";
import Profile from "@/components/v2/profile";
import {Address} from "@ton/core";
import {useStoreClientV2} from "@/components/hooks/use-store-client";
import {$tgStartParam} from "@/stores/tg-store";

export default function Home() {
    const tgStartParam = useStoreClientV2($tgStartParam)

    if (tgStartParam === undefined || tgStartParam.isLoading) {
        return <div className={"w-full mt-[50%] flex justify-center"}>
            <div className={"loading loading-ring w-[125px] h-[125px]"}></div>
        </div>
    }
    let comp = <MyProfile/>;
    if (tgStartParam.startParam != null) {
        comp = <Profile owner={Address.parse(tgStartParam.startParam)}/>
    }
    return <div>
        <p className={"text text-sm"}>Start: {tgStartParam?.startParam}</p>
        {comp}
    </div>
}
