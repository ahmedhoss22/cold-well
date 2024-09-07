import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FetchAllTypesNames, FetchAllCompoundsNames } from '../Api/ApiCalls'
import { useNavigate } from 'react-router-dom'
import { getFirstTwoWords } from '../assets/common'
const Hero = React.memo(() => {
  const { t, i18n } = useTranslation()
  const { register, handleSubmit } = useForm()
  const videoRef = useRef(null)
  const [compounds, setCompounds] = useState(null)
  const [types, setTypes] = useState(null)
  const [error, setError] = useState(null)
  const fetchData = useCallback(async () => {
    try {
      const [compoundsData, typesData] = await Promise.all([
        FetchAllCompoundsNames(),
        FetchAllTypesNames(),
      ])

      setCompounds(compoundsData)
      setTypes(typesData)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    fetchData()
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5
    }
  }, [fetchData])
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    navigate(
      `/${i18n.language}/search-results?compound=${data.compound}&type=${data.type}&beds=${data.beds}&price=${data.price}`
    )
  }

  // const imageProps = {
  //   src: '/home.jpg',
  //   alt: 'hero-section',
  //   width: '100%',
  //   height: '750',
  //   effect: 'opacity',
  //   style: {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //     zIndex: -1,
  //     filter: 'blur(20px)',
  //   },
  // }

  return (
    <section
      className="w-100 overflow-hidden position-relative bg-white"
      style={{ height: '750px', marginTop: '-70px' }}
    >
      <video
        ref={videoRef}
        width="100%"
        height="750"
        playsInline
        autoPlay
        muted
        loop
        preload="auto"
        className="lazy-background-hero bg-white"
      >
        <source
          src="/Untitled video - Made with Clipchamp (1).mp4"
          type="video/mp4"
        />
        <track kind="captions" srcLang="en" label="English captions" />
      </video>

      <div className="hero-overlay"></div>
      <div className="hero-content position-absolute top-50 start-50 translate-middle w-75 z-3">
        <h2 className="display-5 mb-2 mt-2 mb-md-4 text-primary-white text-center">
          {t('Header.perfectHome')}
        </h2>
        <p className="mb-4 pb-2 text-secondary-blue text-center">
          {t('Header.SubHeading')}
        </p>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          style={{ padding: '32px' }}
          className="search row rounded-2 d-flex justify-content-center align-items-center px-0"
        >
          <Row className="d-flex justify-content-center align-items-center gap-2">
            <Col md={3} className="p-0">
              <Form.Group className="mb-3 mb-md-0">
                {/* <Form.Label className="" htmlFor="compoundSelect" >{t('Search.compound')}</Form.Label> */}
                <Form.Control
                  as="select"
                  id="compoundSelect"
                  required
                  {...register('compound')}
                  defaultValue=""
                >
                  <option disabled value="">
                    {t('Search.compound')}
                  </option>
                  {compounds?.map((compound) => (
                    <option key={compound._id} value={compound._id}>
                      {getFirstTwoWords(compound.name[i18n.language])}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2} className="p-0">
              <Form.Group className="mb-3 mb-md-0">
                {/* <Form.Label className=" d-hidden" htmlFor="typeSelect">{t('search.propertyTypes')}</Form.Label> */}
                <Form.Control
                  as="select"
                  id="typeSelect"
                  required
                  {...register('type')}
                  defaultValue=""
                >
                  <option disabled value="">
                    {t('search.propertyTypes')}
                  </option>
                  {types?.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name[i18n.language]}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2} className="p-0">
              <Form.Group className="mb-3 mb-md-0">
                {/* <Form.Label className=" d-hidden" htmlFor="bedsSelect">{t('Search.beds')}</Form.Label> */}
                <Form.Control
                  as="select"
                  id="bedsSelect"
                  required
                  {...register('beds')}
                  defaultValue=""
                >
                  <option disabled value="">
                    {t('Search.beds')}
                  </option>
                  <option value="1">1 {t('Search.beds')}</option>
                  <option value="2">2 {t('Search.beds')}</option>
                  <option value="3">3 {t('Search.beds')}</option>
                  <option value="4">4 {t('Search.beds')}</option>
                  <option value="5+">5+ {t('Search.beds')}</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2} className="p-0">
              <Form.Group className="mb-3 mb-md-0">
                {/* <Form.Label className=" d-hidden" htmlFor="priceSelect">{t('Search.price')}</Form.Label> */}
                <Form.Control
                  as="select"
                  id="priceSelect"
                  required
                  {...register('price')}
                  defaultValue=""
                >
                  <option disabled value="">
                    {t('Search.price')}
                  </option>
                  <option value="1">{t('Search.price1')}</option>
                  <option value="2">{t('Search.price2')}</option>
                  <option value="3">{t('Search.price3')}</option>
                  <option value="4">{t('Search.price4')}</option>
                  <option value="5">{t('Search.price5')}</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2} className="p-0">
              <Button
                className="btn button-primary w-100 mb-0 rounded-2"
                type="submit"
              >
                {t('Search.Search')}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  )
})

export default Hero
