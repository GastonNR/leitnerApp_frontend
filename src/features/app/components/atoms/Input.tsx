import { ChangeEvent, KeyboardEvent } from "react"

interface InputProps{
    id?: string
    type: string
    className?: string
    placeholder?: string
    value?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>)=> void
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>)=> void
    autoFocus?: boolean
    maxLength?: number
}

export default function Input({id, type, className, placeholder, value, onChange, onKeyDown, autoFocus, maxLength}: InputProps) {
  return (
    <input
        id={id}
        type={type}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        maxLength={maxLength}
    />
  )
}
