import { useEffect } from "react"

const useClickOutside = (refs:React.RefObject<HTMLElement | null>[] , 
    callback:()=>void
) => {
    useEffect(()=> {
        const handleClickOutside = (event: MouseEvent)=> {
            const isOutside = refs.every(
                (ref)=> ref.current && !ref.current.contains(event.target as Node)
            );
            if(isOutside) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [refs, callback])
}

export default useClickOutside