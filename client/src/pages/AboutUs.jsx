import React from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from '../components/Common/Carousel';
import Title from '../components/Common/Title';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import Seo from '../Seo';

const TopSalesItem = ({ item }) => (
  <Image src={item} alt="Top Sales" loading='lazy' rounded fluid />
);

const AboutUs = () => {
  const { t } = useTranslation();

  const topSalesImages = [
    '/top-sales/top-sales.jpg',
    '/top-sales/top-sales-2.jpg',
    '/top-sales/top-sales-3.jpg',
    '/top-sales/top-sales-4.jpg',
    '/top-sales/top-sales-5.jpg',
  ];

  const carouselSettings = {
    spaceBetween: 10,
    slidesPerView: 3,
    loop: false,
  };

  const ServiceItem = ({ icon, title, text }) => (
    <Row className="mb-3 px-2 py-3 rounded-2 mx-auto" style={{ background: '#f2f2f0' }}>
      <Col md={3} className="p-3">
        <Image src={icon} alt={title} fluid />
        <h3 className="font-weight-normal my-0 service-title">{title}</h3>
      </Col>
      <Col lg={8}>
        <p style={{ fontSize: '14px' }}>{text}</p>
      </Col>
    </Row>
  );

  return (
    <>
     <Seo
        description={t('PagesDescriptions.aboutUs')}
        page={t('PagesName.aboutUs')}
      />

      {/* Video section */}
      <section className="w-100 about-us-video" style={{ marginTop:"70px", height: '750px' }}>
        <video width="100%" height="100%" autoPlay muted loop>
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
 
      {/* Founder section */}
      <section className="container-xxl section-padding">
        <Container>
          <Row >
            {/* <Title title= /> */}
            <h2 className=' sup-title'>
            {t('aboutUs.founder')}
            </h2>
            <Col md={3} className="d-flex flex-column align-items-center">
              <Card className=" bg-transparent p-2 text-center border-0 d-flex justify-content-center align-items-center">
                <Card.Img 
                  variant="top" 
                  src="/founder.jpg" 
                  alt="founder" 
                  className="object-fit-cover rounded-2 mb-2" 
                  loading="lazy" 
                  style={{ width: '250px', height: '350px' }} 
                />
                <Card.Body>
                  <Card.Title>CEO</Card.Title>
                  <Card.Text>
                    <h3 className=' fs-5'>Mr Hussein Younis</h3>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services section */}
      <section className="container-xxl section-padding">
        <Container>
          <Row className="mx-auto">
            <h2 className='sup-tile'>
              {t('aboutUs.services')} 
            </h2>
            {/* <Title title=/> */}
            <ServiceItem
              icon="/findHome.png"
              title={t('aboutUs.findHomeTitle')}
              text={`${t('aboutUs.findHomeText')} ${t('aboutUs.findHomeTextTwo')}`}
            />
            <ServiceItem icon="/resale.png" title={t('aboutUs.resaleTitle')} text={t('aboutUs.resaleText')} />
            <ServiceItem
              icon="/Vacation Homes.png"
              title={t('aboutUs.vacationHomesTitle')}
              text={t('aboutUs.vacationHomesText')}
            />
            <ServiceItem
              icon="/TrainingAcademy.png"
              title={t('aboutUs.trainingAcademy')}
              text={t('aboutUs.trainingAcademyText')}
            />
            <ServiceItem
              icon="/AuctionServices.png"
              title={t('aboutUs.auctionServicesTitle')}
              text={t('aboutUs.auctionServicesText')}
            />
          </Row>
        </Container>
      </section>

      {/* Top Sales section */}
      <section className="container-xxl section-padding">
        <Container className="top-sales">

          <Row >
            <h2 className=' sup-title'>
            {t('aboutUs.topSalers')}
            </h2>
            {/* <Title title= /> */}
            <Carousel items={topSalesImages} Component={TopSalesItem} settings={carouselSettings} />
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AboutUs;
