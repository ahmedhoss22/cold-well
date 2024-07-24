import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import Api from '../../../Api/ApiCalls'
import { notify } from '../../../components/Admin/Toaster'
import { ImageUploader, MapPicker } from '../../../components/Admin'

// Joi validation schema
const schema = Joi.object({
  developer: Joi.string().hex().length(24).required().messages({
    'string.empty': 'Developer is required',
    'string.length': 'Developer ID must be 24 characters long',
  }),

  launchDetails: Joi.object({
    en: Joi.string().optional(),
    ar: Joi.string().optional(),
  }).optional(),

  launchName: Joi.object({
    en: Joi.string().required().messages({
      'string.empty': 'Launch Name (English) is required',
    }),
    ar: Joi.string().required().messages({
      'string.empty': 'Launch Name (Arabic) is required',
    }),
  }).required(),

  location: Joi.object({
    name: Joi.object({
      en: Joi.string().optional(),
      ar: Joi.string().optional(),
    }).optional(),
    latitude: Joi.number().required().messages({
      'number.base': 'Latitude is required',
    }),
    longitude: Joi.number().required().messages({
      'number.base': 'Longitude is required',
    }),
  }).required(),

  description: Joi.object({
    en: Joi.string().optional(),
    ar: Joi.string().optional(),
  }).optional(),
})

export default function CreateLaunch() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  })

  const [video, setVideo] = useState([])
  const [thumbnailFiles, setThumbnailFiles] = useState([])
  const [useRichTextEditor, setUseRichTextEditor] = useState(true)
  const [useRichTextEditor2, setUseRichTextEditor2] = useState(true)

  const handleVideoFilesSelect = (files) => {
    setVideo(files)
  }

  const handleThumbnailFilesSelect = (files) => {
    setThumbnailFiles(files)
  }
  const [developers, setDevelopers] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const developer = await Api.get('/developer/get-names')
        setDevelopers(developer.data.data)
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    }

    fetchData()
  }, [])

  const [useMap, setUseMap] = useState(true)
  const [mapLocation, setMapLocation] = useState({
    longitude: 31.23586166241668,
    latitude: 30.04426189357251,
    zoom: 5,
  })

  const handleLocationSelect = ({ latitude, longitude }) => {
    setValue('location.latitude', latitude)
    setValue('location.longitude', longitude)
    setMapLocation((prevState) => ({ ...prevState, latitude, longitude }))
  }

  const onSubmit = async (data) => {
    const formData = new FormData()

    formData.append('launchName[ar]', data.launchName.ar)
    formData.append('launchName[en]', data.launchName.en)
    formData.append('location[latitude]', data.location.latitude)
    formData.append('location[longitude]', data.location.longitude)
    formData.append('location[name][en]', data.location.name.en)
    formData.append('location[name][ar]', data.location.name.ar)
    formData.append('description[en]', data.description.en)
    formData.append('description[ar]', data.description.ar)
    formData.append('launchDetails[en]', data.launchDetails.en)
    formData.append('launchDetails[ar]', data.launchDetails.ar)
    if (data.developer) {
      formData.append('developer[0]', data.developer)
    }
    video.forEach((image) => formData.append('video', image))
    if (thumbnailFiles) formData.append('thumbnail', thumbnailFiles[0])

    try {
      const response = await Api.post('/launch/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      reset()
      setVideo([])
      setThumbnailFiles([])
      notify()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Container>
      <h3 className=" fs-3">Create Launch</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Launch Name (English)</Form.Label>
              <Form.Control
                type="text"
                {...register('launchName.en')}
                isInvalid={!!errors.launchName?.en}
              />
              <Form.Control.Feedback type="invalid">
                {errors.launchName?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Launch Name (Arabic)</Form.Label>
              <Form.Control
                type="text"
                {...register('launchName.ar')}
                isInvalid={!!errors.launchName?.ar}
              />
              <Form.Control.Feedback type="invalid">
                {errors.launchName?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Developer</Form.Label>
              <Form.Control
                as="select"
                {...register('developer')}
                isInvalid={!!errors.developer}
              >
                <option value="">Select Developer</option>
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
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Location Name (English)</Form.Label>
              <Form.Control
                type="text"
                {...register('location.name.en')}
                isInvalid={!!errors.location?.name?.en}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.name?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Location Name (Arabic)</Form.Label>
              <Form.Control
                type="text"
                {...register('location.name.ar')}
                isInvalid={!!errors.location?.name?.ar}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.name?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group className="mt-3">
            <ToggleButtonGroup
              type="radio"
              name="richTextEditorOptions"
              defaultValue={useRichTextEditor ? 1 : 2}
              className="mb-3 row d-flex"
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
          </Form.Group>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Launch Details (English)</Form.Label>
              <Controller
                name="launchDetails.en"
                control={control}
                render={({ field }) =>
                  useRichTextEditor ? (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  ) : (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      {...field}
                      isInvalid={!!errors.launchDetails?.en}
                    />
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.launchDetails?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Launch Details (Arabic)</Form.Label>
              <Controller
                name="launchDetails.ar"
                control={control}
                render={({ field }) =>
                  useRichTextEditor ? (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  ) : (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      {...field}
                      isInvalid={!!errors.launchDetails?.ar}
                    />
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.launchDetails?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group className="mt-3">
            <ToggleButtonGroup
              type="radio"
              name="locationOptions"
              defaultValue={useMap ? 3 : 4}
              className="row d-flex px-2"
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
          <Form.Group className="my-3">
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
                      {...register('location.latitude')}
                      isInvalid={!!errors.location?.latitude}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.location?.latitude?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      {...register('location.longitude')}
                      isInvalid={!!errors.location?.longitude}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.location?.longitude?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form.Group>
        </Row>

        <Row>
          <Form.Group className="mt-3">
            <ToggleButtonGroup
              type="radio"
              name="richTextEditorOptions"
              defaultValue={useRichTextEditor ? 1 : 2}
              className="mb-3 row d-flex"
            >
              <ToggleButton
                id="tbg-radio-5"
                value={5}
                variant="outline-primary"
                onClick={() => setUseRichTextEditor2(true)}
                className={`px-4 col-6 py-2 ${useRichTextEditor2 ? 'active' : ''}`}
              >
                Enable Text Editor
              </ToggleButton>
              <ToggleButton
                id="tbg-radio-6"
                value={6}
                variant="outline-secondary"
                onClick={() => setUseRichTextEditor2(false)}
                className={`px-4 col-6 py-2 ${!useRichTextEditor2 ? 'active' : ''}`}
              >
                Disable Text Editor
              </ToggleButton>
            </ToggleButtonGroup>
          </Form.Group>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Launch Description (English)</Form.Label>
              <Controller
                name="description.en"
                control={control}
                render={({ field }) =>
                  useRichTextEditor2 ? (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  ) : (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      {...field}
                      isInvalid={!!errors.description?.en}
                    />
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Launch Description (Arabic)</Form.Label>
              <Controller
                name="description.ar"
                control={control}
                render={({ field }) =>
                  useRichTextEditor2 ? (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  ) : (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      {...field}
                      isInvalid={!!errors.description?.ar}
                    />
                  )
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Upload Video</Form.Label>
          <ImageUploader
            maxImages={1}
            name="video"
            onFilesSelect={handleVideoFilesSelect}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Upload Thumbnail</Form.Label>
          <ImageUploader
            maxImages={5}
            name="thumbnail"
            onFilesSelect={handleThumbnailFilesSelect}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Launch
        </Button>
      </Form>
    </Container>
  )
}
