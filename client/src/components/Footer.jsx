import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FetchLatestProperties, FetchTopTypes } from '../Api/ApiCalls';
import Img from './Img';

const Footer = () => {
  const [topTypes, setTopTypes] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const { t, i18n } = useTranslation();

  const fetchData = useCallback(async () => {
    try {
      const [topTypesData, latestPropertiesData] = await Promise.all([
        FetchTopTypes(),
        FetchLatestProperties(),
      ]);
      setTopTypes(topTypesData);
      setLatestProperties(latestPropertiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <footer className="container-xxl my-5">
      <div className="container d-flex flex-column">
        <div className="row gy-4 gx-5 d-flex justify-content-between">
          <ContactUs t={t} />
          <ListsByType t={t} i18n={i18n} topTypes={topTypes} />
          <LatestProperties t={t} latestProperties={latestProperties} />
        </div>
      </div>
    </footer>
  );
};

const ContactUs = React.memo(({ t }) => (
  <div className="col-md-4">
    <h4>{t('contactUs')}</h4>
    <div className="d-flex flex-column gap-2">
      <ContactDetail icon={MapPin} text={t('footer.dir')} />
      <ContactDetail icon={Mail} text="coldwellbanker@newalex.com" href="mailto:coldwellbanker@newalex.com" />
      <ContactDetail icon={Phone} dir="ltr" text="+2 03-4242098 - 012 22 24 24 88" />
      <div className="footer-social d-flex flex-wrap gap-1">
        {socialLinks?.map(({ href, icon, label }) => (
          <SocialLink key={label} href={href} icon={icon} label={label} />
        ))}
      </div>
    </div>
  </div>
));

const ContactDetail = ({ icon: Icon, text, href,...props }) => 
  { const {i18n}= useTranslation()
    return(
  <div className="mb-2 d-flex gap-1 justify-content-start align-items-start">
    <span>
    <Icon style={{ width: '20px', height: '20px' }} />
    </span>
    {href ? (
      <a href={href} className="text-primary-black">
        {text}
      </a>
    ) : (
      <p className="text-primary-black mb-0" {...props}>{text}</p>
    )}
  </div>
);}

const SocialLink = ({ href, icon: Icon, label }) => (
  <div className="styled-social">
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <Icon style={{ width: '22px', height: '22px' }} />
    </a>
  </div>
);

const ListsByType = React.memo(({ t, i18n, topTypes }) => (
  <div className="col-md-4">
    <h4>{t('listsByType')}</h4>
    <div className="d-flex flex-column gap-2">
      {topTypes?.map(({ name, propertiesCount }, index) => (
        <p key={index} className="mb-1">
          {name[i18n.language]} ({propertiesCount || 0})
        </p>
      ))}
    </div>
  </div>
));

const LatestProperties = React.memo(({ t, latestProperties }) => (
  <div className="col-md-4">
    <h4>{t('latestProperties')}</h4>
    <div className="d-flex gap-2 flex-wrap">
      {latestProperties?.slice(0, 4)?.map((item, index) => {
        const itemImage = `${import.meta.env.VITE_IMAGE_ORIGIN}/${item?.thumbnail[0].url}`;
        return (
          <Link to={`/property-details/${item._id}`} className="rounded-2" key={item._id}>
            <Img
              image={{ width: '150', height: '100', src: itemImage, alt: index+1 }}
              className="rounded-2 object-fit-cover"
            />
          </Link>
        );
      })}
    </div>
  </div>
));

const socialLinks = [
  {
    href: 'https://www.facebook.com/CBNewAlexEG?mibextid=ZbWKwL',
    icon: Facebook,
    label: 'Visit our Facebook page',
  },
  {
    href: 'mailto:operationalex4@gmail.com',
    icon: Mail,
    label: 'Send us an email',
  },
  {
    href: 'https://youtube.com/@coldwellbankernewalex8138?si=jpajTO02sS5bnLvF',
    icon: Youtube,
    label: 'Visit our YouTube channel',
  },
  {
    href: 'https://www.instagram.com/coldwell.banker_new.alex?igsh=Mmd5N3ZmZzYxMDhx',
    icon: Instagram,
    label: 'Visit our Instagram profile',
  },
];

export default React.memo(Footer);
