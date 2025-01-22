import React, { Suspense } from 'react'
import { Navigate, useRoutes, useLocation, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Spinner from '../components/Common/Spinner'
import { useTranslation } from 'react-i18next'
import SpecialOffers from '../pages/SpecialOffers'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/Admin/Login'
import CookiesProvider from '../Services/CookiesProvider'
import {
  CreateDeveloper,
  CreateArea,
  CreateCompound,
  CreateType,
  CreateProperty,
  CreateLaunch,
  ShowAllAreas,
  UpdateArea,
  ShowAllCompounds,
  ShowAllDevelopers,
  ShowAllLaunches,
  UpdateCompound,
  UpdateDeveloper,
  UpdateType,
  ShowAllProperties,
  UpdateProperty,
  ShowAllTypes,
  UpdateLaunch,
  SellPropertyRequests,
  AcademyRequests,
  ContactRequests,
  PropertyContactRequests,
  CreateOffer,
  UpdateOffer,
  ShowAllOffers,
} from '../pages/Admin'

import SahelMap from '../pages/SahelMap'
import { useLanguageRoute } from './changeLang'

const Home = React.lazy(() => delay(import('../pages/Home')))
const Developers = React.lazy(() => delay(import('../pages/Developers')))
const Developer = React.lazy(() => delay(import('../pages/Developer')))
const PropertyDetails = React.lazy(() => delay(import('../pages/Property')))
const LaunchDetails = React.lazy(() => delay(import('../pages/LunchDetails')))
const CompoundDetails = React.lazy(() =>
  delay(import('../pages/CompoundDetails'))
)
const AllLaunches = React.lazy(() => delay(import('../pages/AllLaunches')))
const ContactUs = React.lazy(() => delay(import('../pages/ContactUs')))
const AboutUs = React.lazy(() => delay(import('../pages/AboutUs')))
const OurPartners = React.lazy(() => delay(import('../pages/OurPartners')))
const AreaDetails = React.lazy(() => delay(import('../pages/AreaDetails')))
const SearchResults = React.lazy(() => delay(import('../pages/SearchResults')))
const Academy = React.lazy(() => delay(import('../pages/Academy')))
const SellProperty = React.lazy(() => delay(import('../pages/SellProperty')))
const Campaign = React.lazy(() => delay(import('../pages/Campaign')))
const PropertyComparison = React.lazy(() =>
  delay(import('../pages/PropertyComparison'))
)

const ProjectRoutes = () => {
  const isAuthenticated = CookiesProvider.get('cd-token')

  const { i18n } = useTranslation()
  // const location = useLocation()
  // const navigate = useNavigate()
  useLanguageRoute();
  // React.useEffect(() => {
  //   const pathSegments = location.pathname.split('/');
  //   const firstSegment = pathSegments[1];

  //   if (firstSegment === 'admin') {
  //     i18n.changeLanguage('en');
  //     return;
  //   }

  //   if (!['en', 'ar'].includes(firstSegment)) {
  //     navigate(`/${i18n.language}${location.pathname}`, { replace: true });
  //   } else {
  //     i18n.changeLanguage(firstSegment);
  //     const direction = firstSegment === 'ar' ? 'rtl' : 'ltr';
  //     document.documentElement.setAttribute('dir', direction);
  //     document.documentElement.setAttribute('lang', firstSegment);
  //   }
  // }, [location.pathname, i18n, navigate]);

  const element = useRoutes([
    { path: '/en/campaign', element: <Campaign />,index: true }, 
    { path: '/admin/login', element: <Login />,  },
    {
      path: '/:lng',
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'developers', element: <Developers /> },
        { path: 'developer-details/:id', element: <Developer /> },
        { path: 'property-details/:id', element: <PropertyDetails /> },
        { path: 'launch-details/:id', element: <LaunchDetails /> },
        { path: 'compound-details/:id', element: <CompoundDetails /> },
        { path: 'area-details/:id', element: <AreaDetails /> },
        { path: 'all-launches', element: <AllLaunches /> },
        { path: 'contact-us', element: <ContactUs /> },
        { path: 'our-partners', element: <OurPartners /> },
        { path: 'about-us', element: <AboutUs /> },
        { path: 'search-results', element: <SearchResults /> },
        { path: 'academy', element: <Academy /> },
        { path: 'sell-property', element: <SellProperty /> },
        { path: 'compare', element: <PropertyComparison /> },
        { path: 'special-offers', element: <SpecialOffers /> },
        { path: 'sahel-map', element: <SahelMap /> },
      ],
    },
    {
      path: '/admin',
      element: <DashboardLayout isAuthenticated={isAuthenticated} />,
      children: [
        { index: true, element: <CreateArea /> },
        // Area
        { index: true, path: 'create-area', element: <CreateArea /> },
        { path: 'update-area/:id', element: <UpdateArea /> },
        { path: 'show-all-areas', element: <ShowAllAreas /> },
        // Compound
        { path: 'create-compound', element: <CreateCompound /> },
        { path: 'update-compound/:id', element: <UpdateCompound /> },
        { path: 'show-all-compounds', element: <ShowAllCompounds /> },
        //  Developer
        { path: 'create-developer', element: <CreateDeveloper /> },
        { path: 'update-developer/:id', element: <UpdateDeveloper /> },
        { path: 'show-all-developers', element: <ShowAllDevelopers /> },
        //  Types
        { path: 'create-type', element: <CreateType /> },
        { path: 'update-type/:id', element: <UpdateType /> },
        { path: 'show-all-types', element: <ShowAllTypes /> },
        // Properties
        { path: 'create-property', element: <CreateProperty /> },
        { path: 'update-property/:id', element: <UpdateProperty /> },
        { path: 'show-all-properties', element: <ShowAllProperties /> },
        //  Launches
        { path: 'create-launch', element: <CreateLaunch /> },
        { path: 'update-launch/:id', element: <UpdateLaunch /> },
        { path: 'show-all-launches', element: <ShowAllLaunches /> },
        // Requests
        { path: 'academy-requests', element: <AcademyRequests /> },
        { path: 'contact-requests', element: <ContactRequests /> },
        { path: 'sell-requests', element: <SellPropertyRequests /> },
        { path: 'property-requests', element: <PropertyContactRequests /> },
        // Offers
        { path: 'create-offer', element: <CreateOffer /> },
        { path: 'update-offer/:id', element: <UpdateOffer /> },
        { path: 'show-all-offers', element: <ShowAllOffers /> },
      ],
      // children: [],
    },

    { path: '*', element: <Navigate to={`/${i18n.language}`} /> },
  ])

  return <Suspense fallback={<Spinner />}>{element}</Suspense>
}

async function delay(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  }).then(() => promise)
}

export default ProjectRoutes
