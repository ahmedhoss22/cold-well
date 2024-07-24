import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import Api from '../../../Api/ApiCalls'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import {
  notify,
  notifyError,
  notifySuccess,
} from '../../../components/Admin/Toaster'
import LoadingButton from '../../../components/Admin/LoadingButton'
import { useNavigate } from 'react-router-dom'

const schema = Joi.object({
  name: Joi.object({
    en: Joi.string().required().messages({
      'string.empty': 'Name (English) is required',
    }),
    ar: Joi.string().required().messages({
      'string.empty': 'Name (Arabic) is required',
    }),
  }).required(),
})
export default function CreateType() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  })

  const [buttonLoading, setButtonLoading] = useState(false)
  const navigate = useNavigate() 
  const onSubmit = async (data) => {
    try {
      setButtonLoading(true)
      await Api.post('/type/create', data)
      notifySuccess()
    
      setTimeout(() => {
              navigate(-1);
            }, 500);
    } catch (error) {
      notifyError('Error creating type')
      console.error('Error creating type:', error)
    } finally {
      setButtonLoading(false)
    }
  }

  return (
    <Container>
      <h3 className=" fs-3">Create Type</h3>
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
        <LoadingButton loading={buttonLoading} text={'Create Type'} />
      </Form>
    </Container>
  )
}
