export default function copyTextHandler(text: string){
    return () => {
        navigator.clipboard.writeText(text)
        // @ts-expect-error todo
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    }
}