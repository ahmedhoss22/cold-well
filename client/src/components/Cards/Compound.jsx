import React ,{ useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Img from "../Img";
import PropTypes from 'prop-types';
const Compound = ({ item }) => {
  const { i18n } = useTranslation();
  const itemImage = useMemo(
    () => `${import.meta.env.VITE_IMAGE_ORIGIN}/${item.thumbnail[0]?.url}`,
    [item]
  );
  const developerImage = useMemo(
    () => `${import.meta.env.VITE_IMAGE_ORIGIN}/${item?.developer[0]?.images[0]?.url}`,
    [item]
  );

  const firstTwoWords = useMemo(() =>
    item.name[i18n.language].split(' ').slice(0, 3).join(' '),
    [item, i18n.language]
  );

  const itemImageProps = {
    key: item._id,
    src: itemImage,
    alt: item.name[i18n.language],
    height: '230px',
    width: '100%',
   };

  const developerImageProps = {
    key: item.developer[0]._id,
    src: developerImage,
    alt: item.developer[0].name[i18n.language],
    height: '100%',
    width: '100%',
  };

  return (
    <div className="col-md-4">
      <div className="p-0 overflow-hidden rounded-2 compound">
        <div className="custom-compound-image position-relative">
          <Link
            className="custom-compound-unit_name"
            to={`/compound-details/${item._id}`}
          >
            <Img
              className="object-fit-cover"
              image={itemImageProps}
            />
          </Link>

          {item.developer && (
            <span className="position-absolute custom-developer-logo">
              <Link to={`/developer-details/${item.developer[0]._id}`}>
                <Img
                  className="w-100 h-100 rounded-circle"
                  image={developerImageProps}
                />
              </Link>
            </span>
          )}
        </div>
        <div className="custom-compound-unit-information-wrapper p-2">
          <Link
            className="custom-compound-unit_name"
            to={`/compound-details/${item._id}`}
          >
            <h2 className="compound-title mb-1">{firstTwoWords}</h2>
          </Link>
          <p className="compound_description d-flex gap-1 justify-content-start align-items-center mb-1">
            {item.area[0].title[i18n.language]}
          </p>
        </div>
      </div>
    </div>
  );
};

Compound.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    thumbnail: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    developer: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string.isRequired,
          })
        ),
        name: PropTypes.shape({
          en: PropTypes.string,
          ar: PropTypes.string,
        }),
      })
    ),
    name: PropTypes.shape({
      en: PropTypes.string,
      ar: PropTypes.string,
    }).isRequired,
    description: PropTypes.shape({
      en: PropTypes.string,
      ar: PropTypes.string,
    }).isRequired,
    area: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.shape({
          en: PropTypes.string,
          ar: PropTypes.string,
        }),
      })
    ).isRequired,
    amenities: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default React.memo(Compound);
