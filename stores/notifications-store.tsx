import {atom} from "nanostores";

export const $notification = atom<{ type: 'success' | 'error', msg: string } | null>(null)

export function showSuccessNotification(msg: string) {
    $notification.set({type: 'success', msg})
    setTimeout(() => {
        $notification.set(null)
    }, 2000)
}