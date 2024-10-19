import {fromNano} from "@ton/core";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import CopyIcon from "@/components/copy-icon";

export default function AccountInfo({accountPrice, tonAddr, accountAddr}: {
    accountPrice: bigint,
    tonAddr: string,
    accountAddr: string
}) {
    return <div className="card bg-base-100 w-full shadow-xl rounded-none">
        <div className="card-body">
            <h2 className="card-title">Account Info</h2>
            {accountPrice === null && <span className="loading loading-dots loading-xs"></span>}
            {accountPrice !== null && <h2>Price: {fromNano(accountPrice)} TON</h2>}
            {tonAddr !== '' && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>Wallet:</h2>
                <h2 className={"text-primary text-lg"}>{userFriendlyStr(tonAddr)}</h2>
                <div className={"ml-3"}><CopyIcon/></div>
            </div>}
            {tonAddr !== '' && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>Account:</h2>
                {accountAddr != null &&
                    <h2 className={"text-primary text-lg"}>{userFriendlyStr(accountAddr)}</h2>}
                <div className={"ml-3"}><CopyIcon/></div>
            </div>}
        </div>
    </div>
}