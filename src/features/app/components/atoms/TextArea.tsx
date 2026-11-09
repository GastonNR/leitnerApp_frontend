import { ChangeEvent } from "react"

interface TextAreaProps{
    textAreaId: string
    value: string
    className?: string
    placeholder?: string
    invalido?: boolean
    describedBy?: string
    setOnChange: (valor: string) => void
}

export default function TextArea({ textAreaId, value, className, placeholder, invalido, describedBy, setOnChange }: TextAreaProps) {
  return (
    <textarea
        id={textAreaId}
        name={textAreaId}
        className={className}
        value={value || ''}
        placeholder={placeholder}
        aria-invalid={invalido}
        aria-describedby={describedBy}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setOnChange(e.target.value)}
    />
  )
}
