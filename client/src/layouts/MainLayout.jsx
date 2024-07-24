import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, Nav } from '../components';
import { useTranslation } from 'react-i18next';
import { FaArrowUp } from 'react-icons/fa';

const CopyRight = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-center align-items-center p-2 mt-4">
      <p className="mb-0 text-primary text-center text-md-start">
        &copy; {currentYear} ColdWell Banker New Alex. {t("footer.copyRights")}
      </p>
    </div>
  );
};
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);


    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'opacity-1' : 'opacity-0'}`}
      title='Back to Top'
      type='button'
      onClick={handleScrollTop}
    >
      <FaArrowUp />
    </button>
  );
};

export default function MainLayout() {
  return (
    <React.Fragment>
      <Nav />
      <main style={{ marginTop:"70px"}}>
        <Outlet />
      </main>
      <Footer />
      <CopyRight />
      <BackToTop />
    </React.Fragment>
  );
}
