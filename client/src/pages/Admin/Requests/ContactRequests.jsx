import React, { useEffect, useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import { renderCategory } from "../../../components/Admin";;
import Api from "../../../Api/ApiCalls";;
const fetchContactRequests= async()=>{
    const {data} = await Api.get('/requests/contact')
    return data.data
}
export default function ContactRequests() {
    const [contactRequests, setContactRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadContactRequests = async () => {
      try {
        const data = await fetchContactRequests();
        console.table(data);
        setContactRequests(data);
      } catch (error) {
        console.error("Failed to fetch academy requests", error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      loadContactRequests();
    }, []);
    if (loading) {
      return (
        <div className=" position-absolute top-50 start-50 translate-middle">
          <Spinner animation="border" />;
        </div>
      );
    }
  return (
    <Container>
      <Row>{renderCategory(contactRequests, "Contact")}</Row>
    </Container>
  );
}
