import { List, Menu, X } from 'lucide-react'
import '../styles/dashboard.css'
import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  Button,
  Offcanvas,
  Accordion,
} from 'react-bootstrap'
import {
  Outlet,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import CookiesProvider from '../Services/CookiesProvider'

const DashboardLayout = ({ isAuthenticated }) => {
  const navigate = useNavigate()
  const [showSidebar, setShowSidebar] = useState(true)
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  const logOut = () => {
    CookiesProvider.remove('cd-token')
    setTimeout(() => {
      navigate('/admin/login')
    }, 500)
  }
  const toggleSidebar = () => setShowSidebar(!showSidebar)
  return (
    <div className="dashboard-container">
      {/* Header */}
      <Navbar bg="dark" variant="dark" className="">
        <Container fluid>
          <Button
            variant="outline-light"
            className="me-2 d-md-none"
            onClick={toggleSidebar}
          >
            {showSidebar ? <X size={24} /> : <List size={24} />}
          </Button>
          <Navbar.Brand className=" text-white" as={'h2'}>
            Admin Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Link
                as={'span'}
                className=" text-white"
                style={{ cursor: 'pointer' }}
                onClick={() => logOut()}
              >
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>
        <Row className="p-0 w-100">
          {showSidebar && (
            <Col xs={12} sm={12} md={2} className="sidebar shadow">
              <Sidebar />
            </Col>
          )}

          <Col
            md={showSidebar ? 9 : 12}
            lg={showSidebar ? 10 : 12}
            className="mt-2"
          >
            <Outlet />
          </Col>
        </Row>
      </main>
    </div>
  )
}

export default DashboardLayout

function Sidebar({ onLinkClick }) {
  const location = useLocation()

  const links = {
    Area: [
      { to: '/admin/create-area', label: 'Create Area' },
      { to: '/admin/show-all-areas', label: 'Show All Areas' },
    ],
    Developer: [
      { to: '/admin/create-developer', label: 'Create Developer' },
      { to: '/admin/show-all-developers', label: 'Show All Developers' },
    ],
    Compound: [
      { to: '/admin/create-compound', label: 'Create Compound' },
      { to: '/admin/show-all-compounds', label: 'Show All Compounds' },
    ],
    Type: [
      { to: '/admin/create-type', label: 'Create Type' },
      { to: '/admin/show-all-types', label: 'Show All Types' },
    ],
    Property: [
      { to: '/admin/create-property', label: 'Create Property' },
      { to: '/admin/show-all-properties', label: 'Show All Properties' },
    ],
    Launch: [
      { to: '/admin/create-launch', label: 'Create Launch' },
      { to: '/admin/show-all-launches', label: 'Show All Launches' },
    ],
    Offers: [
      { to: '/admin/create-offer', label: 'Create Offer' },
      { to: '/admin/show-all-offers', label: 'Show All Offers' },
    ],
    Requests: [
      { to: '/admin/academy-requests', label: 'Academy Requests' },
      { to: '/admin/contact-requests', label: 'Contact Requests' },
      { to: '/admin/sell-requests', label: 'Sell Property Requests' },
      { to: '/admin/property-requests', label: 'Property Contact Requests' },
    ],
  }

  const renderLinks = (links) =>
    links.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        className={`nav-link p-0 py-2 ${
          location.pathname === `/${link.to}` ? 'active' : ''
        }`}
        onClick={onLinkClick}
      >
        {link.label}
      </Link>
    ))

  const getActiveKey = () => {
    const activePath = location.pathname.replace('/', '')
    return (
      Object.entries(links).find(([key, value]) =>
        value.some((link) => link.to === activePath)
      )?.[0] || ''
    )
  }

  return (
    <Accordion defaultActiveKey={getActiveKey()} className=" w-auto">
      {Object.entries(links).map(([header, linkArray]) => (
        <Accordion.Item eventKey={header} key={header}>
          <Accordion.Header>{header}</Accordion.Header>
          <Accordion.Body>{renderLinks(linkArray)}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
