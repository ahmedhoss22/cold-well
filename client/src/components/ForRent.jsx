import React from 'react'
import { FetchPropertiesForRent } from '../Api/ApiCalls'
import Slider from 'react-slick'
import Property from './Cards/Property'
import DataLoader from './Common/DataLoader'
import Title from './Common/Title'
import { useTranslation } from 'react-i18next'


export default function ForRent() {
    const {t, i18n} =useTranslation()
  const [properties, setProperties] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const settings = {
    dots: true,
    speed: 500,

    slidesToShow: 3,
    slidesToScroll: 1,
    infinite:false,
    autoplay: false,
    lazyLoad: true,

    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }
  React.useEffect(() => {
    async function fetchData() {
      try {
        const data = await FetchPropertiesForRent()

        setProperties(data)
      } catch (error) {
        console.error('Error fetching latest properties:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <section className="container-xxl section-padding">
      <div className="container">
        <Title title={t('forRent')}/>
        <div className="row gx-4 gy-5">
          {loading ? (
            <DataLoader />
          ) : (
            properties?.length>0 ? (
                 <Slider {...settings}>
              {properties?.map((property, index) => {
                return (
                  <div dir={i18n.dir} key={index} className=" col-md-4 px-1 px-lg-2">
                    <Property item={property} index={index} />
                  </div>
                )
              })}
            </Slider>
            ): (
                <div className=' d-flex justify-content-center align-items-center'>
                    no data to show
                </div>
            )
           
          )}
        </div>
      </div>
    </section>
  )
}
