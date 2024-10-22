import {Account} from "@/wrappers/Account";
import {Address, beginCell, SenderArguments, storeStateInit, toNano} from "@ton/core";
import {SERVICE_OWNER_ADDR} from "@/components/utils/constants";
import {ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE} from "@/wrappers/contracts-codes";
import {tonClient} from "@/wrappers/ton-client";
import {useStoreClient} from "@/components/hooks/use-store-client";
import {$myProfile} from "@/stores/profile-store";
import {tonConnectUI} from "@/stores/ton-connect";

export default function CreateAccount() {
    const tonAddr = useStoreClient($myProfile)?.address?.toString() || ''

    const realSender = {
        address: tonAddr === '' ? undefined : Address.parse(tonAddr),
        async send(args: SenderArguments): Promise<void> {
            console.log(args)
            const builder = beginCell();
            if (args.init != null) {
                storeStateInit(args.init)(builder)
            }
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec,
                messages: [{
                    address: args.to.toRawString(),
                    amount: args.value.toString(),
                    payload: args.body?.toBoc().toString('base64'),
                    stateInit: args.init != null ? builder.endCell().toBoc().toString('base64') : beginCell().endCell().toString('base64')
                }]
            }

            await tonConnectUI?.sendTransaction(transaction)
        }
    }

    const onClick = () => {
        const account = Account.createFromConfig({
            owner: Address.parse(tonAddr),
            serviceOwner: Address.parse(SERVICE_OWNER_ADDR)
        }, ACCOUNT_CODE, QUESTION_CODE, QUESTION_REF_CODE)

        tonClient.open(account)
            .sendDeploy(realSender, toNano(0.05), {
                minPrice: toNano(0),
                questionCode: QUESTION_CODE,
                questionRefCode: QUESTION_REF_CODE
            })
    }

    return <button className="w-full btn btn-primary" onClick={onClick}>
        Create Account
    </button>
}