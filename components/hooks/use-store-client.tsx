import {useStore} from "@nanostores/react";
import {useEffect, useState} from "react";
import {Store} from "nanostores";

export function useStoreClient<T>($store: Store<T>) {
    const [data, setData] = useState<T | null>(null);
    const store = useStore($store)
    useEffect(() => {
        setData(store)
    }, [store])

    return data;
}