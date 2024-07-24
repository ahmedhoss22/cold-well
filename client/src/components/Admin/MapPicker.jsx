import React, { useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapPicker = ({ initialViewport, onLocationSelect }) => {
  const [viewport, setViewport] = useState(initialViewport);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: initialViewport.latitude,
    longitude: initialViewport.longitude,
  });

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    setMarkerPosition({ latitude: lat, longitude: lng });
    onLocationSelect({ latitude: lat, longitude: lng });
  };

  const token = import.meta.env.VITE_APP_MAPBOX_TOKEN;

  return (
    <Map
      initialViewState={viewport}
      onMove={(event) => setViewport(event.viewState)}
      mapboxAccessToken={token}
      onClick={handleMapClick}
      style={{ width: "100%", height: "400px" , borderRadius:"8px" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <Marker
        latitude={markerPosition.latitude}
        longitude={markerPosition.longitude}
        offsetLeft={-20}
        offsetTop={-10}
      >
        <img src="/mark.png" alt="marker" />
      </Marker>
    </Map>
  );
};

export default MapPicker;
