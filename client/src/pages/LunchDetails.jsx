import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FetchDeveloperLaunch, FetchLaunchDetails } from '../Api/ApiCalls'
import DataLoader from '../components/Common/DataLoader'
import { useTranslation } from 'react-i18next'
import { ContactUs, Whatsapp } from '../components/Common/Buttons'

import MapComponent from '../components/Map/MapContainer'
import DetailsLayout from '../layouts/DetailsLayout'
import Img from '../components/Img'
import Seo from '../Seo'

export default function LunchDetails() {
  const { t, i18n } = useTranslation()
  const [launch, setLaunch] = useState()
  const [developerLaunch, setDeveloperLaunch] = useState([])
  const { id } = useParams()
  async function fetchData() {
    const data = await FetchLaunchDetails(id)
    const developerId = data?.developer?._id
    const developerLaunch = await FetchDeveloperLaunch(developerId)
    setLaunch(data)
    setDeveloperLaunch(developerLaunch)
  }

  useEffect(() => {
    fetchData()
  }, [id])
  if (!launch) {
    return (
      <div className="d-flex justify-content-center align-items-center ">
        <DataLoader />
      </div>
    )
  }

  function isVideo(url) {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv']
    return videoExtensions.some((extension) => url.endsWith(extension))
  }

  function isImage(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    return imageExtensions.some((extension) => url.endsWith(extension))
  }
  const launchFileUrl = `${import.meta.env.VITE_IMAGE_ORIGIN}/${launch?.video[0].url}`

  const renderMedia = (url) => {
    if (isVideo(url)) {
      return (
        <video width="100%" height="100%" playsInline controls autoPlay loop>
          <source src={url} type="video/mp4" />
          <track kind="captions" srcLang="en" label="English captions" />
        </video>
      )
    } else if (isImage(url)) {
      const imageProps = {
        alt: 'launch Media',
        src: url,
        width: '100%',
        height: '550',
      }
      return (
        <Img
          image={imageProps}
          className="object-fit-cover rounded-2 launch-image"
        />
      )
    } else {
      return <p>Unsupported media type</p>
    }
  }
  const developerImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${launch?.developer.images[0].url}`
  const launchDescription = launch?.description[i18n.language]
  const launchDetails = launch?.launchDetails[i18n.language]
  const decodeHtml = (html) => {
    let txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }
  const decodedHtml = decodeHtml(launchDetails)

  return (
    <React.Fragment>
      <Seo
        page={t('PagesName.launchDetails')}
        description={t('PagesDescriptions.launch')}
      />
      <section className=" container-xxl section-padding min-vh-100">
        <div className="container">
          <div className="video-container w-100" style={{ height: '650px' }}>
            {renderMedia(launchFileUrl)}
          </div>

          <div
            className=" row pb-4 border-bottom  "
            style={{ marginTop: '32px' }}
          >
            <div className="col-md-2  mb-2 d-flex justify-content-start justify-content-md-end align-items-center">
              <Link to={`/developer-details/${launch?.developer._id}`}>
                <img
                  src={developerImage}
                  className="shadow-img rounded-circle"
                  width="90"
                  height="90"
                  alt=""
                />
              </Link>
            </div>
            <div className="col-md-6 d-flex flex-column justify-content-center justify-content-md-start align-items-center align-items-md-start">
              <h1 className=" launch-title fs-3 text-center text-md-start">
                {' '}
                {launch?.launchName[i18n.language]}
              </h1>
              <Link
                to={`/developer-details/${launch?.developer._id}`}
                style={{ textDecoration: 'underline ' }}
              >
                {launch?.developer.name[i18n.language]} &#10095;
              </Link>
              <p className="">{launch?.location.name[i18n.language]} </p>
            </div>
            <div className="col-md-4 d-flex justify-content-center gap-2 justify-content-md-end align-items-end">
              <Whatsapp
                itemName={launch?.launchName[i18n.language]}
                developerName={launch?.developer.name[i18n.language]}
                number={launch?.developer.callUsNumber}
              />{' '}
              <ContactUs number={launch?.developer.callUsNumber} />
            </div>
          </div>
        </div>
      </section>
      <section className="container-xxl">
        <DetailsLayout>
          <div className="row my-5">
            <h2 className="title">{t('launches.details')}</h2>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: launchDescription }}
            />
          </div>
          <div className="row mb-4 ">
            <h2 className="title">{t('launches.viewMap')}</h2>
            <div className="map-container">
              <MapComponent
                locations={[
                  {
                    lng: launch?.location?.longitude,
                    lat: launch?.location?.latitude,
                    name: launch?.launchName[i18n.language],
                  },
                ]}
                width="100%"
                height="100%"
              />
            </div>
          </div>
          <div className="row mb-4">
            <h2 className="title">{t('launches.launchDescription')}</h2>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: decodedHtml }}
            />
          </div>
        </DetailsLayout>
      </section>

      <section className="container-xxl section-padding">
        <div className="container">
          <div className="row">
            <h2 className="title">{t('launches.developerProjects')}</h2>
            <div className="developer-projects">
              {developerLaunch?.map((devLaunch, index) => {
                const launchImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${devLaunch?.thumbnail[0].url}`
                return (
                  <Link
                    key={index + 1}
                    className=" d-flex justify-content-start align-items-center gap-1"
                    to={`/launch-details/${devLaunch._id}`}
                  >
                    <img
                      src={launchImage}
                      className=" object-fit-cover rounded-2"
                      alt=""
                      style={{ height: '70px', width: '90px' }}
                      width="90"
                      height="70"
                    />
                    <p className=" mb-0">
                      {devLaunch?.launchName[i18n.language]}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
