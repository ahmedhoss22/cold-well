import React, { useEffect, useState } from 'react'
import Api from '../../../Api/ApiCalls'
import { Spinner, Table, Form, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MdDelete, MdEdit } from 'react-icons/md'
import { DeleteModal } from '../../../components/Admin'
import { notifyError, notifySuccess } from '../../../components/Admin/Toaster'

const fetchOffers = async () => {
  const { data } = await Api.get('/offers/get-all')
  return data.data
}

export default function ShowAllOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await fetchOffers()
        setOffers(data)
      } catch (error) {
        console.error('Failed to fetch offers', error)
      } finally {
        setLoading(false)
      }
    }
    loadOffers()
  }, [])

  if (loading) {
    return (
      <div className=" position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />;
      </div>
    )
  }

  const handleDeleteClick = (offer) => {
    setOfferToDelete(offer)
    setShowDeleteModal(true)
  }

  const handleCloseModal = () => {
    setShowDeleteModal(false)
    setOfferToDelete(null)
  }

  const handleDelete = async () => {
    if (offerToDelete) {
      try {
        await Api.delete(`/offers/delete-one/${offerToDelete._id}`)
        setOffers(offers.filter((offer) => offer._id !== offerToDelete._id))
        notifySuccess('Successfully deleted!')
        handleCloseModal()
      } catch (error) {
        notifyError('Failed to delete offer')
        console.error('Failed to delete offer', error)
      }
    }
  }

  const filteredOffers = offers?.filter((offer) =>
    offer.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <React.Fragment>
      <Row className="mb-3 d-flex justify-content-end">
        <Col xs={3} >
          <Form.Control
            type="text"
            placeholder="Search by Reference Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Reference Number</th>
              <th>Offer Name</th>
              <th>Developer</th>
              <th>WhatsApp</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers?.map((offer, index) => (
              <tr key={offer._id}>
                <td>{index + 1}</td>
                <td>{offer?.referenceNumber}</td>
                <td>{offer?.offerName.en}</td>
                <td>{offer?.developer.map((dev) => dev?.name?.en).join(', ')}</td>
                <td>{offer?.whatsapp}</td>
                <td>
                  <div className="d-flex justify-content-between">
                    <Link to={`/admin/update-offer/${offer._id}`}>
                      <MdEdit size={22} />
                    </Link>
                    <MdDelete
                      size={22}
                      onClick={() => handleDeleteClick(offer)}
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
        itemName="offer"
      />
    </React.Fragment>
  )
}
