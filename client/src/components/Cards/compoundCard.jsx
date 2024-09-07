import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Img from '../Img'
import PropTypes from 'prop-types'

const CompoundCard = ({ item}) => {
  const { t, i18n } = useTranslation()

  const compoundImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${item?.thumbnail[0].url}`

  const imageProps = {
    key: item._id,
    src: compoundImage,
    alt: 'compound',
    height: '220px',
    width: '100%',
  }
  function getFirstTwoWords(text) {
    const words = text.split(' ');
    return words.slice(0, 2).join(' ');
  }
  
  return (
    <div className="compound-card d-inline-block position-relative">
      <Link to={`compound-details/${item._id}`}>
        <Img
          className="object-fit-cover rounded-2"
          image={imageProps}
        />
        <div className="compound-image-layer">
          <div className="compound-image-text">
            <h4 className=' fs-4 text-primary-white'>{getFirstTwoWords(item.name[i18n.language])}</h4>
            <p>
              {item.numberOfProperties} {t('property')}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

CompoundCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    thumbnail: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.shape({
      en: PropTypes.string.isRequired,
      ar: PropTypes.string.isRequired,
    }).isRequired,
    numberOfProperties: PropTypes.number.isRequired,
  }).isRequired,
  
}

export default CompoundCard
