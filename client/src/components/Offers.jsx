import React from 'react'
import Img from './Img'
import { FaChevronLeft } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function SpecialOffers() {
  const { i18n, t } = useTranslation()
  return (
    <section className="container-xxl section-padding">
      <div className="container">
        <Link draggable="false" to='/special-offers' className="rounded-2 offer-height" >
        <Img
          image={{ src: '/offers.jpg', width: '100%', height: '100%' , alt:"offers"}}
          className="position-absolute top-50 start-0 object-fit-cover rounded-2 offer-height"
          style={{  overflow: 'hidden' }}
        />
        <div style={{marginTop:"-0.4rem"}} className="position-relative d-flex align-items-center justify-content-center justify-content-md-between offer-height px-2">
          <div>
              <div className=" d-flex justify-content-start align-items-center gap-3 flex-column flex-md-row">
            <div className=" p-4 rounded-2 special-offer flex__center bg-primary-blue ">
              <div className=" flex__center flex-column">
                <h4 className="special text-white">{t('offers.Special')}</h4>
                <h3 className=" fw-semibold deals text-white">{t('offers.Deals')}</h3>
              </div>
            </div>
            <div className=' d-flex flex-column gap-1 gap-md-2'>
              <h2 className='fs-2  text-white'> {t('offers.LimitedTime')}<span className=' text-primary-blue'> {t('offers.Offers')} </span></h2>
              <h5 className=' text-white' >{t('offers.Reserve')}</h5>
            </div>
         
          </div>
          </div>
        
          <h4 className=' d-none d-md-block'>
            <FaChevronLeft
              size={20}
              color="#fff"
              style={{
                transform: `${i18n.language == 'en' ? 'rotate(180deg)' : ''}`,
              }}
            />
          </h4>
        </div>
      </Link> 
      </div>
     
    </section>
  )
}
