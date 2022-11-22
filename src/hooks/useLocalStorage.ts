import {useState, useEffect} from 'react'
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {

    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage.getItem(key) 
        if(jsonValue != null) return JSON.parse(jsonValue)

        if(typeof initialValue === 'function') {
            return (initialValue as () => T)() // fixes value of T cus it knows type has to be function 

        } else {
            return initialValue;
        }
    })


    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue] as [typeof value, typeof setValue] // will be set as the type of the value an dset value 
}