import './css/label.modules.css'

interface LabelProps {
  forId: string
  classLabel: string
  text: string
}

export default function Label({ forId, classLabel, text }: LabelProps) {
  return (

    <label htmlFor={forId} className={classLabel}>{text}</label>

  )
}
