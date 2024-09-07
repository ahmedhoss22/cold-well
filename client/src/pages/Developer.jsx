import React, { useEffect, useState } from 'react'
import { FetchDeveloper } from '../Api/ApiCalls'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ShareDropdown from '../components/Common/Share'
import { formatNumber } from '../assets/common'
import { FaPhoneAlt } from 'react-icons/fa'
import Compound from '../components/Cards/Compound'
import Property from '../components/Cards/Property'
import Form from '../components/Common/Form'
import DetailsLayout from '../layouts/DetailsLayout'
import Description from '../components/Common/Description'
import Img from '../components/Img'
import Seo from '../Seo'

export default function Developer() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [developer, setDeveloper] = useState()
  const [compounds, setCompounds] = useState()
  const [properties, setProperties] = useState()
  const [pricesStartFrom, setPricesStartFrom] = useState()
  useEffect(() => {
    async function fetchData() {
      const data = await FetchDeveloper(id)
      setDeveloper(data.developer)
      setCompounds(data.compounds)
      setProperties(data.properties)
      setPricesStartFrom(data.pricesStartFrom[0].min_price)
    }
    fetchData()
  }, [id])

  const developerImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${developer?.images[0].url}`
  const developerName = developer?.name[i18n.language]
  const availableProperties = developer?.properties.length
  const developerDescription = developer?.description[i18n.language]
  return (
    <React.Fragment>
      <Seo
        page={t('PagesName.developer')}
        description={t('PagesDescriptions.developer')}
      />
      <div className=" container-xxl mt-5">
        <section className="container pt-5">
          <div className="row " style={{ top: '100px' }}>
            <div className="col-md-2 mb-2 d-flex justify-content-md-end align-items-center">
              <Link to={`developer-details/${developer?._id}`}>
                <Img
                  image={{
                    src: developerImage,
                    width: 100,
                    height: 100,
                    alt: 'developer logo',
                  }}
                  className="object-fit-cover rounded-circle border shadow"
                />
              </Link>
            </div>
            <div className="col-md-10">
              <h1 className="sup-title mb-0">{developerName}</h1>
              <p style={{ fontWeight: '600' }} className=" mb-1">
                {availableProperties} {t('developers.propertiesAvailable')}{' '}
              </p>
              <p className=" mb-0">{t('developers.priceStartFrom')} </p>
              <h2 className="sup-title">
                {formatNumber(pricesStartFrom)} {t('egp')}
              </h2>
            </div>
          </div>
        </section>
        <section className=" container">
          <DetailsLayout>
            <Description
              title={developerName}
              description={developerDescription}
            />
          </DetailsLayout>
        </section>
        <section className="container mt-2">
          <h3 className="sup-title">
            {t('titles.exploreUnits')} {developerName}
          </h3>
          <div className="row gx-4 gy-5">
            {properties?.map((property, index) => {
              return (
                <div key={index + 1} className=" col-md-4 px-1 px-lg-2">
                  <Property item={property} index={index} />
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </React.Fragment>
  )
}
