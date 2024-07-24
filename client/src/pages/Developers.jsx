import { Search } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FetchAllDevelopers } from '../Api/ApiCalls'
import Img from '../components/Img'
import Seo from '../Seo'

export default function Developers() {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { t, i18n } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await FetchAllDevelopers();
        setDevelopers(data);
        setFilteredDevelopers(data);
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const searchValue = searchTerm.toLowerCase();
      const language = i18n.language;
      const filtered = developers?.filter((developer) =>
        developer.name[language].toLowerCase().includes(searchValue)
      );
      setFilteredDevelopers(filtered);
    }, 300); // Debounce search input

    return () => clearTimeout(timeoutId);
  }, [searchTerm, developers, i18n.language]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const imageProps = useMemo(() => (item) => ({
    width: '150',
    height: '150',
    alt: item.name[i18n.language],
    src: `${import.meta.env.VITE_IMAGE_ORIGIN}/${item?.images[0].url}`,
  }), [i18n.language]);

  return (
    <React.Fragment>
        <Seo
      page={t('PagesName.developers')}
      description={t('PagesDescriptions.developers')}
      />
     <section className="position-relative w-100 section-background">
        <div className="background-image-wrapper">
          <Img 

            image={{ src: '/developers.svg', alt: 'Developers Background',width:'100%' , height:'100%' }} 
            className="background-image" 
          />
        </div>
        <div className="overlay"></div>
        <div className="w-100 position-absolute start-50 top-50 z-3 translate-middle ">
          <h1 className="text-primary-white text-center w-100">
            {t('developers.title')}
          </h1>
          <div
            className="font-inter text-center"
            style={{
              color: 'var(--primary-white)',
              textShadow: '1px 1px 3px rgba(68, 68, 68, 0.25)',
              fontSize: '18px',
              fontWeight: '400',
              margin: '0 auto',
            }}
          >
            {t('developers.text')}
          </div>
        </div>
      </section>
      <section className="container-xxl section-padding min-vh-100">
        <div className="d-flex justify-content-center align-items-center">
          <span className="search-container position-relative border-0">
            <input
              placeholder={t('developers.developerSearch')}
              className="search-input"
              type="text"
              name="search-developer"
              id="search-developer"
              onChange={handleSearch}
            />
            <Search />
          </span>
        </div>
        <div className="row mt-4">
        {filteredDevelopers?.map((item, index) => (
            <div key={index +1} className="col-xl-2 col-sm-3 col-6">
              <Link
                to={`/developer-details/${item._id}`}
                className="hoveredLogo d-flex align-items-center flex-column p-4 inner"
              >
                <Img
                  image={imageProps(item)}
                  className="developers-developer-logo"
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  )
}
