import "./globals.css";
import MyHead from "@/app/head";
import MyAppWrapper from "@/app/my-app-wrapper";
import MyTgContextWrapper from "@/app/MyTgContextWrapper";

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
        <MyTgContextWrapper>
            <head>
                <MyHead/>
            </head>
            <body>
            <MyAppWrapper>{children}</MyAppWrapper>
            </body>
        </MyTgContextWrapper>
        </html>
    )
}
