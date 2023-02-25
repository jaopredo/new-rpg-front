import { Dispatch, SetStateAction } from 'react'
import { GrFormClose } from 'react-icons/gr'

interface ErrorProps {
    text: String,
    setShowing: Dispatch<SetStateAction<boolean>>
}

export default function Error({ text, setShowing }: ErrorProps) {
    return <div>
        <GrFormClose onClick={() => setShowing(false)}/>
        {text}
    </div>
}