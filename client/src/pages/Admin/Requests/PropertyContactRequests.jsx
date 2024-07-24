import React, { useEffect, useState } from "react";
import Api from "../../../Api/ApiCalls";;
import { Container, Row, Spinner } from "react-bootstrap";
import { renderCategory } from "../../../components/Admin";;
const fetchPropertyContactRequests = async () => {
  const { data } = await Api.get("/requests/property");
  return data.data;
};
export default function PropertyContactRequests() {
  const [propertiesContact, setPropertiesContact] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadPropertyContactRequests = async () => {
    try {
      const data = await fetchPropertyContactRequests();
      setPropertiesContact(data);
    } catch (error) {
      console.error("Failed to fetch property contact requests", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPropertyContactRequests();
  }, []);

  if (loading) {
    return (
      <div className=" position-absolute top-50 start-50 translate-middle">
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <Container>
      <Row>
        {renderCategory(propertiesContact,"Property Messages")}
      </Row>
    </Container>
  )
}
