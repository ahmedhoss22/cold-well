import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Api from "../../../Api/ApiCalls";;
import { toast } from "react-toastify";
import LoadingButton from "../../../components/Admin/LoadingButton";
import { notifyError, notifySuccess } from "../../../components/Admin/Toaster";

const schema = Joi.object({
  offerNumber: Joi.number().integer().optional(),
  offerNote: Joi.object({
    en: Joi.string().optional(),
    ar: Joi.string().optional(),
  }).optional(),
  offerName: Joi.object({
    en: Joi.string().required().messages({
      "string.empty": "Offer Name (English) is required",
    }),
    ar: Joi.string().required().messages({
      "string.empty": "Offer Name (Arabic) is required",
    }),
  }).required(),
  developer: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional(),
  downPayment: Joi.string().required().messages({
    "string.empty": "Down Payment is required",
  }),
  installmentYears: Joi.string().required().messages({
    "string.empty": "Installment Years are required",
  }),
  oldOffer: Joi.object({
    downPayment: Joi.string().optional().allow(""),
    installmentYears: Joi.string().optional().allow(""),
  }).optional(),
  referenceNumber: Joi.string().length(8).pattern(/^\d+$/).optional(),
  whatsapp: Joi.string().required().messages({
    "string.empty": "Call Us Number is required",
  }),
});

export default function CreateOffer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const [developers, setDevelopers] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false)
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const developer = await Api.get("/developer/get-names");
        setDevelopers(developer.data.data);
        
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setButtonLoading(true)
    try {
      await Api.post("/offers/create-new", data);
      reset()
      notifySuccess("Successfully Created!")
    } catch (error) {
      notifyError("Failed to Create")
      console.error("Form submission error:", error.response.data);
    } finally{
      setButtonLoading(false)
    }
  };

  return (
    <Container>
      <h1>Create Offer</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Developer</Form.Label>
              <Form.Control
                as="select"
                {...register("developer[0]")}
                isInvalid={!!errors.developer}
              >
                <option value="">Select Developer</option>
                {developers?.map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.name.en}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.developer?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Offer Name (English)</Form.Label>
              <Form.Control
                type="text"
                {...register("offerName.en")}
                isInvalid={!!errors.offerName?.en}
              />
              <Form.Control.Feedback type="invalid">
                {errors.offerName?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Offer Name (Arabic)</Form.Label>
              <Form.Control
                type="text"
                {...register("offerName.ar")}
                isInvalid={!!errors.offerName?.ar}
              />
              <Form.Control.Feedback type="invalid">
                {errors.offerName?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Offer Note (English)</Form.Label>
              <Form.Control
                type="text"
                {...register("offerNote.en")}
                isInvalid={!!errors.offerNote?.en}
              />
              <Form.Control.Feedback type="invalid">
                {errors.offerNote?.en?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Offer Note (Arabic)</Form.Label>
              <Form.Control
                type="text"
                {...register("offerNote.ar")}
                isInvalid={!!errors.offerNote?.ar}
              />
              <Form.Control.Feedback type="invalid">
                {errors.offerNote?.ar?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Down Payment</Form.Label>
              <Form.Control
                type="text"
                {...register("downPayment")}
                isInvalid={!!errors.downPayment}
              />
              <Form.Control.Feedback type="invalid">
                {errors.downPayment?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Installment Years</Form.Label>
              <Form.Control
                type="text"
                {...register("installmentYears")}
                isInvalid={!!errors.installmentYears}
              />
              <Form.Control.Feedback type="invalid">
                {errors.installmentYears?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Old Offer Down Payment</Form.Label>
              <Form.Control
                type="text"
                {...register("oldOffer.downPayment")}
                isInvalid={!!errors.oldOffer?.downPayment}
              />
              <Form.Control.Feedback type="invalid">
                {errors.oldOffer?.downPayment?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Old Offer Installment Years</Form.Label>
              <Form.Control
                type="text"
                {...register("oldOffer.installmentYears")}
                isInvalid={!!errors.oldOffer?.installmentYears}
              />
              <Form.Control.Feedback type="invalid">
                {errors.oldOffer?.installmentYears?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Form.Group className="mb-3">
            <Form.Label>Whatsapp</Form.Label>
            <Form.Control
              type="text"
              {...register("whatsapp")}
              isInvalid={!!errors.whatsapp}
            />
            <Form.Control.Feedback type="invalid">
              {errors.whatsapp?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <LoadingButton loading={buttonLoading} text={'Create Offer'}/>
      </Form>
    </Container>
  );
}
