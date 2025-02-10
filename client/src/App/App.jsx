import React from 'react';

import { BrowserRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Toaster from '../components/Common/Toaster';
import { HelmetProvider } from 'react-helmet-async';
import GoogleTag from '../Services/GoogleTag';
const ProjectRoutes = React.lazy(() => import("./Routes"));

function App() {
  return (
    <HelmetProvider>
      <GoogleTag/>
      <Router basename='/'>
        <I18nextProvider i18n={i18n}>
          <ProjectRoutes />
          <Toaster />
        </I18nextProvider>
      </Router>
    </HelmetProvider>
  );
}

export default React.memo(App);
