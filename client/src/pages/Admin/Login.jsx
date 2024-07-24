import React, { useState } from 'react'
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from 'react-bootstrap'
import CookiesService from '../../Services/CookiesProvider'
import Api from '../../Api/ApiCalls'
import { toast } from 'react-toastify'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      setError('Please fill in both fields')
      return
    }

    // Reset error
    setError('')
    try {
      setLoading(true)
      const response = await Api.post('/auth/login', { email, password })
      const date = new Date()
      const IN_DAYS = 2
      const EXPIRES_IN_DAYS = 1000 * 60 * 60 * 24 * IN_DAYS
      date.setTime(date.getTime() + EXPIRES_IN_DAYS)
      const options = { path: '/', expires: date }
      CookiesService.set('cd-token', response.data.data, options)
      setTimeout(() => {
        navigate('/admin')
      }, 1000)
    } catch (error) {
      if (error.response.data.code == 400) {
        toast.error(error.response.data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="w-100 bg-white shadow rounded-2"
        style={{ maxWidth: '400px', padding: '20px' }}
      >
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                className={
                  showPassword ? 'eye-password eye-visible' : 'eye-password'
                }
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button className="eye-button" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeOff className="icon" />
                ) : (
                  <Eye className="icon" />
                )}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="output"
                  aria-hidden="true"
                />{' '}
                Loading...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Form>
      </div>
    </Container>
  )
}

export default Login
