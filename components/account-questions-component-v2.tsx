import {useState} from "react";
import {QuestionView as QuestionComponent} from "@/components/question-component";
import {Store} from "nanostores";
import {QuestionData} from "@/stores/questions-store";
import {useStoreClient} from "@/components/hooks/use-store-client";

function Tab({tab, showFrom, showTo, showButtons}: {
    tab: Store<{ isLoading: boolean, data: QuestionData[] }>,
    showFrom: boolean,
    showTo: boolean,
    showButtons: boolean
}) {
    const data = useStoreClient(tab)

    if (data === null || data?.isLoading) {
        return <div>
            <span className="loading loading-dots loading-lg"></span>
        </div>
    }

    return <div>
        {data.data.map(q => <QuestionComponent
            key={q.addr.toRawString()}
            question={q}
            showFrom={showFrom}
            showTo={showTo}
            showButtons={showButtons}/>)}
    </div>
}

export default function AccountQuestions({assignedQuestionsStore, submittedQuestionsStore, showButtons}: {
    assignedQuestionsStore: Store<{ isLoading: boolean, data: QuestionData[] }>,
    submittedQuestionsStore: Store<{ isLoading: boolean, data: QuestionData[] }>,
    showButtons: boolean
}) {
    const [tabs, setTabs] = useState([
        {
            title: "Assigned",
            store: assignedQuestionsStore,
            isActive: true,
            showTo: false,
            showFrom: true,
            showActionButtons: showButtons
        },
        {
            title: "Submitted",
            store: submittedQuestionsStore,
            isActive: false,
            showTo: true,
            showFrom: false,
            showActionButtons: false
        }
    ])

    function setActive(idx: number) {
        setTabs(currentState => {
            const newState = [...currentState];
            for (let i = 0; i < newState.length; i++) {
                newState[i].isActive = i === idx
            }

            return newState
        })
    }

    return <div>
        <div role="tablist" className="tabs tabs-bordered">
            {tabs.map((tab, idx) => <a role={"tab"} key={tab.title}
                                       onClick={() => setActive(idx)}
                                       className={"tab" + (tab.isActive ? " tab-active" : "")}>{tab.title}</a>)}
        </div>
        <div>
            {tabs.filter(tab => tab.isActive)
                .map(tab => <Tab key={tab.title}
                                 showButtons={tab.showActionButtons}
                                 showTo={tab.showTo}
                                 showFrom={tab.showFrom}
                                 tab={tab.store}/>)}
        </div>
    </div>
}