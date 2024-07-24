import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FetchAllLaunches } from '../Api/ApiCalls'
import { Link } from 'react-router-dom'
import Seo from '../Seo'
import Img from '../components/Img'

export default function AllLaunches() {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState([])
  useEffect(() => {
    async function fetchData() {
      const data = await FetchAllLaunches()
      setData(data)
    }
    fetchData()
  }, [])
  return (
    <React.Fragment>
      <Seo
       description={t('PagesDescriptions.allLaunches')}
       page={t('PagesName.allLaunches')}
      />
       <section className=" container-xxl section-padding">
      <div className="container">
        <h3 className="sup-title mb-3">{t('launches.launchingSoon')}</h3>
        <div className="row gy-4 gx-5">
          {data?.map((item, index) => {
            const itemImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${item?.thumbnail[0].url}`

            return (
              <div className="col-md-4" key={index+1}>
                <Link
                  className="launch-card"
                  to={`/launch-details/${item._id}`}
                >
                  <Img 
                  image={{ src:itemImage , alt:"Launch Image" , width:"100%", height:221}}
                    className="img-fluid rounded-2"
                  />
                </Link>
                <h5 className="mt-2" style={{ fontSize: '20px' }}>
                  {item.launchName[i18n.language]}
                </h5>
              </div>
            )
          })}
        </div>
      </div>
    </section>
    </React.Fragment>
   
  )
}
