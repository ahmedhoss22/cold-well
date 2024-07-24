import React from 'react';
import Slider from 'react-slick';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Form from './Form';

export default function Lightbox({
  property,
  activeIndex,
  settings,
  closeLightbox,
  handleSubmit,
  register,
  errors,
  onSubmit,
  i18n
}) {
  const { t } = useTranslation();

  return (
    <div className="lightbox_property_wrapper">
      <div className="lightbox_property_wrapper_level2">
        <div className="lighbox-image-close"><X onClick={closeLightbox} /></div>
        <div className="lightbox_property_content row">
          <div className="lightbox_property_slider col-md-9">
            <Slider {...settings} initialSlide={activeIndex}>
              {property?.images?.map((image, index) => (
                <div key={index}>
                  <img
                    loading="lazy"
                    src={`${import.meta.env.VITE_IMAGE_ORIGIN}/${image.url}`}
                    className="property-slider"
                    alt={`property ${index + 1}`}
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="col-md-3">
            <div className="d-flex flex-column gap-2 mt-4 p-2">
              {/* <h3 className="fs-5">{property?.name[i18n.language]}</h3>
              <h4 className="fs-6">Want to find out more?</h4> */}
              <Form/>
              {/* <form onSubmit={handleSubmit(onSubmit)} className="p-3">
                <input
                  className="form-control mb-3"
                  {...register("firstName", { required: true })}
                  placeholder="Your Name"
                />
                {errors.firstName && <span>This field is required</span>}
                <input
                  className="form-control mb-3"
                  {...register("phone", { required: true })}
                  placeholder="Your Phone"
                />
                {errors.phone && <span>This field is required</span>}
                <input
                  className="form-control mb-3"
                  {...register("email", { required: true })}
                  placeholder="Your Email"
                />
                {errors.email && <span>This field is required</span>}
                <textarea
                  id="agent_comment"
                  {...register("comment", { required: true })}
                  className="form-control mb-3"
                  cols="45"
                  rows="6"
                  aria-required="true"
                  placeholder="Comment"
                />
                {errors.comment && <span>This field is required</span>}
                <button
                  type="submit"
                  className="btn button-primary w-100"
                >
                  Send Email
                </button>
              </form> */}
            </div>
          </div>
        </div>
      </div>
      <div className="lighbox_overlay" onClick={closeLightbox}></div>
    </div>
  );
}
