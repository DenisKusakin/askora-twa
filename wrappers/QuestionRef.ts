import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider } from '@ton/core';
import { Question, QuestionConfig, questionConfigToCell } from './Question';

export type QuestionRefConfig = {
    accountAddr: Address,
    id: number
}

function questionRefConfigToCell(config: QuestionRefConfig, code: Cell): Cell{
    return beginCell()
        .storeAddress(config.accountAddr)
        .storeUint(config.id, 32)
        .storeRef(code)
        .endCell()
}

export class QuestionRef implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new QuestionRef(address);
    }

    static createFromConfig(config: QuestionConfig, code: Cell, workchain = 0) {
        const data = questionRefConfigToCell(config, code);
        const init = { code, data };
        return new QuestionRef(contractAddress(workchain, init), init);
    }

    async getQuestionAddress(provider: ContractProvider) {
        let res = (await provider.get('get_question_addr', [])).stack
        return res.readAddress();
    }

    async getQuestion(provider: ContractProvider) {
        let addr = await this.getQuestionAddress(provider);

        return provider.open(Question.createFromAddress(addr));
    }
}