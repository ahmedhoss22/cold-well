import React from "react";
import { Helmet } from "react-helmet-async";

const GoogleTag = () => {
  return (
    <Helmet>
      {/* Google Tag Manager */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11413644099"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-11413644099');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleTag;
