import {atom} from "nanostores";

export const $tgStartParam = atom<{ startParam: string | null, isLoading: boolean }>({
    startParam: null,
    isLoading: true
})