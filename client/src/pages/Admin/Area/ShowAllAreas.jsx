import React, { useEffect, useState } from 'react'
import { Table, Spinner } from 'react-bootstrap'

import Api from '../../../Api/ApiCalls'
import { MdDelete, MdEdit } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { DeleteModal } from '../../../components/Admin'
const fetchAreas = async () => {
  const response = await Api.get('/area/get-all')
  return response.data.data
}
export default function ShowAllAreas() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [areaToDelete, setAreaToDelete] = useState(null)

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const data = await fetchAreas()
        setAreas(data)
      } catch (error) {
        console.error('Failed to fetch areas', error)
      } finally {
        setLoading(false)
      }
    }

    loadAreas()
  }, [])

  if (loading) {
    return (
      <div className=" position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />
      </div>
    )
  }
  function getFirstTwoWords(text) {
    const words = text.split(' ')
    return words.slice(0, 2).join(' ')
  }

  const handleDeleteClick = (area) => {
    setAreaToDelete(area)
    setShowDeleteModal(true)
  }

  const handleCloseModal = () => {
    setShowDeleteModal(false)
    setAreaToDelete(null)
  }

  const handleDelete = async () => {
    if (areaToDelete) {
      try {
        await Api.delete(`/area/delete/${areaToDelete._id}`)
        setAreas(areas.filter((area) => area._id !== areaToDelete._id))
        handleCloseModal()
      } catch (error) {
        console.error('Failed to delete area', error)
        // Handle error (show error message to user)
      }
    }
  }

  return (
    <React.Fragment>
      <h3 className=" fs-3">Show All Areas</h3>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Title (AR)</th>
              <th>Properties</th>
              <th>Developers</th>
              <th>Compounds</th>
              <th>Call Us Number</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {areas?.map((area, index) => (
              <tr key={area._id}>
                <td>{index + 1}</td>
                <td>{getFirstTwoWords(area.title.ar)}</td>
                <td>{area.propertiesAvailable}</td>
                <td>{area.developers.length}</td>
                <td>{area.compounds.length}</td>

                <td>{area.callUsNumber}</td>
                <td>
                  <div className="d-flex justify-content-between">
                    <Link to={`/admin/update-area/${area._id}`}>
                      <MdEdit size={22} />
                    </Link>
                    <MdDelete
                      size={22}
                      onClick={() => handleDeleteClick(area)}
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
          itemName="area"
        />
      </div>{' '}
    </React.Fragment>
  )
}
