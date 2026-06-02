import type { QuestionAnswerProps } from "../types/components.types"

export default function QuestionAnswer({textAreaId, textLabel, value, setOnChange}: QuestionAnswerProps) {
    return (
        <div>
            <label htmlFor={textAreaId}>{textLabel}</label>
            <textarea
                id={textAreaId}
                //rows="2"
                value={value || ''}
                onChange={(e)=> setOnChange(e.target.value)}
            >
            </textarea>
        </div>
    )
}
