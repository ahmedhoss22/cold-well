import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import PropTypes from 'prop-types'
import { ContactUs, Whatsapp } from '../Common/Buttons'
import { formatNumber } from '../../assets/common'
import Img from '../Img'

const DeveloperImage = ({ developerId, developerImage }) => (
  <div className="col-md-1 d-flex justify-content-md-center align-items-center">
    <Link to={`/developer-details/${developerId}`}>
      <Img
        image={{
          src: developerImage,
          width: 90,
          height: 90,
          alt: 'developer logo',
        }}
        className="object-fit-cover rounded-circle border shadow"
      />
    </Link>
  </div>
)

DeveloperImage.propTypes = {
  developerId: PropTypes.string.isRequired,
  developerImage: PropTypes.string.isRequired,
}

const PropertyTitle = ({ title }) => (
  <div className="d-flex flex-column flex-md-row">
    <h1 className="property-title fs-3 mt-2 mb-0 col-md-10 justify-content-center align-items-center">
      {title}
    </h1>
  </div>
)

PropertyTitle.propTypes = {
  title: PropTypes.string.isRequired,
}

const PropertyLocation = ({ areaTitle, addressLocality }) => (
  <div className="d-flex gap-1 justify-content-start align-items-center">
    <MapPin size={16} />
    <p className="mb-0">
      {areaTitle}, {addressLocality}
    </p>
  </div>
)

PropertyLocation.propTypes = {
  areaTitle: PropTypes.string.isRequired,
  addressLocality: PropTypes.string.isRequired,
}
// const minPrice = 111
// const maxPrice = 111
// 
const PropertyPrices = ({minPrice, maxPrice, t }) => {

  let isEqual
  if (minPrice == maxPrice) {
    isEqual = true
  }
  return (
    <div>
      <p style={{ fontSize: '12px' }} className="mb-0 mt-1">
        {isEqual
          ? t('propertyDetails.price')
          : t('propertyDetails.pricesStartFrom')}
      </p>
      <span className="d-flex justify-content-start gap-1 gap-md-2 flex-column flex-md-row">
        <h3 className="sup-title mb-0">
          {minPrice} {t('egp')}
        </h3>
        {!isEqual && (
          <span className="d-flex justify-content-start align-items-start gap-1 flex-column flex-md-row align-items-md-center">
            <p style={{ fontSize: '12px' }} className="mb-0">
              {t('propertyDetails.maxPrice')}:
            </p>
            <h3 className="sup-title mb-0">
              {maxPrice} {t('egp')}
            </h3>
          </span>
        )}
      </span>
    </div>
  )
}

PropertyPrices.propTypes = {
  minPrice: PropTypes.string.isRequired,
  maxPrice: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

const PropertyHeaderDetails = ({ property, developerImage, t, i18n }) => {
  const developerId = property?.developer[0]._id
  const propertyName = property?.name[i18n.language]
  const areaTitle = property?.area[0]?.title[i18n.language]
  const addressLocality = property?.addressLocality[i18n.language]
  const minPrice = formatNumber(property?.min_price)
  const maxPrice = formatNumber(property?.max_price)
  return (
    <div className="row">
      <div className="col-md-12 d-flex flex-column justify-content-center flex-md-row mx-auto">
        {property?.developer
          ? property?.developer[0] && (
              <DeveloperImage
                developerId={developerId}
                developerImage={developerImage}
              />
            )
          : null}
        <div
          className="col-md-10 d-flex flex-column mt-2"
          style={{ marginRight: '15px' }}
        >
          <div className="col-md-12 d-flex flex-column">
            <PropertyTitle title={propertyName} />
            <PropertyLocation
              areaTitle={areaTitle}
              addressLocality={addressLocality}
            />
            <div className="d-flex justify-content-between flex-column flex-md-row">
              <PropertyPrices minPrice={minPrice} maxPrice={maxPrice} t={t} />
              <div className="mt-2 d-flex justify-content-start flex-wrap align-items-center justify-content-md-end gap-2">
                <ContactUs number={property?.contactUs} />
                {property?.developer
                  ? property?.developer[0] && (
                      <Whatsapp
                        number={property?.contactUs}
                        itemName={propertyName}
                        developerName={
                          property?.developer[0].name[i18n.language]
                        }
                      />
                    )
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PropertyHeaderDetails.propTypes = {
  property: PropTypes.object.isRequired,
  developerImage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
}

export default PropertyHeaderDetails
