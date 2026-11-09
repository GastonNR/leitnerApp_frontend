import Header from '../components/organisms/Header'
import StudyHero from '../components/organisms/StudyHero'
import Boxes from '../components/organisms/Boxes'
import LeitnerAppLayout from '../components/template/LeitnerAppLayout'
import Calendar from '../components/organisms/Calendar'
import CreateNewCardComponent from '../components/organisms/CreateNewCardComponent'

export default function LeitnerApp () {
  return (
    <LeitnerAppLayout
      header={<Header/>}
      hero={<StudyHero/>}
      boxes={<Boxes/>}
      calendar={<Calendar/>}
      createNewCardComponent={<CreateNewCardComponent/>}
    />
  )
}
