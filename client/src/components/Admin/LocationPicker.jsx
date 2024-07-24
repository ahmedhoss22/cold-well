import React from 'react';
import { Form, ToggleButtonGroup, ToggleButton, Row, Col } from 'react-bootstrap';
import MapPicker from './MapPicker';

const LocationPicker = ({ useMap, setUseMap, mapLocation, handleLocationSelect, register, errors }) => {
  return (
    <Form.Group className="my-3">
      <Form.Label>Location</Form.Label>
      <ToggleButtonGroup
        type="radio"
        name="locationOptions"
        defaultValue={useMap ? 1 : 2}
        className="mb-3"
      >
        <ToggleButton
          id="tbg-radio-1"
          value={1}
          onClick={() => setUseMap(true)}
        >
          Choose from Map
        </ToggleButton>
        <ToggleButton
          id="tbg-radio-2"
          value={2}
          onClick={() => setUseMap(false)}
        >
          Enter Coordinates
        </ToggleButton>
      </ToggleButtonGroup>

      {useMap ? (
        <MapPicker
          initialViewport={mapLocation}
          onLocationSelect={handleLocationSelect}
        />
      ) : (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                {...register("location.lat")}
                isInvalid={!!errors.location?.lat}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.lat?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                step="any"
                {...register("location.long")}
                isInvalid={!!errors.location?.long}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.long?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      )}
    </Form.Group>
  );
};

export default LocationPicker;