import { useState, useEffect } from "react"

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

export function useLocalStorage<T>(
    key: string, 
    initialValue: T | (() => T)
): [T, SetValue<T>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key)
            if (item !== null) {
                return JSON.parse(item) as T
            } else {

                return typeof initialValue === "function" 
                    ? (initialValue as () => T)()
                    : initialValue
            }
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error)
            return typeof initialValue === "function" 
                ? (initialValue as () => T)()
                : initialValue
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error)
        }
    }, [key, value])

    return [value, setValue]
}
