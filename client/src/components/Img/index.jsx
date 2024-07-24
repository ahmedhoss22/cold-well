import React from 'react'
import {
  LazyLoadImage,
} from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const Img = ({ image, ...props }) => {

  const handleImageError = (event) => {
    event.target.src = '/broken.webp';
  };

  return (
    <div>
      <LazyLoadImage
        key={image.key}
        alt={image.alt}
        height={image.height}
        src={image.src}
        width={image.width}
        effect="blur"
        draggable="false"
  
        onError={handleImageError}
        {...props}
      />
    </div>
  )
}

export default Img
