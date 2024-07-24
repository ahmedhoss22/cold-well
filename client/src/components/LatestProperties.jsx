import React, { useCallback, useEffect, useState } from 'react';
import { FetchLatestProperties } from '../Api/ApiCalls';
import Property from './Cards/Property';

import { useTranslation } from 'react-i18next';
import Carousel from './Common/Carousel';

const LatestProperties = React.memo(() => {
  const { t } = useTranslation();
  const [latestProperties, setLatestProperties] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const data = await FetchLatestProperties();
      setLatestProperties(data);
    } catch (err) {
      console.error('Error fetching latest properties:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="container-xxl section-padding">
      <div className="container p-2">
        <h2 className='sup-title'>
          {t('latestProperties')}
        </h2>
        <div className="row gx-4 gy-5">
          <Carousel sm={1.1} md={2.2} lg={2.9} Component={Property} items={latestProperties} />
        </div>
      </div>
    </section>
  );
});

export default LatestProperties;
