import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Img from '../Img';


const LaunchCard = ({ item }) => {
  const itemImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${item?.thumbnail[0].url}`;

  const imageProps = {
    key: item._id,
    src: itemImage,
    alt: 'Launch',
    height: '221px',
    width: '100%',
  };
 
  return (
    <Link className="launch-card" to={`/launch-details/${item._id}`}>
      <Img image={imageProps} className=" rounded-2"/>
    </Link>
  );
};

LaunchCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    thumbnail: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default LaunchCard;
