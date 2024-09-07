import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SearchProperties } from '../Api/ApiCalls'
import { useTranslation } from 'react-i18next'
import Property from '../components/Cards/Property'

export default function SearchResults() {
  const location = useLocation()
  // const { searchParams } = location.state || {}
  // console.log(searchParams)
  const [properties, setProperties] = useState([])
  const { t, i18n } = useTranslation()
  const queryParams = new URLSearchParams(location.search)

  const compound = queryParams.get('compound')
  const type = queryParams.get('type')
  const beds = queryParams.get('beds')
  const price = queryParams.get('price')
  const searchParams = { compound, type, price, beds }
  useEffect(() => {
    const fetchResults = async () => {
      if (searchParams) {
        const results = await SearchProperties(searchParams)

        setProperties(results)
      }
    }
    fetchResults()
  }, [searchParams])

  // if (!searchParams) {
  //   return <div>{t('Search.noSearchParams')}</div>
  // }
  return (
    <div className="container-xxl py-5">
      <section className=" container">
        <div className=" d-flex justify-content-start align-items-end gap-2 mb-4">
          <h2 className="sup-title">Properties</h2>
          <small>
            {' '}
            {properties?.length} {t('offers.results')}
          </small>
        </div>
        <div className="row">
          {properties?.map((item, index) => (
            <div className="col-md-4" key={`property-${index + 1}`}>
              <Property item={item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
