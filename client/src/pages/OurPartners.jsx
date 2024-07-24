import React from 'react'
import Img from '../components/Img'
import Seo from '../Seo'
import { useTranslation } from 'react-i18next'

export default function OurPartners() {
  const { t } = useTranslation()
  const images = [
    '/partners/image1.png',
    '/partners/image2.png',
    '/partners/image3.png',
    '/partners/image4.png',
    '/partners/image5.png',
    '/partners/image6.png',
    '/partners/image7.jpg',
    '/partners/image8.jpg',
    '/partners/image9.jpg',
    '/partners/image10.jpg',
    '/partners/image11.jpg',
    '/partners/image12.jpg',
    '/partners/image13.jpg',
    '/partners/image14.jpg',
    '/partners/image15.jpg',
    '/partners/image16.jpg',
    '/partners/image17.jpg',
    '/partners/image18.jpg',
    '/partners/image19.jpg',
  ]

  return (
    <React.Fragment>
      <Seo
        page={t('PagesName.ourPartners')}
        description={t('PagesDescriptions.partners')}
      />
      <div className="partner-bg">
        <div className=" container-xxl section-padding p-md-5">
          <section className="container  border-2">
            <div className=" d-flex justify-content-center align-items-center ">
              <Img
                image={{
                  src: '/CBStarClub.png',
                  width: 227,
                  height: 227,
                  alt: 'CB Star',
                }}
                className="blue-filter object-fit-contain"
              />
            </div>
            <div className="row g-4">
              {images?.map((image, index) => {
                return (
                  <div
                    className="col-6 col-md-2 p-3 d-flex justify-content-center align-items-center"
                    key={`${'partner-' + index + 1}`}
                  >
                    <div
                      style={{ width: '200px', height: '150px' }}
                      className="bg-white shadow rounded-4 d-flex justify-content-center align-items-center"
                    >
                      <Img
                        image={{
                          src: image,
                          alt: `partner-${index - 1}`,
                          width: 130,
                          height: 130,
                        }}
                        className=" object-fit-cover"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </React.Fragment>
  )
}
