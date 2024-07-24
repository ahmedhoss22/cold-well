import React from 'react'

import PropTypes from 'prop-types';
export default function Title({title}) {

  return (
    <div className="main-title">
    <h2 className="mb-0">
      {title}
    </h2>
    </div>
  )
}
Title.propTypes={
  title:PropTypes.string
}