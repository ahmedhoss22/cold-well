import React, { lazy } from 'react'
import Seo from '../Seo'
import { useTranslation } from 'react-i18next'
import SahelMap from '../components/Sahel-Map'
const SpecialOffers = lazy(()=> import('../components/Offers'))
const Hero = lazy(() => import('../components/Hero'))
const HomeLunch = lazy(() => import('../components/HomeLunch'))
const TopCompounds = lazy(() => import('../components/TopCompounds'))
const TopAreas = lazy(() => import('../components/TopAreas'))
const LatestProperties = lazy(() => import('../components/LatestProperties'))
const ContactForm = lazy(() => import('../components/ContactForm'))

export default function Home() {
  const {t} = useTranslation()
  return (
    <React.Fragment>
      <Seo page={t('PagesName.home')} description={t('PagesDescriptions.home')} />
      <Hero />
      <SahelMap/>
      <HomeLunch />
      <TopCompounds />
      <SpecialOffers/>
      <TopAreas />
      <LatestProperties />
      <ContactForm />
    </React.Fragment>
  )
}
