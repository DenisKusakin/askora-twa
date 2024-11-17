import {ReactNode, useCallback, useEffect, useState} from "react";
import {useMyConnectedWallet} from "@/hooks/ton-hooks";
import {OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {tonClient} from "@/wrappers/ton-client";
import {Root} from "@/wrappers/Root";
import {APP_CONTRACT_ADDR} from "@/conf";
import {AccountInfo, MyAccountContext, MyAccountInfoContext} from "@/context/my-account-context";

export default function MyAccountContextProvider({children}: { children: ReactNode }) {
    const myConnectedWallet = useMyConnectedWallet()//useTonAddress()//useStoreClientV2($myConnectedWallet)
    const [myAccount, setMyAccount] = useState<undefined | null | OpenedContract<Account>>(undefined)

    useEffect(() => {
        if (myConnectedWallet === undefined) {
            setMyAccount(undefined)
        } else if (myConnectedWallet === null) {
            setMyAccount(undefined)
        } else {
            const rootContract = tonClient.open(Root.createFromAddress(APP_CONTRACT_ADDR))
            rootContract.getAccount(myConnectedWallet)
                .then(acc => setMyAccount(acc))
        }
    }, [myConnectedWallet]);
    const [myAccountInfo, setMyAccountInfo] = useState<undefined | null | AccountInfo>(undefined)
    const refresh = useCallback(() => {
        if (myAccount === undefined) {
            setMyAccountInfo(undefined)
        } else if (myAccount === null) {
            setMyAccountInfo(null)
        } else {
            const accountContract = myAccount
            tonClient.getContractState(myAccount.address).then(async ({state}) => {
                if (state === 'active') {
                    const data = await accountContract.getAllData();
                    setMyAccountInfo({
                        price: data.minPrice,
                        description: data.description,
                        assignedCount: data.assignedQuestionsCount,
                        submittedCount: data.submittedQuestionsCount,
                        status: 'active',
                        address: accountContract.address
                    });
                } else {
                    setMyAccountInfo(null);
                }
            })
        }
    }, [myAccount])
    useEffect(refresh, [myAccount, refresh]);

    return <MyAccountInfoContext.Provider
        value={{info: myAccountInfo, refresh}}>
        <MyAccountContext.Provider value={myAccount}>
            {children}
        </MyAccountContext.Provider>
    </MyAccountInfoContext.Provider>
}