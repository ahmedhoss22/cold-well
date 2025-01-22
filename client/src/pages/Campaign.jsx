import React from 'react'
import "../styles/campaign.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
const Campaign = () => {
  return (
    <div className='campaign-bg'>
      <div className="campaign-container">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="number" placeholder="Phone Number" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Campaign