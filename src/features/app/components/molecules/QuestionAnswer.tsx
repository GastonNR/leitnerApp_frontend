import type { QuestionAnswerProps } from "../../types/components.types"
import Label from "../atoms/Label"
import TextArea from "../atoms/TextArea"

export default function QuestionAnswer({textAreaId, textLabel, value, setOnChange}: QuestionAnswerProps) {
    return (
        <div>
            <Label forId={textAreaId} classLabel={'answer-question-label'} text={textLabel}/>

            <TextArea textAreaId={textAreaId} value={value || ''} setOnChange={(e)=> setOnChange}/>
            
        </div>
    )
}
