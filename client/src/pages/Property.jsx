import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FetchProperty } from '../Api/ApiCalls'
import { useTranslation } from 'react-i18next'
import Gallery from '../components/Common/Gallery'
import Form from '../components/Common/Form'
import MapComponent from '../components/Map/MapContainer'
import Spinner from '../components/Common/Spinner'
import PropertyHeaderDetails from '../components/Property/HeaderInfo'
import { Table } from 'react-bootstrap'
import Seo from '../Seo'
export default function PropertyDetails() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await FetchProperty(id)
        setProperty(data)
        setLocation([
          {
            lng: data?.location?.lng,
            lat: data?.location?.lat,
            name: data?.name[i18n.language],
          },
        ])
      } catch (error) {
        console.error('Error fetching property:', error)
      }
    }
    fetchData()
  }, [i18n.language, id])

  if (!property) {
    return <Spinner />
  }

  let developerImage = ''
  if (property?.developer[0]) {
    developerImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${property.developer[0].images[0]?.url}`
  }

  const propertyDescription = property?.description[i18n.language]
  const finishingTranslations = {
    'Not Finished': t('propertyDetails.not_finished'),
    'Semi Finished': t('propertyDetails.semi_finished'),
    Finished: t('propertyDetails.finished'),
    Furnished: t('propertyDetails.furnished'),
  }
  const translatedFinishing = finishingTranslations[property?.finishing]
  function getFirstTwoWords(text) {
    const words = text.split(' ')
    return words.slice(0, 2).join(' ')
  }
  // const
  return (
    <>
    <Seo page={t('PagesName.property')} description={propertyDescription} />
      <Gallery property={property} />
      <section className="container-xxl section-padding">
        <div className="container">
          <PropertyHeaderDetails
            t={t}
            i18n={i18n}
            property={property}
            developerImage={developerImage}
          />
        </div>
      </section>
      <section className="container-xxl section-padding">
        <div className="container">
          <div className="row gy-4 gx-5">
            <div className="col-md-9">
              <Table striped bordered hover responsive>
                <tbody>
                  <DetailRow
                    label={t('propertyDetails.propertyType')}
                    value={property?.type[0].name[i18n.language]}
                  />
                  <DetailRow
                    label={t('propertyDetails.referenceNo')}
                    value={property?.reference_No}
                  />
                  <DetailRow
                    label={t('propertyDetails.bedrooms')}
                    value={property?.number_of_bedrooms}
                  />
                  <DetailRow
                    label={t('propertyDetails.bathrooms')}
                    value={property?.number_of_bathrooms}
                  />
                  <DetailRow
                    label={t('propertyDetails.unitArea')}
                    value={`${property?.max_unit_area} ${t('propertyDetails.sizeUnit')}`}
                  />
                  <DetailRow
                    label={t('propertyDetails.deliveryIn')}
                    value={property?.delivery_in}
                  />
                  <DetailRow
                    label={t('propertyDetails.compound')}
                    value={
                      <Link
                        to={`/compound-details/${property?.compound[0]._id}`}
                      >
                        <span className="text-decoration-underline">
                          {getFirstTwoWords(
                            property?.compound[0].name[i18n.language]
                          )}
                        </span>
                      </Link>
                    }
                  />
                  <DetailRow
                    label={t('propertyDetails.saleType')}
                    value={property?.sale_type}
                  />
                  <DetailRow
                    label={t('propertyDetails.finishing')}
                    value={translatedFinishing}
                  />
                </tbody>
              </Table>

              <h3 className="sup-title mt-3">
                {t('propertyDetails.paymentPlans')}{' '}
              </h3>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Monthly Payment</th>
                    <th>Down Payment</th>
                    <th>Duration (years)</th>
                  </tr>
                </thead>
                <tbody>
                  {property?.paymentPlans?.map((plan, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{plan.monthly}</td>
                      <td>{plan.downPayment}</td>
                      <td>{plan.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className=" row my-3">
                <h2 className="sup-title">
                  {t('propertyDetails.about')} {property?.name[i18n.language]}
                </h2>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: propertyDescription }}
                />
              </div>
              <div className="row my-3">
                <h2 className="sup-title">{t('launches.viewMap')}</h2>
                <div className="map-container">
                  <MapComponent
                    locations={location}
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className=" card-style p-2 position-sticky"
                style={{ top: '160px' }}
              >
                <Form />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
const DetailRow = ({ label, value }) => (
  <tr>
    <td className=" fw-semibold fs-6">{label}</td>
    <td>{value}</td>
  </tr>
)
