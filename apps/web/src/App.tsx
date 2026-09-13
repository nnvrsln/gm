import { AudienceSection } from './components/AudienceSection'
import { AuthoritySection } from './components/AuthoritySection'
import { CoachSection } from './components/CoachSection'
import { CourseBackdrop } from './components/CourseBackdrop'
import { FaqSection } from './components/FaqSection'
import { Hero } from './components/Hero'
import { LearningSection } from './components/LearningSection'
import { ProgramSection } from './components/ProgramSection'
import { QuoteSection } from './components/QuoteSection'
import { SiteFooter } from './components/SiteFooter'
import { TariffsSection } from './components/TariffsSection'

export default function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-pitch pb-8">
      <Hero />
      <div className="relative overflow-hidden">
        <AudienceSection />
        <CoachSection />
        <ProgramSection />
        <LearningSection />
        <TariffsSection />
        <AuthoritySection />
        <FaqSection />
        <QuoteSection />
        <CourseBackdrop />
      </div>
      <SiteFooter />
    </main>
  )
}
