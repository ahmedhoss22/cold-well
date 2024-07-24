import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Api from '../../../Api/ApiCalls'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import { notifyError, notifySuccess } from '../../../components/Admin/Toaster'
import LoadingButton from '../../../components/Admin/LoadingButton'

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

export default function UpdateType() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  })
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(`/type/get/${id}`)
        const data = response.data.data
        setValue('name.en', data.name.en)
        setValue('name.ar', data.name.ar)
      } catch (error) {
        console.error('Error fetching type:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, setValue])
  const onSubmit = async (data) => {
    try {
      setButtonLoading(true)
      await Api.put(`/type/update/${id}`, data)
      notifySuccess('Type updated successfully')
      setTimeout(() => {
        navigate(-1)
      }, 500)
    } catch (error) {
      notifyError('Error updating type')
      console.error('Error updating type:', error)
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
      <h1>Update Type</h1>
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
        <LoadingButton loading={buttonLoading} text={'Update Type'} />
      </Form>
    </Container>
  )
}
