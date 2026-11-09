import React from 'react'
import LandingLayout from '../layouts/LandingLayout'
import HeroSection from '../components/HeroSection'
import MethodSection from '../components/MethodSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorksSection from '../components/HowItWorksSection'
import CTASection from '../components/CTASection'

export default function LandingPage() {
  return (
    <LandingLayout>
      <HeroSection />
      <MethodSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </LandingLayout>
  )
}
