import React, { useEffect, useState } from "react";
import Api from "../../../Api/ApiCalls";;
import { Container, Row, Spinner } from "react-bootstrap";
import { renderCategory } from "../../../components/Admin";


const fetchAcademyRequests = async () => {
  const { data } = await Api.get("/requests/academy");
  return data.data;
};
export default function AcademyRequests() {
  const [academyRequests, setAcademyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadAcademyRequests = async () => {
    try {
      const data = await fetchAcademyRequests();
      console.table(data);
      setAcademyRequests(data);
    } catch (error) {
      console.error("Failed to fetch academy requests", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAcademyRequests();
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
      <Row>{renderCategory(academyRequests, "Academy")}</Row>
    </Container>
  );
}
