// ComparisonPage.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Img from '../components/Img'
import { formatNumber } from '../assets/common'
import { FetchPropertyToCompare } from '../Api/ApiCalls'

export default function ComparisonPage() {
  const { i18n, t } = useTranslation()
  const [properties, setProperties] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const storedPropertyIds = JSON.parse(
      localStorage.getItem('comparisonProperties')
    )
    console.log(storedPropertyIds);
    if (!storedPropertyIds || storedPropertyIds.length < 2) {
      navigate('/')
    } else {
      const loadProperties = async () => {
        try {
          const data = await FetchPropertyToCompare(storedPropertyIds)

          setProperties(data)
          localStorage.removeItem("comparisonProperties")
        } catch (error) {
          console.log('error to get units data')
        }
      }
      loadProperties()
    }
  }, [navigate])
  const finishingTranslations = {
    'Not Finished': t('propertyDetails.not_finished'),
    'Semi Finished': t('propertyDetails.semi_finished'),
    Finished: t('propertyDetails.finished'),
    Furnished: t('propertyDetails.furnished'),
  }

  function getFirstTwoWords(text, num = 2) {
    const words = text.split(' ')
    return words.slice(0, num).join(' ')
  }

  return (
    <Container className=" my-5" style={{marginTop:"70px"}}>
      <h2 className=" sup-title ">{t('compare.title')}</h2>
      {properties.length === 2 && (
        <div className=" table-responsive">
          <Table striped bordered hover responsive>
            <thead>
              <tr className=" text-center">
                <td></td>
                <td>
                  <Img
                    image={{
                      width: '200',
                      height: '120',
                      src: `${import.meta.env.VITE_IMAGE_ORIGIN}/${properties[0]?.thumbnail[0]?.url}`,
                    }}
                    className=" rounded-2  object-fit-cover"
                  />
                </td>
                <td>
                  <Img
                    image={{
                      width: '200',
                      height: '120',
                      src: `${import.meta.env.VITE_IMAGE_ORIGIN}/${properties[1]?.thumbnail[0]?.url}`,
                    }}
                    className=" rounded-2  object-fit-cover"
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ width: '10%' }}>{t('compare.feature')}</th>
                <th>
                  {getFirstTwoWords(properties[0]?.name[i18n.language], 4)}
                </th>
                <th>
                  {getFirstTwoWords(properties[1]?.name[i18n.language], 4)}
                </th>
              </tr>
              <tr>
                <td>{t('compare.type')}</td>
                <td>{properties[0]?.type[0]?.name[i18n.language]}</td>
                <td>{properties[1]?.type[0]?.name[i18n.language]}</td>
              </tr>

              <tr>
                <td>{t('compare.bedrooms')}</td>
                <td>{properties[0]?.number_of_bedrooms}</td>
                <td>{properties[1]?.number_of_bedrooms}</td>
              </tr>
              <tr>
                <td>{t('compare.bathrooms')}</td>
                <td>{properties[0]?.number_of_bathrooms}</td>
                <td>{properties[1]?.number_of_bathrooms}</td>
              </tr>
              <tr>
                <td>{t('compare.area')}</td>
                <td>
                  {getFirstTwoWords(
                    properties[0]?.area[0].title[i18n.language]
                  )}
                </td>
                <td>
                  {getFirstTwoWords(
                    properties[1]?.area[0].title[i18n.language]
                  )}
                </td>
              </tr>

              <tr>
                <td>{t('compare.deliveryIn')}</td>
                <td>{properties[0]?.delivery_in}</td>
                <td>{properties[1]?.delivery_in}</td>
              </tr>
              <tr>
                <td>{t('compare.address')}</td>
                <td>
                  {getFirstTwoWords(
                    properties[0]?.addressLocality[i18n.language]
                  )}
                </td>
                <td>
                  {getFirstTwoWords(
                    properties[1]?.addressLocality[i18n.language]
                  )}
                </td>
              </tr>
              <tr>
                <td>{t('compare.compound')}</td>
                <td>
                  <Link
                    className="text-decoration-underline"
                    to={`/compound-details/${properties[0]?.compound[0]._id}`}
                  >
                    {getFirstTwoWords(
                      properties[0]?.compound[0].name[i18n.language]
                    )}
                  </Link>
                </td>
                <td>
                  <Link
                    className="text-decoration-underline"
                    to={`/compound-details/${properties[0]?.compound[0]._id}`}
                  >
                    {getFirstTwoWords(
                      properties[1]?.compound[0].name[i18n.language]
                    )}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>{t('compare.developer')}</td>
                <td>
                  <Link
                    className="text-decoration-underline"
                    to={`/developer-details/${properties[0]?.developer[0]._id}`}
                  >
                    {getFirstTwoWords(
                      properties[0]?.developer[0].name[i18n.language]
                    )}
                  </Link>
                </td>
                <td>
                  <Link
                    className=" text-decoration-underline "
                    to={`/developer-details/${properties[0]?.developer[0]._id}`}
                  >
                    {getFirstTwoWords(
                      properties[1]?.developer[0].name[i18n.language]
                    )}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>{t('compare.finishing')}</td>
                <td>{finishingTranslations[properties[0]?.finishing]}</td>
                <td>{finishingTranslations[properties[1]?.finishing]}</td>
              </tr>
              <tr>
                <td>{t('compare.size')}</td>
                <td>{properties[0]?.max_unit_area}</td>
                <td>{properties[1]?.max_unit_area}</td>
              </tr>
              <tr>
                <td>{t('compare.startFrom')}</td>
                <td>{properties[0]?.min_price}</td>
                <td>{properties[1]?.min_price}</td>
              </tr>
              <tr>
                <td>{t('compare.downPayment')}</td>
                <td>
                  {formatNumber(properties[0]?.paymentPlans[0].downPayment)}
                </td>
                <td>
                  {formatNumber(properties[1]?.paymentPlans[0].downPayment)}
                </td>
              </tr>
              <tr>
                <td>{t('compare.monthly')}</td>
                <td>{formatNumber(properties[0]?.paymentPlans[0].monthly)}</td>
                <td>{formatNumber(properties[1]?.paymentPlans[0].monthly)}</td>
              </tr>
              <tr>
                <td>{t('compare.years')}</td>
                <td>{formatNumber(properties[0]?.paymentPlans[0].duration)}</td>
                <td>{formatNumber(properties[1]?.paymentPlans[0].duration)}</td>
              </tr>
              <tr className=" text-center">
                <td></td>
                <td>
                  <Link
                    className=" text-decoration-underline "
                    to={`/property-details/${properties[0]?._id}`}
                  >
                    {t('compare.moreDetails')}
                  </Link>
                </td>
                <td>
                  <Link
                    className=" text-decoration-underline "
                    to={`/property-details/${properties[1]?._id}`}
                  >
                    {t('compare.moreDetails')}
                  </Link>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  )
}
