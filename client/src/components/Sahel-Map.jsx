import React from 'react';
import Img from './Img';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function SahelMap() {
  const { i18n } = useTranslation();
  const imagePath = i18n.language === "ar" ? '/sahel-map-ar.png' : '/sahel-map-en.png';
  const downloadPath = '/north-coast-map-2024.png';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadPath;
    link.download = downloadPath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="container-xxl section-padding">
      <div className="container sahel-map">
        <Link draggable="false">
          <Img
            image={{ src: imagePath, width: '100%', height: '100%' , alt:"sahel-map" }}
            className="sahel-map  object-fit-cover rounded-2 sahel-map"
            style={{ overflow: 'hidden', cursor: "pointer" }}
            onClick={handleDownload}
          />
        </Link>
      </div>
    </section>
  );
}
