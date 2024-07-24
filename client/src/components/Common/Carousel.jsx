import React, { useMemo } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useTranslation } from 'react-i18next';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Carousel({ infinite = false, items = [], Component, settings = {}, def = 3, sm = 1, md = 2.5, lg = 3.5 }) {
  const { t,i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const defaultSettings = useMemo(() => ({
    // spaceBetween: 20,
    navigation: true,
    pagination: false,
    scrollbar: false,
    lazyload: "ondemand",
    modules: [Navigation, Pagination, A11y],
    breakpoints: {
      320: {
        slidesPerView: sm,
        spaceBetween:10
      },
      768: {
        slidesPerView: md,
        spaceBetween:15
      },
      1024: {
        slidesPerView: lg,
        spaceBetween:10
      },
    },
  }), [sm, md, lg]);

  const swiperSettings = useMemo(() => {
    const mergedSettings = { ...defaultSettings, ...settings };
    if (!mergedSettings.pagination) {
      delete mergedSettings.pagination;
    }
    return mergedSettings;
  }, [defaultSettings, settings]);
/**
 * !key={i18n.language} this fix the dir issue 
 */
  return (
    <div className={`carousel-container ${direction}`}>
      {items?.length > 0 ? (
        <Swiper  dir={i18n.dir()} key={i18n.language} {...swiperSettings} infinite={infinite ? 'false' : undefined} dots={undefined}>
          {items?.map((item) => (
            <SwiperSlide key={item._id}>
              <Component item={item}/>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="d-flex justify-content-center align-items-center no-data">
       {t('nodataToShow')} 
        </div>
      )}
    </div>
  );
}

Carousel.propTypes = {
  infinite: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  Component: PropTypes.elementType.isRequired,
  settings: PropTypes.object,
  def: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
};

