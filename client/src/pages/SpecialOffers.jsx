import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Img from '../components/Img';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { FetchAllOffers } from '../Api/ApiCalls';

const Whatsapp = ({
  t,
  i18n,
  name,
  downPayment,
  referenceNumber,
  installmentYears,
  phone,
}) => {
  const arText = `رغب في المزيد من المعلومات عن ${name} بعرض ${downPayment} مقدم، تقسيط على ${installmentYears} سنوات . رقم مرجعى # ${referenceNumber}. *برجاء عدم حذف الرقم المرجعي* ليتمكن أحد مستشاري العقارات لدينا بمساعدك.`;
  const enText = `I would like more information on ${name} with offer ${downPayment} down payment, ${installmentYears} installments, Reference # ${referenceNumber}. *Please do NOT delete this message* as our property consultants use this reference number to better assist you.`;
  const baseText = i18n.language === 'en' ? enText : arText;
  const encodedBaseText = encodeURIComponent(baseText);
  const encodedUrl = encodeURIComponent(window.location.href);
  const whatsappLink = `https://wa.me/${phone}?text=${encodedBaseText}${encodedUrl}`;
  
  return (
    <div className="p-2 d-flex flex-column gap-1">
      <span className="fs-5 fw-semibold">{t('offers.getOffer')}</span>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <button
          style={{
            backgroundColor: 'rgb(76, 217, 100)',
            borderColor: 'rgb(76, 217, 100)',
            backgroundImage: 'none',
          }}
          className="btn-call__us whatsapp-btn rounded-2 w-100"
        >
          <span className="d-flex justify-content-center align-items-center gap-1">
            <FaWhatsapp size={20} />
            <p className="mb-0 fs-6 fw-medium text-white">
              {t('contact.whatsapp')}
            </p>
          </span>
        </button>
      </a>
    </div>
  );
};

export default function SpecialOffers() {
  const { t, i18n } = useTranslation();
  const offersFilter = [
    { value: '10%', label: t('offers.DownPayment') },
    { value: '5%', label: t('offers.DownPayment') },
    { value: 'Cash', label: 'Discount' },
    { value: '10+', label: t('offers.Years') },
  ];
  
  const [activeOffer, setActiveOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);

  const loadOffers = async () => {
    const data = await FetchAllOffers();

    setOffers(data);
    setFilteredOffers(data);
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleOfferClick = (index, value) => {
    setActiveOffer(index);
    const filtered = offers.filter((offer) => {
      if (value === '10%' || value === '5%') {
        return offer.downPayment === value;
      } else if (value === 'Cash') {
        return offer.downPayment === 'Cash';
      } else if (value === '10+') {
        return offer.installmentYears > 10;
      } else {
        return true;
      }
    });
    setFilteredOffers(filtered);

  };

  function splitText(text, idx) {
    const words = text.split(' ');
    return words.slice(0, idx).join(' ');
  }

  return (
    <Container fluid className="min-vh-100">
      <section className="container section-padding">
        <h2 className="sup-title">
          {t('offers.availableOffers')}{' '}
          <span className="fs-6 fw-light">
            {offers?.length||0 + t('offers.results')}{' '}
          </span>
        </h2>

        <div className="d-flex justify-content-center justify-content-md-start align-items-center flex-wrap gap-2">
          {offersFilter?.map((offer, index) => (
            <button
              key={index + 1}
              className={`offer d-flex flex-column align-items-center px-2 py-2 rounded-2 shadow-sm text-center ${activeOffer === index ? 'active' : ''}`}
              onClick={() => handleOfferClick(index, offer.value)}
              style={{ cursor: 'pointer' }}
            >
              <span className="fs-4 fw-bold">{offer.value}</span>
              <span className="fw-medium">{offer.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <Row className="g-2">
          {filteredOffers && filteredOffers.length > 0 ? (
            filteredOffers.map((offer, idx) => {
              const developerImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${offer?.developer[0]?.images[0]?.url}`;
              return (
                <Col key={idx + 1} md={3}>
                  <div className="position-relative offer-card d-flex flex-column mb-2 rounded-2">
                    <div className="position-relative p-2 border-bottom offer-card-body">
                      <div className="offer-name p-1 position-absolute top-0 bg-primary-blue text-primary-white">
                        <span style={{ fontSize: '13px' }}>
                          {offer.offerNote[i18n.language]}
                        </span>
                      </div>
                      <div className="my-4 d-flex flex-column gap-3">
                        <div className="d-flex justify-content-start align-items-center gap-2">
                          <Img
                            image={{
                              src: developerImage,
                              alt: 'developer image',
                              width: 70,
                              height: 70,
                            }}
                            className="shadow rounded-circle object-fit-cover"
                          />
                          <div className="d-flex flex-column gap-1">
                            <h3 className="fs-6 mb-0 fw-semibold">
                              {splitText(offer.offerName[i18n.language], 3)}
                            </h3>
                            <span style={{ fontSize: '14px' }}>
                              {splitText(
                                offer.developer[0].name[i18n.language],
                                4
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="rounded-2 bg-white d-flex flex-column py-4">
                          <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                                <span className="fs-4 fw-bold">
                                  {offer.downPayment}%
                                </span>
                                <span className="fw-medium">
                                  {t('offers.DownPayment')}
                                </span>
                              </div>
                              <span
                                style={{
                                  width: '2px',
                                  height: 50,
                                  color: '#000',
                                  backgroundColor: '#000',
                                }}
                              />
                              <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                                <span className="fs-4 fw-bold">
                                  {offer.installmentYears} {t('offers.Years')}
                                </span>
                                <span className="fw-medium">
                                  {t('offers.installment')}
                                </span>
                              </div>
                            </div>
                            <div
                              style={{ height: '20px' }}
                              className="d-flex justify-content-center align-items-center"
                            >
                              {offer.oldOffer.downPayment && (
                                <span className="text-decoration-line-through opacity-50 text-center">
                                  {offer.oldOffer.downPayment}%{' '}
                                  {t('offers.DownPayment')} -{' '}
                                  {offer.oldOffer.installmentYears}{' '}
                                  {t('offers.Years')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Whatsapp
                      t={t}
                      i18n={i18n}
                      name={offer.offerName[i18n.language]}
                      referenceNumber={offer.referenceNumber}
                      downPayment={offer.downPayment}
                      installmentYears={offer.installmentYears}
                      phone={offer.whatsapp}
                    />
                  </div>
                </Col>
              );
            })
          ) : (
            <div className="mt-5 d-flex justify-content-center align-items-center">
              <Img
                image={{
                  src: '/no-data.svg',
                  alt: 'no data',
                  height: 220,
                  width: '100%',
                }}
                className="object-fit-cover"
                style={{ maxWidth: '320px' }}
              />
            </div>
          )}
        </Row>
      </section>
    </Container>
  );
}
