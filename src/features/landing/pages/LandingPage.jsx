import React from 'react'
import LandingLayout from '../layouts/LandingLayout'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import CTASection from '../components/CTASection'
import '../css/global.css'

export default function LandingPage() {
  return (
    <LandingLayout>
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
    </LandingLayout>
  )
}
