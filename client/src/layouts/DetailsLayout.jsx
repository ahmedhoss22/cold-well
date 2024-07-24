import React from 'react';
import Form from '../components/Common/Form';

export default function DetailsLayout({ children }) {
  return (
    <div className="row">
      <div className="col-md-9">
        {children}
      </div>
      <div className="col-md-3">
        <div className=' position-sticky p-2 bg-white shadow-sm mt-5' style={{top:"130px"}}>
        <Form />

        </div>
      </div>
    </div>
  );
}
