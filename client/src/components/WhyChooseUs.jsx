import React from 'react'
import Title from './Common/Title'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function WhyChooseUs() {
  const { t } = useTranslation()
  return (
    <section className="container-xxl section-padding">
      <div className="container">
        <Title title={t('whyChooseUs')} />
        <div className="row gx-4 gy-5">
          <div
            className="col-md-4"
           
          >
            <div className="d-flex flex-column gap-1 rounded-2 hover mx-2 px-3 py-4 ">
              <div>
                <img src="/resale.png" alt="resale" width="90" height="90" />
              </div>
              <h6 className=" fs-4"> {t('resale')} </h6>
              <p>{t('sellYourHomeText')}</p>
              <Link to="/about-us#sellHome">{t('readMore')}</Link>
            </div>
          </div>

          <div
            className="col-md-4"
          
          >
            <div className="d-flex flex-column gap-1 rounded-2 hover mx-2 px-3 py-4 ">
              <div>
                <img
                  src="/findHome.png"
                  alt="findHome"
                  width="90"
                  height="90"
                />
              </div>
              <h6 className=" fs-4"> {t('findHome')} </h6>
              <p>{t('findHomeText')}</p>
              <Link to="/about-us#sellHome">{t('readMore')}</Link>
            </div>
          </div>
          <div
            className="col-md-4"
       
          >
            <div className="d-flex flex-column gap-1 rounded-2 hover mx-2 px-3 py-4 ">
              <div>
                <img
                  src="/CommercialServices.png"
                  alt="CommercialServices"
                  width="90"
                  height="90"
                />
              </div>
              <h6 className=" fs-4"> {t('commercialServices')} </h6>
              <p>{t('commercialServicesText')}</p>
              <Link to="/about-us#sellHome">{t('readMore')}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
