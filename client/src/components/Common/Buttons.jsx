import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import PropTypes from 'prop-types';

export const ContactUs = ({ number }) => {
  const { t } = useTranslation();
  return (
    <a href={`tel:${number}`}>
      <button className="btn-call__us">
        <span className="d-flex justify-content-center align-items-center gap-2">
          <FaPhoneAlt style={{ transform: 'rotate(10deg)' }} />
          <p className="mb-0 fs-6 fw-medium">{t('contact.callUs')}</p>
        </span>
      </button>
    </a>
  );
};

ContactUs.propTypes = {
  number: PropTypes.number.isRequired,
};

export const Whatsapp = ({ number, developerName, itemName }) => {
  const { t } = useTranslation();
  const baseText = `Hello ${developerName}! I'm interested in your property ${itemName}. Link: `;
  const encodedBaseText = encodeURIComponent(baseText);
  const encodedUrl = encodeURIComponent(window.location.href);
  const whatsappLink = `https://wa.me/${number}?text=${encodedBaseText}${encodedUrl}`;
  return (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
      <button
        style={{
          backgroundColor: 'rgb(76, 217, 100)',
          borderColor: 'rgb(76, 217, 100)',
          backgroundImage: 'none',
        }}
        className="btn-call__us whatsapp-btn"
      >
        <span className="d-flex justify-content-center align-items-center gap-1">
          <FaWhatsapp />
          <p className="mb-0 fs-6 fw-medium text-white">{t('contact.whatsapp')}</p>
        </span>
      </button>
    </a>
  );
};

Whatsapp.propTypes = {
  number: PropTypes.number.isRequired,
  developerName: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
};