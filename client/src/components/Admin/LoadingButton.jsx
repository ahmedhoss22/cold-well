import React from 'react'
import { Button, Spinner } from 'react-bootstrap'

const LoadingButton = ({ loading, text }) => {
  return (
    <Button className=' mt-4' style={{minWidth:"120px"}} variant="primary" type="submit" disabled={loading}>
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="output"
            aria-hidden="true"
          />
          {' '}
          Loading...
        </>
      ) : (
        text
      )}
    </Button>
  )
}

export default LoadingButton
