import React from 'react'

export default function QuestionAnswer({textAreaId, textLabel, value, setOnChange}) {
    return (
        <div>
            <label htmlFor={textAreaId}>{textLabel}</label>
            <textarea
                id={textAreaId}
                rows="2"
                value={value || ''}
                onChange={(e)=> setOnChange(e.target.value)}
            >
            </textarea>
        </div>
    )
}
