import React, { useEffect, useState } from 'react'
import Api from '../../../Api/ApiCalls'
import { Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdDelete, MdEdit } from 'react-icons/md'
import { DeleteModal } from '../../../components/Admin'
import { notifyError, notifySuccess } from '../../../components/Admin/Toaster'
const fetchLaunches = async () => {
  const { data } = await Api.get('/launch/get-all')
  return data.data
}
export default function ShowAllLaunches() {
  const [launches, setLaunches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [launchToDelete, setLaunchToDelete] = useState(null)
  useEffect(() => {
    const loadLaunches = async () => {
      try {
        const data = await fetchLaunches()
        setLaunches(data)
      } catch (error) {
        console.error('Failed to fetch launches', error)
      } finally {
        setLoading(false)
      }
    }
    loadLaunches()
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
    return words.slice(0, 6).join(' ')
  }

  const handleDeleteClick = (launch) => {
    setLaunchToDelete(launch)
    setShowDeleteModal(true)
  }

  const handleCloseModal = () => {
    setShowDeleteModal(false)
    setLaunchToDelete(null)
  }

  const handleDelete = async () => {
    if (launchToDelete) {
      try {
        await Api.delete(`/launch/delete/${launchToDelete._id}`)
        setLaunches(
          launches.filter((launch) => launch._id !== launchToDelete._id)
        )
        notifySuccess('Successfully delete!')
        handleCloseModal()
      } catch (error) {
        notifyError('Failed to delete launch')
        console.error('Failed to delete launch', error)
      }
    }
  }

  return (
    <React.Fragment>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Developer</th>
              <th>Call Us Number</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {launches?.map((launch, index) => (
              <tr key={launch._id}>
                <td>{index + 1}</td>
                <td>{getFirstTwoWords(launch?.launchName?.ar)}</td>
                <td>{launch?.developer?.name?.ar}</td>
                <td>{launch?.developer?.callUsNumber}</td>
                <td>
                  <div className="d-flex justify-content-between">
                    <Link to={`/admin/update-launch/${launch?._id}`}>
                      <MdEdit size={22} />
                    </Link>
                    <MdDelete
                      size={22}
                      onClick={() => handleDeleteClick(launch)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleCloseModal}
        handleDelete={handleDelete}
        itemName="launch"
      />
    </React.Fragment>
  )
}
