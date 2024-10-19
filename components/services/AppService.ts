import {Address, TupleBuilder} from "@ton/core";
import {TonClient} from "@ton/ton";
import {APP_CONTRACT_ADDR} from "@/components/utils/constants";

// export interface Question {
//     getContent(): Promise<string>
//     getId(): bigint
// }

export interface AppService {
    getAccountAddr(ownerAddr: Address): Promise<Address>
    getAccountBalance(ownerAddr: Address): Promise<bigint>
    getQuestionsCount(accountAddr: Address): Promise<bigint>
    getAccountState(ownerAddr: Address): Promise<"active" | "uninitialized" | "frozen">
    getContractState(contractAddr: Address): Promise<"active" | "uninitialized" | "frozen">
    getAccountPrice(ownerAddr: Address): Promise<bigint>
    // getQuestions(ownerAddr: Address): Promise<Question>
}

export class AppServiceImpl implements AppService {
    client: TonClient;

    constructor() {
        this.client = new TonClient({
            endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
            apiKey: "2de325fb6696fff5c78ea8da9bc0abc800f1133a6723c7d0fd953e729f9c9ace"
        });
    }

    getAccountAddr = async (owner: Address) => {
        const builder = new TupleBuilder();
        builder.writeAddress(owner);

        const x = await this.client.runMethod(
            Address.parse(APP_CONTRACT_ADDR),
            'get_account_addr',
            builder.build()
        );
        return x.stack.readAddress();
    }

    getAccountBalance = async (ownerAddr: Address) => {
        const accountAddr: Address = await this.getAccountAddr(ownerAddr)
        return this.client.getBalance(accountAddr)
    }

    getAccountState = async (ownerAddr: Address) => {
        const accountAddr: Address = await this.getAccountAddr(ownerAddr)
        return this.client.getContractState(accountAddr).then(x => x.state)
    }

    getContractState = async (accountAddr: Address) => {
        return this.client.getContractState(accountAddr).then(x => x.state)
    }

    getQuestionsCount = async (accountAddr: Address) => {
        return this.client.runMethod(
            accountAddr,
            'get_next_id'
        ).then(res => {
            return res.stack.readBigNumber()
        })
    }

    getAccountPrice = async (ownerAddr: Address) => {
        const accountAddr: Address = await this.getAccountAddr(ownerAddr)
        return this.client.runMethod(
            accountAddr,
            'get_price'
        ).then(res => {
            return res.stack.readBigNumber()
        })
    }

    // getQuestionById = async (ownerAddr: Address, id: bigint) => {
    //
    // }
    //
    // getQuestions = async (ownerAddr: Address) => {
    //     let count = this.getQuestionsCount(ownerAddr)
    //
    // }
}