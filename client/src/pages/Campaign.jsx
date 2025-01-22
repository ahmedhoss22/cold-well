import React, { useState } from 'react'
import "../styles/campaign.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import logo from '../assets/logo.png'
import building from '../assets/2-Photoroom.png'
import Stack from 'react-bootstrap/Stack';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Image from 'react-bootstrap/Image';
import Api from '../Api/ApiCalls';
import { notifySuccess } from '../components/Admin/Toaster';
import { Col, Row } from 'react-bootstrap';

const Campaign = () => {
  const [checked, setChecked] = useState("Appartment");
  const [name, setname] = useState();
  const [phone, setphone] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await Api.post("/requests/contact", { name, phone, type: checked });
      setChecked("Appartment");
      setname("");
      setphone("");
      notifySuccess("Thank you for your interest, we will contact you soon")
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)

    }
  }
  const handleToggle = (value) => {
    setChecked(value);
  };
  function handleClick(){
    window.location.href = "https://cb-newalex.com/en/"
  }

  return (
    <div className='campaign-bg'>
      <Stack align="center" justify="center">
        <Image src={logo} alt='logo' width={"350px"} height={"120px"} style={{ margin: "0 auto", transform: "translateY(-30px)" ,cursor:"pointer" }} onClick={handleClick}/>
        <Stack align="center" justify="center" direction="horizontal" className="d-flex flex-column flex-md-row">
          <Row>
            {/* <Col xs={12} md={6} >
              <Image
                src={building}
                alt="logo"
                className="img-fluid custom-image"
                style={{ flexGrow: 1 }}
                fluid
                sx={{ width: "10%", height: "auto" }}
              />
            </Col> */}
            <h3 style={{margin:"16px 0 100px",color:"#01216a"}}>Choose your unit</h3>
            <Col xs={12} >
              <div className="campaign-container" style={{ flexGrow: 1 }}>
                <Form onSubmit={handleSubmit}>

                  <ButtonGroup className="mb-2" style={{ width: "100%" }}>
                    <ToggleButton
                      id="toggle-apartment"
                      type="radio" // Change to radio because they are mutually exclusive
                      variant="primary"
                      checked={checked === "Appartment"}
                      style={{ margin: "0 5px",width:"50%",borderRadius:"8px" }}
                      value="Appartment"
                      onChange={(e) => handleToggle(e.currentTarget.value)}
                    >
                      Appartment
                    </ToggleButton>
                    <ToggleButton
                      id="toggle-villa"
                      type="radio" // Change to radio to pair with the other button
                      variant="primary"
                      checked={checked === "Villa"}
                      style={{ width:"50%",borderRadius:"8px" }}
                      value="Villa"
                      onChange={(e) => handleToggle(e.currentTarget.value)}
                    >
                      Villa
                    </ToggleButton>
                  </ButtonGroup>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ color: "#000" }}>Name</Form.Label>
                    <Form.Control value={name} onChange={(e) => setname(e.target.value)} type="text" placeholder="Name" required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ color: "#000" }}>Phone Number</Form.Label>
                    <Form.Control value={phone} onChange={(e) => setphone(e.target.value)} type="number" placeholder="Phone Number" required />
                  </Form.Group>

                  <Button variant="primary" type="submit" style={{marginTop:"20px",width:"100%"}}>
                    Submit
                  </Button>

                </Form>
              </div>
            </Col>
          </Row>
        </Stack>
      <Stack direction='horizontal' className="d-flex flex-column flex-md-row" style={{marginTop:"50px"}}>
        <div style={{margin:"20px 0"}}>
          <h3>Address</h3>
          14 May Road,Hilton st. Green Plaza<br/>, El maameron Plaza Muruj <br/>Smouha, Alexandria
        </div>
      </Stack>
      </Stack>
    </div>
  )
}

export default Campaign