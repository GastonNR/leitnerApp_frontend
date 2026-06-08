import { ChangeEvent, Dispatch, SetStateAction } from "react"
import './css/textArea.modules.css'

interface TextAreaProps{
    textAreaId: string
    value: string
    setOnChange: Dispatch<SetStateAction<string>>
}

export default function TextArea({textAreaId, value, setOnChange}: TextAreaProps) {
  return (
    <textarea
        id={textAreaId}
        value={value || ''}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>)=> setOnChange(e.target.value)}
    >
    </textarea>
  )
}
