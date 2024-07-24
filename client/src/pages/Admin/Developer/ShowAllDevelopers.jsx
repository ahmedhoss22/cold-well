import React, { useEffect, useState } from 'react'
import Api from '../../../Api/ApiCalls'
import { Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdDelete, MdEdit } from 'react-icons/md'
import { DeleteModal } from '../../../components/Admin'
import { notifyError, notifySuccess } from '../../../components/Admin/Toaster'
const fetchDevelopers = async () => {
  const response = await Api.get('/developer/get-all')

  return response.data.data
}
export default function ShowAllDevelopers() {
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [developerToDelete, setDeveloperToDelete] = useState(null)
  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        const data = await fetchDevelopers()

        setDevelopers(data)
      } catch (error) {
 
        console.error('Failed to fetch developers', error)
      } finally {
        setLoading(false)
      }
    }
    loadDevelopers()
  }, [])

  if (loading) {
    return (
      <div className=" position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />;
      </div>
    )
  }
  function getFirstTwoWords(text) {
    const words = text.split(' ')
    return words.slice(0, 2).join(' ')
  }
  const handleDeleteClick = (area) => {
    setDeveloperToDelete(area)
    setShowDeleteModal(true)
  }

  const handleCloseModal = () => {
    setShowDeleteModal(false)
    setDeveloperToDelete(null)
  }

  const handleDelete = async () => {
    if (developerToDelete) {
      try {
        await Api.delete(`/developer/delete/${developerToDelete._id}`)
        setDevelopers(
          developers.filter(
            (developer) => developer._id !== developerToDelete._id
          )
        )
        notifySuccess('successfully deleted..!')
        handleCloseModal()
      } catch (error) {
        notifyError('Failed to delete developer')
        console.error('Failed to delete developer', error)
      }
    }
  }

  return (
    <React.Fragment>
      <h3 className=" fs-3">All Developers</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Properties</th>
            <th>Compounds</th>
            <th>Launches</th>
            <th>Call Us Number</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {developers?.map((developer, index) => (
            <tr key={developer?._id}>
              <td>{index + 1}</td>
              <td>{getFirstTwoWords(developer?.name?.ar)}</td>
              <td>{developer?.properties?.length}</td>
              <td>{developer?.compounds?.length}</td>
              <td>{developer?.launches?.length}</td>
              <td>{developer?.callUsNumber}</td>
              <td>
                <div className="d-flex justify-content-between">
                  <Link to={`/admin/update-developer/${developer?._id}`}>
                    <MdEdit size={22} />
                  </Link>
                  <MdDelete
                    size={22}
                    onClick={() => handleDeleteClick(developer)}
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
        itemName="developer"
      />
    </React.Fragment>
  )
}
