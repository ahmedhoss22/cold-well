import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import {
  Container,
  Form,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ImageUploader } from '../../../components/Admin'
import Api from '../../../Api/ApiCalls'
import { notifyError, notifySuccess } from '../../../components/Admin/Toaster'
import LoadingButton from '../../../components/Admin/LoadingButton'

// Joi validation schema
const schema = Joi.object({
  name: Joi.object({
    en: Joi.string().required().messages({
      'string.empty': 'Name (English) is required',
    }),
    ar: Joi.string().required().messages({
      'string.empty': 'Name (Arabic) is required',
    }),
  }).required(),
  description: Joi.object({
    en: Joi.string().required().messages({
      'string.empty': 'Description (English) is required',
    }),
    ar: Joi.string().required().messages({
      'string.empty': 'Description (Arabic) is required',
    }),
  }).required(),
  callUsNumber: Joi.string().required().messages({
    'string.empty': 'Call Us Number is required',
  }),
  area: Joi.string().required().label('Area'),
})

export default function CreateDeveloper() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  })
  const [areas, setAreas] = useState([])
  const [developerImages, setDeveloperImages] = useState(null)
  const [useRichTextEditor, setUseRichTextEditor] = useState(true)

  const handleFilesSelect = (files) => {
    setDeveloperImages(files)
  }
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await Api.get('/area/get-names')
        setAreas(response.data.data)
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    }

    fetchAreas()
  }, [])
  const [buttonLoading, setButtonLoading] = useState(false)

  const onSubmit = async (data) => {
    setButtonLoading(true)
    data = {
      ...data,
      images: developerImages[0],
    }

    try {
      await Api.post('/developer/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      notifySuccess()
    } catch (error) {
      notifyError()
      console.error('Form submission error:', error)
    } finally {
      setButtonLoading(false)
    }
  }

  return (
    <Container>
      <h3 className=' fs-3'>Create Developer</h3>
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
          <Form.Group className="mb-3">
            <Form.Label>Area</Form.Label>
            <Form.Control
              as="select"
              {...register('area')}
              isInvalid={!!errors.area}
              defaultValue=""
            >
              <option disabled value="">
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
              <Controller
                name="description.en"
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
              <Form.Label>Description (Arabic)</Form.Label>
              <Controller
                name="description.ar"
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
          <Form.Label>Call Us Number</Form.Label>
          <Form.Control
            type="text"
            {...register('callUsNumber')}
            isInvalid={!!errors.callUsNumber}
          />
          <Form.Control.Feedback type="invalid">
            {errors.callUsNumber?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Developer Image</Form.Label>
          <ImageUploader
            maxImages={1}
            name="images"
            onFilesSelect={handleFilesSelect}
          />
        </Form.Group>
        <LoadingButton loading={buttonLoading} text={'Create Developer'} />
      </Form>
    </Container>
  )
}
