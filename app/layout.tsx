import "./globals.css";
import MyHead from "@/app/head";
import Notification from "@/components/v2/notification";

export const metadata = {
    title: 'Askora',
    description: 'Open Q&N platform. Reply to questions from your audience and get reward in TON',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={"bg-base-100 p-4"}>
        <head>
            <MyHead/>
        </head>
        <body>
        {children}
        <Notification/>
        </body>
        </html>
    )
}
