import React, { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FetchAreaDetails } from '../Api/ApiCalls'
import { useTranslation } from 'react-i18next'
import { ContactUs } from '../components/Common/Buttons'
import Description from '../components/Common/Description'
import PaginatedItems from '../components/Common/PaginatedItems'
import Compound from '../components/Cards/Compound'
import Seo from '../Seo'

export default function AreaDetails() {
  const { id } = useParams()
  const { i18n, t } = useTranslation()
  const [areaDetails, setAreaDetails] = useState(null)
  const [compounds, setCompounds] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCompounds, setTotalCompounds] = useState(0)
  const pageSize = 12

  const fetchData = useCallback(
    async (pageNumber = 1) => {
      try {
        const data = await FetchAreaDetails(id, pageNumber, pageSize)
        setAreaDetails(data.area)
        setCompounds(data.pagination.compounds)
        setTotalPages(data.pagination.totalPages)
        setCurrentPage(data.pagination.currentPage)
        setTotalCompounds(data.totalCompounds)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    [id, pageSize]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const areaImage = areaDetails?.images
    ? `${import.meta.env.VITE_IMAGE_ORIGIN}/${areaDetails.images[0].url}`
    : ''
  const areaTitle = areaDetails?.title[i18n.language]
  const areaDescription= areaDetails?.description[i18n.language]
  return (
    <React.Fragment>
         <Seo
  description={t('PagesDescriptions.area')}
page={t('PagesName.areaDetails')}
    />
    <div className="container-xxl my-5">
      <div className="container">
        <div className="row border-bottom d-flex justify-content-start align-items-center py-4">
          <div className="col-3 col-md-1 mb-4">
            <img
              src={areaImage}
              className="object-fit-cover rounded-circle"
              loading="lazy"
              width="80"
              height="80"
              alt="area"
            />
          </div>
          <div className="col-6 col-md-9 mb-4">
            <div className="d-flex flex-column justify-content-center">
              <h2 className="area-title">{areaTitle}</h2>
              <p className="p-custom">
                {totalCompounds} {t('areaDetails.propertiesAvailable')}
              </p>
            </div>
          </div>
          <div className="col-md-2 d-flex justify-content-end justify-content-md-end align-items-end">
            <ContactUs number={areaDetails?.callUsNumber} />
          </div>
        </div>
      </div>
      {areaTitle && (
        <div className="container">
          <Description
            title={areaTitle}
            description={areaDescription}
          />
        </div>
      )}

      {compounds && (
        <div className="container mt-5">
          <h2 className="sup-title mb-2">
            {t('areaDetails.compoundsIn')} {areaTitle}
          </h2>
          <PaginatedItems
            data={compounds}
            pageSize={pageSize}
            initialPage={currentPage - 1}
            totalPages={totalPages}
            fetchData={fetchData}
            Component={Compound}
          />
        </div>
      )}
    </div>
    </React.Fragment>
 
  )
}
