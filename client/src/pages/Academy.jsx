import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Seo from '../Seo'
import { AcademyRequest } from '../Api/ApiCalls'
import { toast } from 'react-toastify'

const Academy = () => {
  const { t , i18n } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async(data) => {
    const loadingToastId = toast.loading("Submitting your data...");
try {
    await AcademyRequest(data)
    toast.update(loadingToastId, {
      render: "Successfully!",
      type: "success",
      isLoading: false,
      autoClose: 1000,
    });
} catch (error) {
  toast.update(loadingToastId, {
    render:
      error.response?.data?.message ||
      'Failed to submit. Please try again.',
    type: 'error',
    isLoading: false,
    autoClose: 5000,
  })
}
  
  }

  return (
    <React.Fragment>
       <Seo
        description={t('PagesDescriptions.academy')}
        page={t('PagesName.academy')}
      />
 

      <Container
        fluid
        className="academy-bg d-flex justify-content-center align-items-center"
      >
        <Row className=' p-5'>
          <Col
            // xs={12}
            md={4}
            // lg={4}
            className="p-4 border rounded shadow bg-white"
          >
            <Row>
              <h3 className="text-center fs-3">{t('Academy.academy')}</h3>
            <p className="text-center">{t('Academy.description')}</p>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formName">
                {/* <Form.Label>{t('Academy.name')}</Form.Label> */}
                <Form.Control
                  type="text"
                  placeholder={t('Academy.name')}
                  {...register('name', { required: t('Academy.nameRequired') })}
                />
                {errors.name && (
                  <span className="text-danger">{errors.name.message}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                {/* <Form.Label>{t('Academy.email')}</Form.Label> */}
                <Form.Control
                  type="email"
                  placeholder={t('Academy.email')}
                  {...register('email', {
                    required: t('Academy.emailRequired'),
                  })}
                />
                {errors.email && (
                  <span className="text-danger">{errors.email.message}</span>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPhone">
                {/* <Form.Label>{t('Academy.phone')}</Form.Label> */}
                <Form.Control
                  type="tel"
                  dir={i18n.dir()}
                  placeholder={t('Academy.phone')}
                  {...register('phone', {
                    required: t('Academy.phoneRequired'),
                  })}
                />
                {errors.phone && (
                  <span className="text-danger">{errors.phone.message}</span>
                )}
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                {t('Academy.registerNow')}
              </Button>
            </Form>
            </Row>
            
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default Academy
