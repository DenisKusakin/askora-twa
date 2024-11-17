'use client';

import {useState} from "react";
import {Address} from "@ton/core";
import Link from "next/link";

export default function FindUserPage() {
    const [addr, setAddr] = useState<string>('')
    const isValid = addr.trim() !== '' && (Address.isFriendly(addr.trim()) || Address.isRaw(addr.trim()))

    return <div className={"pt-10"}>
        <p className={"text text-base font-light"}>Search user by TON wallet address</p>
        <input className={`input input-ln mt-4 w-full ${!isValid ? 'input-error' : ''}`}
               value={addr}
               onChange={e => setAddr(e.target.value)}/>
        {isValid && <Link href={`/account?id=${addr}`}
                          className={"btn mt-5 btn-primary btn-outline btn-block btn-lg"}>Go</Link>}
        {!isValid &&
            <button disabled={true} className={"btn mt-5 btn-primary btn-outline btn-block btn-lg"}>Go</button>}
        <Link href="/" className={"btn btn-lg btn-error btn-block btn-outline mt-2"}>Back</Link>
    </div>
}