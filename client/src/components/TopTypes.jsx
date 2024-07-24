import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FetchTopTypes } from '../Api/ApiCalls'
import Title from './Common/Title'
import DataLoader from './Common/DataLoader'
import { Link } from 'react-router-dom'

export default function TopTypes() {
  const { t, i18n } = useTranslation()
  const [topTypes, setTopTypes] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await FetchTopTypes()
   
        setTopTypes(data)
      } catch (error) {
        console.error('Error fetching latest properties:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  const col = [
    {
      colSize: 'col-md-6 col-sm-12',
    },
    {
      colSize: 'col-md-3 col-sm-12',
    },
    {
      colSize: 'col-md-3 col-sm-12',
    },
    {
      colSize: 'col-md-3 col-sm-12',
    },
    {
      colSize: 'col-md-3 col-sm-12',
    },
    {
      colSize: 'col-md-6 col-sm-12',
    },
  ]
  return (
    <section className=" container-xxl section-padding">
      <div className="container">
        <Title title={t('topTypes')} />
      </div>
      <div className="row gx-4 gy-5 ">
        {loading ? (
          <DataLoader />
        ) : (
          topTypes?.map((type, index) => {
            const itemImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${type?.images[0].url}`
            return (
          
              <div
 
              dir={i18n.dir()} key={index} className={col[index].colSize +""+ " position-relative"} >
                  <p className=" mx-4 my-2 position-absolute top-0 z-2 start-0  text-primary-white">
                    {type.name[i18n.language]}
                  </p>
                  <Link
                  to={`/properties-type/${type._id}`}
                  className="main-hover rounded-2 mb-4 position-relative overflow-hidden "
                >
                  <img
                    loading="lazy"
                    width="100%"
                    height="350"

                    className="w-100 object-fit-cover rounded-2 type-image"
                    src={itemImage}
                    style={{ height: '300px' }}
                    alt={type.name[i18n.language]}
                  />
                </Link>
                 
                  <p className=" mx-4 my-2 position-absolute bottom-0 end-0 text-primary-white">
                    {type.propertiesCount||0} {t("property")}
                  </p>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
