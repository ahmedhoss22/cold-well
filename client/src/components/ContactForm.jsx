import React from 'react';
import Form from './Common/Form';

import Img from './Img';

const ContactForm = () => {
  const contactImageProps = {
    src: "/contact.png",
    alt: "contact-us",
    width: "100%",
    height: "580",
  };

  return (
    <section className='container-xxl section-padding'>
      <div className="row">
        <div className="col-md-6 section-padding d-flex justify-content-center align-items-center container">
          <Form type={"contact"} />
        </div>
        <div className="col-md-6 hidden-sm p-1">
          <Img
            image={contactImageProps}
            className=" object-fit-cover rounded-2"
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactForm);
