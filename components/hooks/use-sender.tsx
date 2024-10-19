import {useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {Address, beginCell, SenderArguments, storeStateInit} from "@ton/core";

export default function useTonSender() {
    const [tonConnectUI] = useTonConnectUI()
    const tonAddr = useTonAddress()

    const realSender = {
        address: tonAddr !== '' ? Address.parse(tonAddr) : undefined,
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
                    stateInit: args.init != null ? builder.endCell().toBoc().toString('base64') : null
                }]
            }

            //@ts-expect-error todo
            await tonConnectUI.sendTransaction(transaction)
        }
    }

    return realSender;
}