import React from 'react'

import PropTypes from 'prop-types';

const DeveloperImage = ({ developerId, developerImage }) => (
    <div className="col-md-2 d-flex justify-content-md-center align-items-center">
      <Link to={`developer-details/${developerId}`}>
        <img
          loading="lazy"
          src={developerImage}
          className="object-fit-cover rounded-4 border shadow"
          draggable="false"
          width="140"
          height="140"
          alt="developer logo"
        />
      </Link>
    </div>
  );
  DeveloperImage.propTypes = {
    developerId: PropTypes.string.isRequired,
    developerImage: PropTypes.string.isRequired,
  };
  const PropertyTitle = ({ title }) => (
    <div className="d-flex flex-column flex-md-row">
      <h1 className="property-title fs-3 mt-2 col-md-10 justify-content-center align-items-center">
        {title}
      </h1>
    </div>
  );
  
  PropertyTitle.propTypes = {
    title: PropTypes.string.isRequired,
  };
  const PropertyLocation = ({ areaTitle }) => (
    <div className="d-flex gap-1 justify-content-start">
      <MapPin size={16} />
      <p>{areaTitle}, </p>
    </div>
  );
  
  PropertyLocation.propTypes = {
    areaTitle: PropTypes.string.isRequired,
  };
  const PropertyPrices = ({ minPrice, maxPrice, t }) => (
    <div>
      <p style={{ fontSize: '12px' }} className="mb-0">
        {t('propertyDetails.pricesStartFrom')}
      </p>
      <span className="d-flex justify-content-start gap-0 gap-md-2 flex-column flex-md-row">
        <h3>
          {minPrice} {t('egp')}
        </h3>
        <span className="d-flex justify-content-start align-items-start flex-column flex-md-row align-items-md-center">
          <p style={{ fontSize: '12px' }} className="mb-0">
            {t('propertyDetails.maxPrice')}:
          </p>
          <h3>
            {maxPrice} {t('egp')}
          </h3>
        </span>
      </span>
    </div>
  );
  
  PropertyPrices.propTypes = {
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired,
    t: PropTypes.func.isRequired,
};

const Details = ({ compound, developerImage, details, t, i18n }) => {
    const developerId = compound?.developer[0]._id;
    const compoundName = compound?.name[i18n.language];
    const areaTitle = compound?.area[0].title[i18n.language];
    const minPrice = formatNumber(details[0]?.minPriceProperty?.min_price);
    const maxPrice = formatNumber(details[0]?.maxPriceProperty?.max_price);
  
    return (
      <div className="container">
        <div className="row card-style">
          <div className="col-md-12 d-flex flex-column flex-md-row mx-auto">
            <DeveloperImage developerId={developerId} developerImage={developerImage} />
            <div className="col-md-10 d-flex flex-column mt-2" style={{ marginRight: '15px' }}>
              <div className="col-md-12 d-flex flex-column">
                <PropertyTitle title={compoundName} />
                <PropertyLocation areaTitle={areaTitle} />
                <div className="d-flex justify-content-between flex-column flex-md-row">
                  <PropertyPrices minPrice={minPrice} maxPrice={maxPrice} t={t} />
                  <div className="mt-2 d-flex justify-content-start flex-wrap align-items-center justify-content-md-end gap-2">
                    <ContactUs number={compound?.contactUsNumber} />
                    <Whatsapp
                      number={compound?.contactUsNumber}
                      itemName={compoundName}
                      developerName={compound?.developer[0].name[i18n.language]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  Details.propTypes = {
    compound: PropTypes.object.isRequired,
    developerImage: PropTypes.string.isRequired,
    details: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
  };
  
  export default Details;
