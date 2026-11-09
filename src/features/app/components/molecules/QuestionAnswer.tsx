import type { QuestionAnswerProps } from "../../types/components.types"
import Label from "../atoms/Label"
import TextArea from "../atoms/TextArea"
import styles from "./css/questionAnswer.module.css"

export default function QuestionAnswer({ textAreaId, textLabel, value, placeholder, error, setOnChange }: QuestionAnswerProps) {
    const idError = `${textAreaId}-error`

    return (
        <div className={styles.campo}>
            <Label forId={textAreaId} classLabel={styles.label} text={textLabel} />
            <TextArea
                textAreaId={textAreaId}
                className={`${styles.textarea} ${error ? styles.conError : ''}`}
                value={value || ''}
                placeholder={placeholder}
                invalido={!!error}
                describedBy={error ? idError : undefined}
                setOnChange={(valor) => setOnChange(valor)}
            />
            {error && <p id={idError} className={styles.error}>{error}</p>}
        </div>
    )
}
