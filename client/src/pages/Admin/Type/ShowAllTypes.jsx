import React, { useEffect, useState } from 'react'
import Api from '../../../Api/ApiCalls'
import { Spinner, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdDelete, MdEdit } from 'react-icons/md'
import { DeleteModal } from '../../../components/Admin'
const fetchTypes = async () => {
  const { data } = await Api.get('/type/get-all')
  return data.data
}
export default function ShowAllTypes() {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeToDelete,setTypeToDelete] = useState(null)
  const [showDeleteModal,setShowDeleteModal] = useState(null)
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTypes()
        console.table(data)
        setTypes(data)
      } catch (error) {
        console.error('Failed to fetch types', error)
      } finally {
        setLoading(false)
      }
    }
    loadTypes()
  }, [])
  if (loading) {
    return (
      <div className=" position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />;
      </div>
    )
  }
 
const handleDeleteClick = (area) => {
    setTypeToDelete(area)
    setShowDeleteModal(true)
  }

  const handleCloseModal = () => {
    setShowDeleteModal(false)
    setTypeToDelete(null)
  }

  const handleDelete = async () => {
    if (typeToDelete) {
      try {
        await Api.delete(`/type/delete/${typeToDelete._id}`)
        setTypes(
          types.filter(
            (type) => type._id !== typeToDelete._id
          )
        )
        notifySuccess('successfully deleted..!')
        handleCloseModal()
      } catch (error) {
        notifyError('Failed to delete type')
        console.error('Failed to delete type', error)
      }
    }
  }

  function getFirstTwoWords(text) {
    const words = text.split(' ')
    return words.slice(0, 2).join(' ')
  }
  return (
    <React.Fragment>
      <h3 className=" fs-3">All Types</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name (Ar)</th>
            <th>Name (En)</th>
            <th>Properties</th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {types?.map((type, index) => (
            <tr key={type._id}>
              <td>{index + 1}</td>
              <td>{getFirstTwoWords(type?.name.ar)}</td>
              <td>{getFirstTwoWords(type?.name.en)}</td>
              <td>{type?.propertiesCount}</td>
              <td>
                <div className="d-flex justify-content-between">
                  <Link to={`/admin/update-type/${type?._id}`}>
                    <MdEdit size={22} />
                  </Link>
                  <MdDelete
                    size={22}
                    onClick={() => handleDeleteClick(type)}
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
        itemName="type"
      />
    </React.Fragment>
  )
}
