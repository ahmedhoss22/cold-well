import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { FaHome, FaPhone, FaHandshake } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import Api, {
  FetchAllAreaNames,
  FetchTopCompounds,
  FetchTopTypes,
} from '../Api/ApiCalls'
import { toast } from 'react-toastify'
import Seo from '../Seo'

export default function SellProperty() {
  const { t, i18n } = useTranslation()
  const [areas, setAreas] = useState([])
  const [compounds, setCompounds] = useState([])
  const [types, setTypes] = useState([])
  const { register, handleSubmit, watch } = useForm()
  const fetchData = async () => {
    try {
      const areas = await FetchAllAreaNames()
      const compounds = await FetchTopCompounds()
      const types = await FetchTopTypes()
      setAreas(areas)
      setCompounds(compounds)
      setTypes(types)
    } catch (error) {
      console.error('Error fetching areas:', error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const onSubmit = async (data) => {
    
    const { area, compound, propertyType, ...rest } = data;
    
    const formattedData = {
      ...rest,
      propertyDetails: [
        { area, compound, type: propertyType },
      ],
    };
  
    try {
    const loadingToastId = toast.loading("Submitting your data...");
      const response = await Api.post('/requests/sell-property', formattedData);

      
      toast.update(loadingToastId, {
        render: "Successfully submitted!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.update(loadingToastId, {
        render: error.response?.data?.message || "Failed to submit. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };
  
  return (
    <React.Fragment>
      <Seo/>
        <div className=" container-xxl my-5">
      <Container className=' pt-3' style={{marginTop:"100px",}}>
        <Row className="text-center mb-4">
          <Col>
            <FaHome size={64} className="mb-3"  />
            <h1>{t('sellProperty.title')}</h1>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col md={8} className=" mx-auto">
            <Row>
              <Col md={4} className="mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <FaHome size={48} className="mb-3" />
                    <Card.Title>
                      {t('sellProperty.steps.step1.title')}
                    </Card.Title>
                    <Card.Text>
                      {t('sellProperty.steps.step1.description')}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <FaPhone size={48} className="mb-3" />
                    <Card.Title>
                      {t('sellProperty.steps.step2.title')}
                    </Card.Title>
                    <Card.Text>
                      {t('sellProperty.steps.step2.description')}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <FaHandshake size={48} className="mb-3" />
                    <Card.Title>
                      {t('sellProperty.steps.step3.title')}
                    </Card.Title>
                    <Card.Text>
                      {t('sellProperty.steps.step3.description')}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col md={8} className="mx-auto ">
            <Col>
              <h2 className="text-center">{t('sellProperty.form.title')}</h2>
              <p className="text-center">
                {t('sellProperty.form.description')}
              </p>
            </Col>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Control
                      type="text"
                      placeholder={t('sellProperty.form.inputs.name')}
                      {...register('name', { required: true })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPhoneNumber">
                    <Form.Control
                      type="tel"
                      dir={i18n.dir()}
                      placeholder={t('sellProperty.form.inputs.phoneNumber')}
                      {...register('phone', { required: true })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formLocation">
                    <Form.Control
                      as="select"
                      {...register('area', { required: true })}
                    >
                      <option value="">
                        {t('sellProperty.form.inputs.location')}
                      </option>
                      {areas?.map((area, index) => (
                        <option key={index + 1} value={area._id}>
                          {area.name[i18n.language]}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formCompound">
                    <Form.Control
                      as="select"
                      // disabled={!location}
                      {...register('compound')}
                    >
                      <option value="">
                        {t('sellProperty.form.inputs.compound')}
                      </option>
                      {compounds?.map((comp, index) => (
                        <option key={index + 1} value={comp._id}>
                          {comp.name[i18n.language]}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="formPropertyType">
                <Form.Control
                  as="select"
                  {...register('propertyType', { required: true })}
                >
                  <option value="">
                    {t('sellProperty.form.inputs.propertyType')}
                  </option>
                  {types?.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name[i18n.language]}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder={t('sellProperty.form.inputs.description')}
                  {...register('message', { required: true })}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                {t('sellProperty.form.inputs.submit')}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
    </React.Fragment>
  
  )
}
