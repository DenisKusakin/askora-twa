import {createContext} from "react";
import {QuestionData} from "@/stores/questions-store";

export const MyAssignedQuestionsContext = createContext<{
    items: { isLoading: boolean, id: number, data: QuestionData | null }[],
    fetch: (id: number) => void
}>({
    items: [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetch: (id: number) => {}
})