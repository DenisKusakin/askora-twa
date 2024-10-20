import {Address, fromNano, toNano} from "@ton/core";
import {userFriendlyStr} from "@/components/utils/addr-utils";
import CopyIcon from "@/components/copy-icon";
import CurrencyInput from "react-currency-input-field";
import {useState} from "react";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {updatePriceTransaction} from "@/components/utils/transaction-utils";

export default function AccountInfo({accountPrice, tonAddr, accountAddr, editable}: {
    accountPrice: bigint | null,
    tonAddr: string,
    accountAddr: string | null,
    editable: boolean
}) {
    const [tonConnectUI] = useTonConnectUI();
    const [newPrice, setNewPrice] = useState<number | null>(accountPrice != null ? parseFloat(fromNano(accountPrice)) : null);

    const onSaveClick = () => {
        if(accountAddr == null || newPrice == null) {
            return;
        }
        tonConnectUI.sendTransaction(updatePriceTransaction(Address.parse(accountAddr), toNano(newPrice)))
    }

    return <div className="card bg-base-100 w-full shadow-xl rounded-none">
        <div className="card-body">
            {/*<h2 className="card-title">Account Info</h2>*/}
            {accountPrice === null && <span className="loading loading-dots loading-xs"></span>}
            {/*{accountPrice !== null && <h2 className={"text-xl"}>{parseFloat(fromNano(accountPrice)).toFixed(3)} TON</h2>}*/}
            <div className={"flex flex-row items-center"}>
                {accountPrice !== null && <CurrencyInput
                    defaultValue={fromNano(accountPrice)}
                    className={`input w-1/2 align-middle text-xl input-sm max-w-full pl-0`}
                    readOnly={!editable}
                    decimalScale={3}
                    decimalsLimit={3}
                    suffix={" TON"}
                    allowNegativeValue={false}
                    min={0.0}
                    onValueChange={(value) => {
                        if (value != undefined) {
                            setNewPrice(parseFloat(value))
                        } else {
                            setNewPrice(0)
                        }
                    }}/>}
                {editable && accountPrice != null && parseFloat(fromNano(accountPrice)) !== newPrice &&
                    <button className={"btn ml-1 btn-primary btn-sm"} onClick={onSaveClick}>Save</button>}
            </div>
            {tonAddr !== '' && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>Wallet:</h2>
                <h2 className={"text-primary text-lg"}>{userFriendlyStr(tonAddr)}</h2>
                <div className={"ml-3"} onClick={() => navigator.clipboard.writeText(tonAddr)}><CopyIcon/></div>
            </div>}
            {tonAddr !== '' && <div className={"flex flex-row items-center"}>
                <h2 className={"text-lg mr-1 font-bold"}>Account:</h2>
                {accountAddr != null &&
                    <h2 className={"text-primary text-lg"}>{userFriendlyStr(accountAddr)}</h2>}
                <div className={"ml-3"} onClick={() => navigator.clipboard.writeText(accountAddr || "")}><CopyIcon/></div>
            </div>}
        </div>
    </div>
}