// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-nocheck
// import {QuestionData} from "@/stores/questions-store";
// import {Address} from "@ton/core";
// import {useState} from "react";
// import {rejectQuestion, replyToQuestion} from "@/stores/transactions";
// import {useStoreClientV2} from "@/components/hooks/use-store-client";
// import {$myConnectedWallet, $tgInitData} from "@/stores/profile-store";
//
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export default function QuestionDetails({question}: { question: QuestionData }) {
//     const myConnectedWallet = useStoreClientV2($myConnectedWallet)
//     const [replyShown, setReplyShown] = useState(false)
//     const [myReply, setMyReply] = useState<string>('')
//     const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false)
//     const tgInitData = useStoreClientV2($tgInitData)
//
//     let additional_class = ""
//     if (question.isRejected) {
//         additional_class = "text-error"
//     } else if (question.isClosed) {
//         additional_class = "text-success"
//     }
//     const isMyQuestion = myConnectedWallet?.toRawString() === question.to.toRawString()
//
//     function isYou(addr: Address) {
//         return myConnectedWallet != null && addr.equals(myConnectedWallet)
//     }
//
//     const onRejectClick = () => {
//         rejectQuestion(question.addr)
//             .then(() => setSuccessDialogVisible(true))
//     }
//     const onReplyClick = () => {
//         replyToQuestion(question.addr, myReply)
//             .then(() => setSuccessDialogVisible(true))
//     }
//
//     const dialogContent = <button className={"btn btn-block btn-primary"}
//                                   onClick={() => {
//                                       setSuccessDialogVisible(false);
//                                       setReplyShown(false);
//                                   }}>Close</button>
//
//     const isInTelegram = !(tgInitData === null || tgInitData === '')
//
//     return <div className={"pt-10 w-full"}>
//         <div className={"text min-w-full mt-20"}>
//             <div className={"flex flex-col"}>
//                 <div className={"text-xs border-2 text-center break-all"}>{question.from.toString()}</div>
//                 <div className={"text-lg text-center mt-2"}>
//                     {question.content} Еще одно пробное сообщениеЕще одно пробное сообщениеЕще одно пробное сообщениеЕще одно пробное сообщениеЕще одно пробное сообщение
//                 </div>
//             </div>
//         </div>
//     </div>
// }