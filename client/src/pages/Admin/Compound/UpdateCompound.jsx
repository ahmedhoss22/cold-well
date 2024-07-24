import React, { useEffect, useState } from 'react'
import {
  Col,
  Container,
  Form,
  Row,
  ToggleButton,
  ToggleButtonGroup,
  Spinner,
} from 'react-bootstrap'
import Joi from 'joi'
import { useForm, Controller } from 'react-hook-form'
import { ImageUploader, MapPicker } from '../../../components/Admin'
import { joiResolver } from '@hookform/resolvers/joi'
import ReactQuill from 'react-quill'

import Api from '../../../Api/ApiCalls'
import { notifyError, notifySuccess } from '../../../components/Admin/Toaster'
import LoadingButton from '../../../components/Admin/LoadingButton'
import { useNavigate, useParams } from 'react-router-dom'

const multiLanguageSchema = Joi.object({
  en: Joi.string().required().messages({
    'string.base': 'English text must be a string',
    'string.empty': 'English text is required',
    'any.required': 'English text is required',
  }),
  ar: Joi.string().required().messages({
    'string.base': 'Arabic text must be a string',
    'string.empty': 'Arabic text is required',
    'any.required': 'Arabic text is required',
  }),
})

const locationSchema = Joi.object({
  lat: Joi.number().required().messages({
    'number.base': 'Latitude must be a number',
    'any.required': 'Latitude is required',
  }),
  lng: Joi.number().required().messages({
    'number.base': 'Longitude must be a number',
    'any.required': 'Longitude is required',
  }),
})

const compoundSchema = Joi.object({
  contactUsNumber: Joi.number().required().messages({
    'number.base': 'Contact Us Number must be a number',
    'any.required': 'Contact Us Number is required',
  }),
  name: multiLanguageSchema,
  description: multiLanguageSchema,
  location: locationSchema,
  area: Joi.string().required().label('Area'),
  developer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'array.base': 'Developer must be an array',
      'string.pattern.base': 'Developer ID must be a valid ObjectId',
    }),
})

export default function UpdateCompound() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(compoundSchema),
  })
  const [areas, setAreas] = useState([])
  const [developers, setDevelopers] = useState([])
  const [useRichTextEditor, setUseRichTextEditor] = useState(true)
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState(null)
  const [useMap, setUseMap] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mapLocation, setMapLocation] = useState({
    longitude: 31.23586166241668,
    latitude: 30.04426189357251,
    zoom: 5,
  })
  const [compound, setCompound] = useState(null)
  const [oldImages, setOldImages] = useState(true)
  const [oldThumbnail, setOldThumbnail] = useState(true)
  const fetchData = async () => {
    try {
      const areasResponse = await Api.get('/area/get-names')
      const developersResponse = await Api.get('/developer/get-names')
      const compoundResponse = await Api.get(`/compound/get/${id}`)
      const data = compoundResponse.data.data.compound
      setAreas(areasResponse.data.data)
      setDevelopers(developersResponse.data.data)
      setCompound(data)
      setValue('name.en', data.name.en)
      setValue('name.ar', data.name.ar)
      setValue('description.en', data.description.en)
      setValue('description.ar', data.description.ar)
      setValue('contactUsNumber', data.contactUsNumber)
      setValue('location.lat', data.location.lat)
      setValue('location.lng', data.location.lng)
      setMapLocation({
        latitude: data.location.lat,
        longitude: data.location.lng,
        zoom: 5,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleFilesSelect = (files) => {
    setImages(files)
    setOldImages(false)
  }
  const handleThumbnailSelect = (file) => {
    setThumbnail(file)
    setOldThumbnail(false)
  }

  const handleLocationSelect = ({ latitude, longitude }) => {
    setValue('location.lat', latitude)
    setValue('location.lng', longitude)
    setMapLocation((prevState) => ({ ...prevState, latitude, longitude }))
  }
  useEffect(() => {
if (compound) {
  setValue('developer', compound?.developer[0]?._id)
  setValue('area', compound?.area[0]?._id)
    }
  }, [compound])
  const onSubmit = async (data) => {
    try {
      setButtonLoading(true)
      const formData = new FormData()
      images.forEach((image) => {
        formData.append('images', image)
      })
      formData.append('contactUsNumber', data.contactUsNumber)
      formData.append('name.en', data.name.en)
      formData.append('name.ar', data.name.ar)
      formData.append('description.en', data.description.en)
      formData.append('description.ar', data.description.ar)
      formData.append('location.lat', data.location.lat)
      formData.append('location.lng', data.location.lng)
      formData.append('area[0]', data.area)
      formData.append('developer[0]', data.developer)
      if (thumbnail) {
        formData.append('thumbnail', thumbnail[0])
      }

      await Api.put(`/compound/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      notifySuccess('Compound updated successfully')
      setTimeout(() => {
        navigate(-1)
      }, 500)
    } catch (error) {
      notifyError()
      console.error('Form submission error:', error)
    } finally {
      setButtonLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <Container>
      <h3 className="fs-3">Update Compound</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name (English)</Form.Label>
              <Form.Control
                type="text"
                {...register('name.en')}
                isInvalid={!!errors.name?.en}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name (Arabic)</Form.Label>
              <Form.Control
                type="text"
                {...register('name.ar')}
                isInvalid={!!errors.name?.ar}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Area</Form.Label>
              <Form.Control
                as="select"
                {...register('area')}
                isInvalid={!!errors.area}
              >
                <option value="" disabled>
                  Select Area
                </option>
                {areas.map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.name.en}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.area?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Developer</Form.Label>
              <Form.Control
                as="select"
                {...register('developer')}
                isInvalid={!!errors.developer}
                defaultValue={id}
              >
                <option value="" disabled>
                  Select Developer
                </option>
                {developers?.map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.name.en}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.developer?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <ToggleButtonGroup
          type="radio"
          name="richTextEditorOptions"
          defaultValue={useRichTextEditor ? 1 : 2}
          className="mb-3 row d-flex px-3"
        >
          <ToggleButton
            id="tbg-radio-1"
            value={1}
            variant="outline-primary"
            onClick={() => setUseRichTextEditor(true)}
            className={`px-4 col-6 py-2 ${useRichTextEditor ? 'active' : ''}`}
          >
            Enable Text Editor
          </ToggleButton>
          <ToggleButton
            id="tbg-radio-2"
            value={2}
            variant="outline-secondary"
            onClick={() => setUseRichTextEditor(false)}
            className={`px-4 col-6 py-2 ${!useRichTextEditor ? 'active' : ''}`}
          >
            Disable Text Editor
          </ToggleButton>
        </ToggleButtonGroup>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Description (English)</Form.Label>
              {useRichTextEditor ? (
                <ReactQuill
                  theme="snow"
                  value={watch('description.en') || ''}
                  onChange={(value) => setValue('description.en', value)}
                  onBlur={() => {}}
                />
              ) : (
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register('description.en')}
                  isInvalid={!!errors.description?.en}
                />
              )}
              <Form.Control.Feedback type="invalid">
                {errors.description?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Description (Arabic)</Form.Label>
              {useRichTextEditor ? (
                <ReactQuill
                  theme="snow"
                  value={watch('description.ar') || ''}
                  onChange={(value) => setValue('description.ar', value)}
                  onBlur={() => {}}
                />
              ) : (
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register('description.ar')}
                  isInvalid={!!errors.description?.ar}
                />
              )}
              <Form.Control.Feedback type="invalid">
                {errors.description?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="my-3">
          <ToggleButtonGroup
            type="radio"
            name="locationOptions"
            defaultValue={useMap ? 3 : 4}
            className="row d-flex px-3"
          >
            <ToggleButton
              id="tbg-radio-3"
              value={3}
              variant="outline-primary"
              onClick={() => setUseMap(true)}
              className={`px-4 col-6  py-2 ${useMap ? 'active' : ''}`}
            >
              Map
            </ToggleButton>
            <ToggleButton
              id="tbg-radio-4"
              value={4}
              onClick={() => setUseMap(false)}
              variant="outline-secondary"
              className={`px-4 col-6 py-2 ${!useMap ? 'active' : ''}`}
            >
              Coordinates
            </ToggleButton>
          </ToggleButtonGroup>
        </Form.Group>

        <Row className=" px-2">
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
                    {...register('location.lat')}
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
                    {...register('location.lng')}
                    isInvalid={!!errors.location?.lng}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.location?.lng?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          )}
        </Row>
        <Form.Group className="my-3">
          <Form.Label>Contact Us Number</Form.Label>
          <Form.Control
            type="number"
            {...register('contactUsNumber')}
            isInvalid={!!errors.contactUsNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.contactUsNumber?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label>Upload Images</Form.Label>
          <ImageUploader
            maxImages={6}
            name="images"
            onFilesSelect={handleFilesSelect}
            defaultImages={compound.images}
          />
        </Form.Group>
        <Row className=" p-3">
          {oldImages &&
            compound?.images?.map((item, index) => (
              <img
                key={index + 1}
                src={`${import.meta.env.VITE_IMAGE_ORIGIN}/${item.url}`}
                alt="Developer"
                className="img-fluid mb-3 shadow rounded-2"
                style={{ width: '150px' }}
              />
            ))}
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Upload Thumbnail</Form.Label>
          <ImageUploader
            maxImages={1}
            name="thumbnail"
            onFilesSelect={handleThumbnailSelect}
            defaultImages={compound.thumbnail}
          />
        </Form.Group>
        <Row className=" p-3">
          {oldThumbnail &&
            compound?.thumbnail?.map((item, index) => (
              <img
                key={index + 1}
                src={`${import.meta.env.VITE_IMAGE_ORIGIN}/${item.url}`}
                alt="thumbnail"
                className="img-fluid mb-3 shadow rounded-2"
                style={{ width: '150px' }}
              />
            ))}
        </Row>
        <LoadingButton loading={buttonLoading} text={'Update Compound'} />
      </Form>
    </Container>
  )
}
