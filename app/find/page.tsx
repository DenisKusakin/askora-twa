'use client';

import {useState} from "react";
import {Address} from "@ton/core";
import Link from "next/link";

export default function FindUserPage() {
    const [addr, setAddr] = useState<string>('')
    const isValid = addr.trim() !== '' && Address.isAddress(addr)

    return <div className={"pt-10"}>
        <input className={`input input-ln w-full ${!isValid ? 'input-error' : ''}`}
               value={addr}
               onChange={e => setAddr(e.target.value)}/>
        <Link href={`/account?id=${addr}`} className={"btn btn-primary btn-outline btn-block btn-lg"}>Go</Link>
    </div>
}