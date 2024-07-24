import React, { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTranslation } from 'react-i18next';

mapboxgl.accessToken = 'pk.eyJ1IjoidGFoYWhhbWR5MDIiLCJhIjoiY2x3a2RpaWFkMTc5ajJta3gyaW5yd2wwcSJ9.r0bKbuRuQ5DBlG9RaM5Ftg';

export default function MapComponent({ width, height, locations = [] }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { i18n } = useTranslation();
  const [zoom, setZoom] = useState(5);
  // Memoize marker creation and popup setup functions

  const createMarker = useMemo(() => (location) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = 'url(/mark.png)';
    el.style.width = '26px';
    el.style.height = '35px';
    el.style.backgroundSize = '100%';

    const marker = new mapboxgl.Marker(el)
      .setLngLat([location?.lng, location?.lat])
      .addTo(map.current);

    const currentLanguage = i18n.language;
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(location.name[currentLanguage] || location.name);

    marker.setPopup(popup);
  }, [i18n.language]);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer?.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: locations?.length ? [locations[0]?.lng, locations[0]?.lat] : [-70.9, 42.35],
        zoom: zoom,
      });
    }

    // Clear existing markers and popups
    map.current?.markers?.forEach(marker => marker.remove());
    map.current?.popups?.forEach(popup => popup.remove());

    // Add markers and popups
    locations.forEach(location => createMarker(location));

    // Cleanup markers and popups on unmount
    return () => {
      map.current?.markers?.forEach(marker => marker.remove());
      map.current?.popups?.forEach(popup => popup.remove());
    };
  }, [createMarker, i18n.language, locations, zoom]);

  return (
    <div style={{ width, height }} className="rounded-2">
      <div
        ref={mapContainer}
        loading="lazy"
        className="rounded-2"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
