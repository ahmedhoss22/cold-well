import React, { useEffect, useState } from 'react'
import Api from '../../../Api/ApiCalls'
import { Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdDelete, MdEdit } from 'react-icons/md'
import { DeleteModal } from '../../../components/Admin'
import { notifyError, notifySuccess } from '../../../components/Admin/Toaster'

const fetchProperties = async () => {
  const response = await Api.get('/property/get-all')
  return response.data.data
}

export default function ShowAllProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState(null)

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetchProperties()

        setProperties(data)
      } catch (error) {
        console.error('Failed to fetch properties', error)
      } finally {
        setLoading(false)
      }
    }
    loadProperties()
  }, [])

  if (loading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />
      </div>
    )
  }

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property)
    setShowDeleteModal(true)
  }

  const handleCloseModal = () => {
    setShowDeleteModal(false)
    setPropertyToDelete(null)
  }

  const handleDelete = async () => {
    if (propertyToDelete) {
      try {
        await Api.delete(`/property/delete/${propertyToDelete._id}`)
        setProperties(
          properties.filter(
            (property) => property._id !== propertyToDelete._id
          )
        )
        notifySuccess('Successfully deleted property!')
        handleCloseModal()
      } catch (error) {
        notifyError('Failed to delete property')
        console.error('Failed to delete property', error)
      }
    }
  }
  function getWords(text,idx) {
    const words = text.split(' ')
    return words.slice(0, idx).join(' ')
  }
  return (
    <React.Fragment>
      <h3 className="fs-3">All Properties</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>For Sale</th>
            <th>For Rent</th>
            <th>Area</th>
            <th>Compound</th>
            <th>Developer</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {properties?.map((property, index) => (
            <tr key={property._id}>
              <td>{index + 1}</td>
              <td>{property?.name?.ar}</td>
              <td>{property?.forSale ? 'Yes' : 'No'}</td>
              <td>{property?.forRent ? 'Yes' : 'No'}</td>
              <td>{getWords(property?.developer?.map(dev => dev.name.ar).join(', '),3)}</td>
              <td>{getWords(property?.compound?.map(dev => dev.name.ar).join(', '),3)}</td>
              <td>{getWords(property?.area?.map(area => area.title.ar).join(', '),3)}</td>
              <td>
                <div className="d-flex justify-content-between">
                  <Link to={`/admin/update-property/${property?._id}`}>
                    <MdEdit size={22} />
                  </Link>
                  <MdDelete
                    size={22}
                    onClick={() => handleDeleteClick(property)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleCloseModal}
        handleDelete={handleDelete}
        itemName="property"
      />
    </React.Fragment>
  )
}
