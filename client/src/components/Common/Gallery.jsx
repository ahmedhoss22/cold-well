import React, { useState, useCallback, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Spinner } from 'react-bootstrap'
import Img from '../Img'

const Lightbox = React.lazy(() => import('./Lightbox'))

const Gallery = React.memo(({ property }) => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const openLightbox = useCallback((index) => {
    setActiveIndex(index)
    setIsOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleMouseEnter = useCallback(
    (index) => {
      if (activeIndex !== index) {
        setActiveIndex(index)
      }
    },
    [activeIndex]
  )

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(0)
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const onSubmit = useCallback((data) => {

  }, [])
  const imagesToShow = property?.images || []
  return (
    <section className="container-xxl section-padding mb-2">
      <div className="container">
        <ImageGallery numImages={property?.images?.length}>
          {imagesToShow.map((image, index) => (
            <ImageContainer
              className={index === activeIndex ? 'active' : ''}
              key={index + 1}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              tabIndex={0}
              onClick={() => openLightbox(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openLightbox(index)
                }
              }}
            >
              <Img
                image={{
                  key: index,
                  alt: `Image ${index + 1}`,
                  height: '100%',
                  src: `${import.meta.env.VITE_IMAGE_ORIGIN}/${image.url}`,
                  width: '100%',
                }}
                className="object-fit-cover"
              />
            </ImageContainer>
          ))}
        </ImageGallery>
        {isOpen && (
          <Suspense fallback={<Spinner />}>
            <Lightbox
              property={property}
              activeIndex={activeIndex}
              settings={settings}
              closeLightbox={closeLightbox}
              handleSubmit={handleSubmit}
              register={register}
              errors={errors}
              onSubmit={onSubmit}
              i18n={i18n}
            />
          </Suspense>
        )}
      </div>
    </section>
  )
})

Gallery.propTypes = {
  property: PropTypes.shape({
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }),
}

const ImageGallery = styled.div`
  height: 650px;
  max-width: 100%;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  border-radius: 8px;
  overflow: hidden;
  flex-wrap: wrap; /* Handle different numbers of images */
  @media (max-width: 768px) {
    height: 350px;
  }
`

const ImageContainer = styled.div`
  flex: 1 1 calc(20% - 8px); /* Adjusted for different numbers of images */
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  transition: flex 0.3s ease-in-out;
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;

  &.active {
    flex: 1 1 calc(40% - 8px); /* Adjusted for active image enlargement */
  }

  &:not(.active) {
    flex: 1 1 calc(8% - 8px); /* Default size for non-active images */
  }

  @media (max-width: 992px) {
    flex: 1 1 calc(33.33% - 8px);
    &.active {
      flex: 1 1 calc(30% - 8px);
    }
    &:not(.active) {
      flex: 1 1 calc(12% - 8px);
    }
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 8px); /* Adjust for smaller screens */
  }

  @media (max-width: 576px) {
    flex: 1 1 calc(100% - 8px); /* Full width on very small screens */
  }
`

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
`

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
`

export default Gallery
