import React from "react";
import { Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Api from "../../Api/ApiCalls";


const markAsRead = async (id) => {
  try {
    let { data } = await Api.put(`/requests/mark-as-read/${id}/read`);
    if (data.code === 200) {
      toast.success("Successfully..!");
    }
  } catch ({ response }) {
    const { data } = response;
    if (data.code === 400) {
      toast.error(data.message);
    }
  }
};

export default function renderCategory(requests, title) {
  const unreadRequests = requests?.filter((request) => !request.markAsRead);
  const readRequests = requests?.filter((request) => request.markAsRead);

  return (
    <React.Fragment>
      <h2 className="mb-2">{title}</h2>
      {requests?.length ? (
        [...unreadRequests, ...readRequests].map((request, index) => (
          <Col md={4} key={index + 1}>
            <Card key={index + 1} className="mb-3">
              <Card.Body>
                <Card.Title>{request.name}</Card.Title>
                {request.email && (
                  <Card.Subtitle className="mb-2 text-muted">
                    email: {request.email}
                  </Card.Subtitle>
                )}
                {request.propertyDetails[0] && (
                  <Card.Subtitle className="mb-2 text-muted">
                    area: {request.propertyDetails[0].area.title.ar}
                  </Card.Subtitle>
                )}
                {request.propertyDetails[0] && (
                  <Card.Subtitle className="mb-2 text-muted">
                    compound: {request.propertyDetails[0].compound.name.ar}
                  </Card.Subtitle>
                )}
                {request.propertyDetails[0] && (
                  <Card.Subtitle className="mb-2 text-muted">
                    type: {request.propertyDetails[0].type.name.ar}
                  </Card.Subtitle>
                )}
                {request.phone && (
                  <Card.Text className="mb-1">phone: {request.phone}</Card.Text>
                )}
                {request.message && (
                  <Card.Text className="mb-1">
                    message: {request.message}
                  </Card.Text>
                )}
                <Card.Footer className="px-0">
                  <div className="d-flex justify-content-between">
                    <p className="mb-0">
                      Read: {request.markAsRead ? "Yes" : "No"}
                    </p>
                    {!request.markAsRead && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="ml-2"
                        onClick={() => markAsRead(request._id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))
      ) : (
        <p>There are no requests</p>
      )}
    </React.Fragment>
  );
}
