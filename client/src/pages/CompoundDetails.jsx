import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { FetchCompound } from '../Api/ApiCalls'
import Gallery from '../components/Common/Gallery'

import { Whatsapp, ContactUs } from '../components/Common/Buttons'
import { formatNumber, getFirstTwoWords } from '../assets/common'
import { MapPin } from 'lucide-react'
import Form from '../components/Common/Form'
import MapComponent from '../components/Map/MapContainer'
import Carousel from '../components/Common/Carousel'
import Property from '../components/Cards/Property'
import Img from '../components/Img'
import Description from '../components/Common/Description'
import Seo from '../Seo'

export default function CompoundDetails() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [compound, setCompound] = useState(null)
  const [details, setDetails] = useState([])
  const [recommendations, setRecommendations] = useState()
  const fetchData =async()=>{
     const data = await FetchCompound(id)
   
      setCompound(data.compound)
      setDetails(data.compoundPropertiesInfo)
      setRecommendations(data.recommendations)
  }
  useEffect(() => {
    fetchData()
  }, [id])
  const developerImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${compound?.developer[0]?.images[0]?.url}`
  const compoundDescription = compound?.description[i18n.language]
  const locations = details[0]?.allPropertyLocations

  return (
    <React.Fragment>
      <Seo
      page={t('PagesName.compoundDetails')}
      description={t('PagesDescriptions.compound')}
      />
      <Gallery property={compound} />
      <section className=" container-xxl section-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12 d-flex flex-column justify-content-center flex-md-row mx-auto">
              <div className="col-md-1 d-flex justify-content-md-center align-items-center ">
                <Link to={`developer-details/${compound?.developer[0]?._id}`}>
                  <Img
                    image={{
                      src: developerImage,
                      width: 90,
                      height: 90,
                      alt: 'developer logo',
                    }}
                    className=" object-fit-cover rounded-circle border shadow"
                  />
                </Link>
              </div>
              <div
                className="col-md-10 d-flex flex-column "
              >
                <div className=" col-md-12 d-flex flex-column ">
                  <div className=" d-flex flex-column flex-md-row">
                    <h1 className="sup-title mb-0 col-md-10">
                      {compound?.name[i18n.language]}
                    </h1>
                  </div>

                  <div className=" d-flex gap-1 justify-content-start">
                    <MapPin size={16} />
                    <p className="">
                      {compound?.area[0].title[i18n.language]},{' '}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between flex-column flex-md-row">
                    <div>
                      <p style={{ fontSize: '12px' }} className="mb-0">
                        {' '}
                        {t('propertyDetails.pricesStartFrom')}
                      </p>
                      <span className=" d-flex justify-content-start gap-0 gap-md-2 flex-column flex-md-row">
                        <h3 className=' sup-title mb-0'>
                          {formatNumber(
                            details[0]?.minPriceProperty?.min_price
                          )}{' '}
                          {t('egp')}
                        </h3>
                        <span className="d-flex justify-content-start align-items-start gap-1 flex-column flex-md-row align-items-md-center">
                          <p style={{ fontSize: '12px' }} className=" mb-0">
                            {t('propertyDetails.maxPrice')}:
                          </p>{' '}
                          <h3 className=' sup-title mb-0'>
                            {formatNumber(
                              details[0]?.maxPriceProperty?.max_price
                            )}{' '}
                            {t('egp')}
                          </h3>
                        </span>
                      </span>
                    </div>
                    <div className=" mt-2 d-flex justify-content-start flex-wrap align-items-center justify-content-md-end gap-2">
                      <ContactUs number={compound?.contactUsNumber} />
                      <Whatsapp
                        number={compound?.contactUsNumber}
                        itemName={compound?.name[i18n.language]}
                        developerName={
                          compound?.developer[0]?.name[i18n.language]
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-xxl section-padding position-relative">
        <div className="container">
          <div className="row gy-4 gx-5">
            <div className="col-md-9">
              <div className="row mb-4">
                <Description
                title={compound?.name[i18n.language]}
                description={compoundDescription}
                />
              
              </div>
              <div className="row">
                <h2 className="sup-title">{t('propertiesLocations')}</h2>
                <div className="map-container">
                  {locations?.length > 0 && (
                    <MapComponent
                      locations={locations}
                      width="100%"
                      height="100%"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-3" style={{ position: 'relative' }}>
              <div className="row">
                <div
                  className="position-sticky card-style"
                  style={{ top: '100px' }}
                >
                  <Form />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {recommendations?.length > 0 && (
        <section className="container-xxl section-padding">
          <div className="container">
            <h2 className=" sup-title">
              {t('titles.exploreUnits')}  {getFirstTwoWords(compound?.name[i18n.language])}
            </h2>
            <Carousel
              sm={1.1}
              md={2.2}
              lg={3.2}
              items={recommendations?.map((item) => item)}
              Component={Property}
            />
          </div>
        </section>
      )}
    </React.Fragment>
  )
}
