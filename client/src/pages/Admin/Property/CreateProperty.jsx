import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from 'react-bootstrap'
import Api from '../../../Api/ApiCalls'
import ReactQuill from 'react-quill'
import { ImageUploader, MapPicker } from '../../../components/Admin'
import { toast } from 'react-toastify'
const paymentPlanSchema = Joi.object({
  monthly: Joi.number().required().label('Monthly Payment'),
  downPayment: Joi.number().required().label('Down Payment'),
  duration: Joi.number().required().label('Duration (Years)'),
})
const schema = Joi.object({
  name: Joi.object({
    en: Joi.string().required().label('Name (English)'),
    ar: Joi.string().required().label('Name (Arabic)'),
  }),
  addressLocality: Joi.object({
    en: Joi.string().required().label('Address Locality (English)'),
    ar: Joi.string().required().label('Address Locality (Arabic)'),
  }),
  min_price: Joi.number().required().label('Min Price'),
  max_price: Joi.number().required().label('Max Price'),
  currency: Joi.string().required().label('Currency'),
  reference_No: Joi.number().required().label('reference_No'),
  number_of_bathrooms: Joi.number().required().label('Number of Bathrooms'),
  number_of_bedrooms: Joi.number().required().label('Number of Bedrooms'),
  max_unit_area: Joi.number().required().label('Size'),
  finishing: Joi.string().required().label('Finishing'),
  type: Joi.string().required().label('Property Type'),
  delivery_in: Joi.string().required().label('Delivery In'),
  sale_type: Joi.string().required().label('Sale Type'),
  contactUs: Joi.number().required().label('Contact Us'),
  location: Joi.object({
    lat: Joi.number().required().label('Latitude'),
    lng: Joi.number().required().label('Longitude'),
  }),
  description: Joi.object({
    en: Joi.string().required().label('Description (English)'),
    ar: Joi.string().required().label('Description (Arabic)'),
  }),
  forSale: Joi.boolean(),
  forRent: Joi.boolean(),
  featured: Joi.boolean(),
  resale: Joi.boolean(),
  area: Joi.string().required().label('Area'),
  developer: Joi.string().allow('').optional().label('Developer'),
  compound: Joi.string().required().label('Compound'),
  paymentPlans: Joi.array()
    .items(paymentPlanSchema)
    .min(1)
    .label('Payment Plans'),
})
export default function CreateProperty() {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      paymentPlans: [{ monthly: '', downPayment: '', duration: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paymentPlans',
  })
  const [areas, setAreas] = useState([])
  const [developers, setDevelopers] = useState([])
  const [compound, setCompound] = useState([])
  const [types, setTypes] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const areas = await Api.get('/area/get-names')
        const developer = await Api.get('/developer/get-names')
        const compound = await Api.get('/compound/get-names')
        const types = await Api.get('/type/get-all')
        setAreas(areas.data.data)
        setDevelopers(developer.data.data)
        setCompound(compound.data.data)
        setTypes(types.data.data)
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    }

    fetchData()
  }, [])
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState(null)

  const handleFilesSelect = (files) => {
    setImages(files)
  }
  const handleThumbnailSelect = (file) => {
    setThumbnail(file)
  }
  const [useRichTextEditor, setUseRichTextEditor] = useState(true)
  const [useMap, setUseMap] = useState(true)
  const [mapLocation, setMapLocation] = useState({
    longitude: 31.23586166241668,
    latitude: 30.04426189357251,
    zoom: 5,
  })

  const handleLocationSelect = ({ latitude, longitude }) => {
    setValue('location.lat', latitude)
    setValue('location.lng', longitude)
    setMapLocation((prevState) => ({ ...prevState, latitude, longitude }))
  }
  const onSubmit = async (data) => {
    const loadingToastId = toast.loading('Submitting your data...')
    const formData = new FormData()

    formData.append('name[en]', data.name.en)
    formData.append('name[ar]', data.name.ar)
    formData.append('addressLocality[en]', data.addressLocality.en)
    formData.append('addressLocality[ar]', data.addressLocality.ar)
    formData.append('min_price', data.min_price)
    formData.append('max_price', data.max_price)
    formData.append('currency', data.currency)
    formData.append('number_of_bathrooms', data.number_of_bathrooms)
    formData.append('number_of_bedrooms', data.number_of_bedrooms)
    formData.append('finishing', data.finishing)
    formData.append('resale', data.resale)
    formData.append('delivery_in', data.delivery_in)
    formData.append('sale_type', data.sale_type)
    formData.append('reference_No', data.reference_No)
    formData.append('forSale', data.forSale)
    formData.append('forRent', data.forRent)
    formData.append('featured', data.featured)
    formData.append('contactUs', data.contactUs)
    formData.append('max_unit_area', data.max_unit_area)
    formData.append('location[lat]', data.location.lat)
    formData.append('location[lng]', data.location.lng)
    formData.append('description[en]', data.description.en)
    formData.append('description[ar]', data.description.ar)
    data.paymentPlans.map((plan, index) => {
      formData.append(`paymentPlans[${index}][downPayment]`, plan.downPayment)
      formData.append(`paymentPlans[${index}][duration]`, plan.duration)
      formData.append(`paymentPlans[${index}][monthly]`, plan.monthly)
    })

    formData.append('type[0]', data.type)
    formData.append('area[0]', data.area)
    if (data.developer) {
      formData.append('developer[0]', data.developer)
    }
    formData.append('compound[0]', data.compound)

    images.forEach((image) => formData.append('images', image))
    if (thumbnail) formData.append('thumbnail', thumbnail[0])

    try {
      const response = await Api.post('/property/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      reset()
      setImages([])
      setThumbnail(null)
      toast.update(loadingToastId, {
        render: 'Successfully Created!',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
      })
      console.log('Form submission response:', response.data)
    } catch (error) {
      toast.update(loadingToastId, {
        render: 'Failed to submit. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      })
      console.error('Form submission error:', error)
    }
  }

  return (
    <Container>
      <h3 className=" fs-3">Create Property</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Name (English)</Form.Label>
              <Form.Control
                required
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
              <Form.Label className="required">Name (Arabic)</Form.Label>
              <Form.Control
                type="text"
                required
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
              <Form.Label className="required">
                Address Locality (English)
              </Form.Label>
              <Form.Control
                type="text"
                required
                {...register('addressLocality.en')}
                isInvalid={!!errors.addressLocality?.en}
              />
              <Form.Control.Feedback type="invalid">
                {errors.addressLocality?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="required">
                Address Locality (Arabic)
              </Form.Label>
              <Form.Control
                type="text"
                required
                {...register('addressLocality.ar')}
                isInvalid={!!errors.addressLocality?.ar}
              />
              <Form.Control.Feedback type="invalid">
                {errors.addressLocality?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Form.Group className="mb-3 d-flex gap-2 ">
              <Form.Label className="required">For Sale</Form.Label>
              <Form.Check
                type="checkbox"
                {...register('forSale')}
                isInvalid={!!errors.forSale}
              />
              <Form.Control.Feedback type="invalid">
                {errors.forSale?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3 d-flex gap-2">
              <Form.Label className="required">For Rent</Form.Label>
              <Form.Check
                type="checkbox"
                {...register('forRent')}
                isInvalid={!!errors.forRent}
              />
              <Form.Control.Feedback type="invalid">
                {errors.forRent?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3 d-flex gap-2">
              <Form.Label className="required">Featured</Form.Label>
              <Form.Check
                type="checkbox"
                {...register('featured')}
                isInvalid={!!errors.featured}
              />
              <Form.Control.Feedback type="invalid">
                {errors.featured?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3 d-flex gap-2">
              <Form.Label className="required">Resale</Form.Label>
              <Form.Check
                type="checkbox"
                {...register('resale')}
                isInvalid={!!errors.resale}
              />
              <Form.Control.Feedback type="invalid">
                {errors.resale?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Area</Form.Label>
              <Form.Control
                as="select"
                required
                {...register('area')}
                isInvalid={!!errors.area}
                defaultValue=""
              >
                <option disabled value="">
                  Select Area
                </option>
                {areas?.map((area) => (
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
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Compound</Form.Label>
              <Form.Control
                as="select"
                required
                {...register('compound')}
                isInvalid={!!errors.compound}
                defaultValue=""
              >
                <option disabled value="">
                  Select Compound
                </option>
                {compound?.map((compound) => (
                  <option key={compound._id} value={compound._id}>
                    {compound.name.en}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.compound?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Developer</Form.Label>
              <Form.Control
                as="select"
                {...register('developer')}
                isInvalid={!!errors.developer}
                defaultValue=""
              >
                <option disabled value="">
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
        <Form.Group className="mb-3">
          <Form.Label className="required">reference_No</Form.Label>
          <Form.Control
            type="number"
            required
            {...register('reference_No')}
            isInvalid={!!errors.reference_No}
          />
          <Form.Control.Feedback type="invalid">
            {errors.reference_No?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Min Price</Form.Label>
              <Form.Control
                type="number"
                required
                {...register('min_price')}
                isInvalid={!!errors.min_price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.min_price?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Max Price</Form.Label>
              <Form.Control
                type="number"
                required
                {...register('max_price')}
                isInvalid={!!errors.max_price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.max_price?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col col={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Currency</Form.Label>
              <Form.Control
                as="select"
                required
                {...register('currency')}
                isInvalid={!!errors.currency}
              >
                <option value="">Select Currency</option>
                <option value="Dollar">Dollar</option>
                <option value="EGP">EGP</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.currency?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Number of Bathrooms</Form.Label>
              <Form.Control
                type="number"
                required
                {...register('number_of_bathrooms')}
                isInvalid={!!errors.number_of_bathrooms}
              />
              <Form.Control.Feedback type="invalid">
                {errors.number_of_bathrooms?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Number of Bedrooms</Form.Label>
              <Form.Control
                type="number"
                required
                {...register('number_of_bedrooms')}
                isInvalid={!!errors.number_of_bedrooms}
              />
              <Form.Control.Feedback type="invalid">
                {errors.number_of_bedrooms?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="required">Size</Form.Label>
              <Form.Control
                type="number"
                required
                {...register('max_unit_area')}
                isInvalid={!!errors.max_unit_area}
              />
              <Form.Control.Feedback type="invalid">
                {errors.max_unit_area?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="required">Finishing</Form.Label>
          <Form.Control
            as="select"
            required
            defaultValue=""
            {...register('finishing')}
            isInvalid={!!errors.finishing}
          >
            <option disabled value="">
              Select Finishing
            </option>
            <option value="Not Finished">Not Finished</option>
            <option value="Semi Finished">Semi Finished</option>
            <option value="Finished">Finished</option>
            <option value="Furnished">Furnished</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.finishing?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="required">Property Type</Form.Label>
          <Form.Control
            as="select"
            required
            {...register('type')}
            isInvalid={!!errors.type?.name}
            defaultValue=""
          >
            <option disabled value="">
              Select Type
            </option>
            {types.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name.en}
              </option>
            ))}
          </Form.Control>

          <Form.Control.Feedback type="invalid">
            {errors.property_type?.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="required">Delivery In</Form.Label>
          <Form.Control
            type="text"
            required
            {...register('delivery_in')}
            isInvalid={!!errors.delivery_in}
          />
          <Form.Control.Feedback type="invalid">
            {errors.delivery_in?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="required">Sale Type</Form.Label>
          <Form.Control
            as="select"
            required
            {...register('sale_type')}
            isInvalid={!!errors.sale_type}
            defaultValue=""
          >
            <option value="" disabled>
              Select Sale Type
            </option>
            <option value="Developer Sale">Developer Sale</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.sale_type?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Row className="align-items-center">
          <Col>
            <h2>Payment Plans</h2>
          </Col>
          <Col className="text-end">
            <Button
              variant="secondary"
              onClick={() =>
                append({ monthly: '', downPayment: '', duration: '' })
              }
            >
              Add Payment Plan
            </Button>
          </Col>
        </Row>
        {fields.map((field, index) => (
          <Row key={field.id} className="mb-3 align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="required">Monthly Payment</Form.Label>
                <Form.Control
                  type="number"
                  {...register(`paymentPlans.${index}.monthly`)}
                  isInvalid={!!errors.paymentPlans?.[index]?.monthly}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.paymentPlans?.[index]?.monthly?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="required">Down Payment</Form.Label>
                <Form.Control
                  type="number"
                  {...register(`paymentPlans.${index}.downPayment`)}
                  isInvalid={!!errors.paymentPlans?.[index]?.downPayment}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.paymentPlans?.[index]?.downPayment?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="required">Duration (Years)</Form.Label>
                <Form.Control
                  type="number"
                  {...register(`paymentPlans.${index}.duration`)}
                  isInvalid={!!errors.paymentPlans?.[index]?.duration}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.paymentPlans?.[index]?.duration?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="danger" onClick={() => remove(index)}>
                Remove Plan
              </Button>
            </Col>
          </Row>
        ))}

        <Form.Group className="mb-3">
          <Form.Label className="required">Contact Us</Form.Label>
          <Form.Control
            type="number"
            required
            {...register('contactUs')}
            isInvalid={!!errors.contactUs}
          />
          <Form.Control.Feedback type="invalid">
            {errors.contactUs?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className=" p-3 ">
          <ToggleButtonGroup
            type="radio"
            name="locationOptions"
            defaultValue={useMap ? 1 : 2}
            className="mb-3 row d-flex"
          >
            <ToggleButton
              id="tbg-radio-1"
              value={1}
              variant="outline-primary"
              onClick={() => setUseMap(true)}
              className={`px-4 col-6  py-2 ${useMap ? 'active' : ''}`}
            >
              Choose from Map
            </ToggleButton>
            <ToggleButton
              id="tbg-radio-2"
              value={2}
              onClick={() => setUseMap(false)}
              variant="outline-secondary"
              className={`px-4 col-6 py-2 ${!useMap ? 'active' : ''}`}
            >
              Enter Coordinates
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
                  <Form.Label className="required">Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    required
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
                  <Form.Label className="required">Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    step="any"
                    {...register('location.lng')}
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

        <Form.Group className=" p-3 ">
          <ToggleButtonGroup
            type="radio"
            name="richTextEditorOptions"
            defaultValue={useRichTextEditor ? 1 : 2}
            className="mb-3 row d-flex"
          >
            <ToggleButton
              id="tbg-radio-12"
              value={1}
              variant="outline-primary"
              className={`px-4 col-6  py-2 ${
                useRichTextEditor ? 'active' : ''
              }`}
              onClick={() => setUseRichTextEditor(true)}
            >
              Enable Rich Text Editor
            </ToggleButton>
            <ToggleButton
              id="tbg-radio-22"
              value={2}
              variant="outline-secondary"
              className={`px-4 col-6 py-2 ${
                !useRichTextEditor ? 'active' : ''
              }`}
              onClick={() => setUseRichTextEditor(false)}
            >
              Disable Rich Text Editor
            </ToggleButton>
          </ToggleButtonGroup>
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="required">
                Description (English)
              </Form.Label>
              {useRichTextEditor ? (
                <ReactQuill
                  required
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
              <Form.Label className="required">Description (Arabic)</Form.Label>
              {useRichTextEditor ? (
                <ReactQuill
                  required
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

        <Form.Group className="mb-3">
          <Form.Label className="required">Upload Images</Form.Label>
          <ImageUploader
            maxImages={6}
            required
            name="images"
            onFilesSelect={handleFilesSelect}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="required">Upload Thumbnail</Form.Label>
          <ImageUploader
            maxImages={1}
            required
            name="thumbnail"
            onFilesSelect={handleThumbnailSelect}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Property
        </Button>
      </Form>
    </Container>
  )
}
