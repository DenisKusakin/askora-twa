import {Address, OpenedContract} from "@ton/core";
import {Account} from "@/wrappers/Account";
import {useEffect, useState} from "react";
import {QuestionView as QuestionComponent} from "@/components/question-component";
import {getAsignedQuestions, getSubmittedQuestions} from "@/wrappers/wrappers-utils";

type QData = {
    content: string,
    balance: bigint,
    addr: Address,
    isRejected: boolean,
    isClosed: boolean
}

type TabData = {
    title: string,
    data: QData[],
    isLoading: boolean,
    isReady: boolean,
    isActive: boolean,
    fetch: () => Promise<QData[]>
}

export default function AccountQuestions({account}: { account: OpenedContract<Account> }) {
    const [tabs, setTabs] = useState<{
        title: string,
        data: QData[],
        isLoading: boolean,
        isReady: boolean,
        isActive: boolean,
        fetch: () => Promise<QData[]>
    }[]>([
        {
            title: "Assigned",
            isReady: false,
            isLoading: false,
            isActive: true,
            data: [],
            fetch: () => getAsignedQuestions(account)
        },
        {
            title: "Submitted",
            isReady: false,
            isLoading: false,
            isActive: false,
            data: [],
            fetch: () => getSubmittedQuestions(account)
        }
    ])

    function updateTab(idx: number, info: {
        data?: QData[],
        isLoading?: boolean,
        isReady?: boolean,
        isActive?: boolean
    }) {
        setTabs(state => {
            const newTabs = [...state];

            if (newTabs[idx].isLoading != undefined) {
                // @ts-expect-error todo
                newTabs[idx].isLoading = info.isLoading
            }
            if (newTabs[idx].isActive != undefined) {
                // @ts-expect-error todo
                newTabs[idx].isActive = info.isActive
            }
            if (newTabs[idx].isReady != undefined) {
                // @ts-expect-error todo
                newTabs[idx].isReady = info.isReady
            }
            if (newTabs[idx].data != undefined) {
                // @ts-expect-error todo
                newTabs[idx].data = info.data
            }

            return newTabs;
        })
    }

    function setActive(idx: number){
        setTabs(state => {
            const tabs = [...state]
            for(let i = 0; i < tabs.length; i++) {
                tabs[i].isActive = i === idx;
            }

            return tabs
        })
    }

    useEffect(() => {
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i]
            if (tab.isActive && !tab.isLoading && !tab.isReady) {
                updateTab(i, {data: [], isLoading: true, isReady: false, isActive: true})
                tab.fetch().then(data => {
                    updateTab(i, {data, isLoading: false, isReady: true, isActive: true})
                })
            }
        }
    }, [tabs]);

    function Tab({tab}: { tab: TabData }) {
        if (tab.isLoading) {
            return <div><span className="loading loading-dots loading-lg"></span></div>
        }
        return <div>
            {tab.data.map(q => <QuestionComponent key={q.addr.toRawString()} question={q} showButtons={false}/>)}
        </div>
    }

    return <div>
        <div role="tablist" className="tabs tabs-bordered">
            {tabs.map((tab, idx) => <a role={"tab"} key={tab.title}
                                       onClick={() => setActive(idx)}
                                       className={"tab" + (tab.isActive ? " tab-active" : "")}>{tab.title}</a>)}
        </div>
        <div>
            {tabs.filter(tab => tab.isActive).map(tab => <Tab key={tab.title} tab={tab}/>)}
        </div>
    </div>
}