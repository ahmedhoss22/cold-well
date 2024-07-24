import React, { useEffect, useState } from "react";
import Api from "../../../Api/ApiCalls";;
import { Container, Row, Spinner } from "react-bootstrap";
import { renderCategory } from "../../../components/Admin";;
const fetchSellRequests = async () => {
  const { data } = await Api.get("/requests/sell-property");
  return data.data;
};
export default function SellPropertyRequests() {
  const [sellRequests, setSellRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadSellRequests = async () => {
    try {
      const data = await fetchSellRequests();
      setSellRequests(data);
    } catch (error) {
      console.error("Failed to fetch sell property requests", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    loadSellRequests()
  },[])

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
      {renderCategory(sellRequests, 'Sell Property')}
      </Row>
    </Container>
  )
}
