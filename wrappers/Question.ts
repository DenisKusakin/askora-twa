import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, TupleBuilder } from '@ton/core';

export type QuestionConfig = {
    accountAddr: Address,
    id: number
}

export function questionConfigToCell(config: QuestionConfig): Cell {
    return beginCell()
        .storeAddress(config.accountAddr)
        .storeUint(config.id, 32)
        .endCell();
}

export class Question implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address){
        return new Question(address);
    }

    static createFromConfig(config: QuestionConfig, code: Cell, workchain = 0) {
        const data = questionConfigToCell(config);
        const init = { code, data };
        return new Question(contractAddress(workchain, init), init);
    }

    async getIsClosed(provider: ContractProvider){
        let getRes = (await provider.get('get_is_closed', [])).stack;
        return getRes.readBoolean();
    }

    async getIsRejected(provider: ContractProvider){
        let getRes = (await provider.get('get_is_rejected', [])).stack;
        return getRes.readBoolean();
    }

    async getContent(provider: ContractProvider){
        let tb = new TupleBuilder();
        let getRes = (await provider.get('get_content', tb.build())).stack;
        return getRes.readString();
    }

    async getReplyContent(provider: ContractProvider){
        let tb = new TupleBuilder();
        let getRes = (await provider.get('get_reply_content', tb.build())).stack;
        return getRes.readString();
    }

    async getSubmitterAddr(provider: ContractProvider) {
        let getRes = (await provider.get('get_submitter_addr', [])).stack;
        return getRes.readAddress();
    }

    async getOwnerAddr(provider: ContractProvider) {
        let getRes = (await provider.get('get_owner_addr', [])).stack;
        return getRes.readAddress();
    }

    async getAllData(provider: ContractProvider){
        let getRes = (await provider.get('get_all_data', [])).stack;
        let rootCell = getRes.readCell().beginParse();

        let c1 = rootCell.loadRef().beginParse();
        let id = c1.loadUint(32);
        let isClosed = c1.loadBoolean();
        let isRejected = c1.loadBoolean();
        let createdAt = c1.loadUint(32);
        let balance = (await provider.getState()).balance

        let c2 = rootCell.loadRef().beginParse();
        let content = c2.loadRef().beginParse().loadStringTail();
        let replyContent = c2.loadRef().beginParse().loadStringTail();

        let c3 = rootCell.loadRef().beginParse();
        let submitterAddr = c3.loadAddress();
        let accountAddr = c3.loadAddress();

        return {
            id, isClosed, isRejected,
            content, replyContent, submitterAddr,
            accountAddr, balance, createdAt
        }
    }
}