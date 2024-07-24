import React, { useState, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const CustomNextButton = () => (
  <div className="custom-next-button">
    <IoIosArrowForward />
  </div>
);

const CustomPrevButton = () => (
  <div className="custom-prev-button">
    <IoIosArrowBack />
  </div>
);

const Elements = memo(({ currentElements, Component }) => {
  return (
    <>
      {currentElements?.map((element) => (
        <Component key={element._id} item={element} />
      ))}
    </>
  );
});

Elements.propTypes = {
  currentElements: PropTypes.array.isRequired,
  Component: PropTypes.elementType.isRequired,
};

function PaginatedItems({ data, pageSize, initialPage = 0, totalPages, fetchData, Component }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(totalPages);
  const [itemOffset, setItemOffset] = useState(initialPage * pageSize);

  useEffect(() => {
    const endOffset = itemOffset + pageSize;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(totalPages);
  }, [itemOffset, pageSize, data, totalPages]);

  const handlePageClick = useCallback((event) => {
    const newOffset = (event.selected * pageSize) % data.length;
    setItemOffset(newOffset);
    fetchData(event.selected + 1);
  }, [fetchData, pageSize, data.length]);

  return (
    <>
      <div className="row gy-4 gx-5">
        <Elements currentElements={currentItems} Component={Component} />
      </div>
      <div className="paginate row d-flex justify-content-center align-items-center mt-5">
        <ReactPaginate
          breakLabel="..."
          nextLabel={<CustomNextButton />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel={<CustomPrevButton />}
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  );
}

PaginatedItems.propTypes = {
  data: PropTypes.array.isRequired,
  pageSize: PropTypes.number.isRequired,
  initialPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  fetchData: PropTypes.func.isRequired,
  Component: PropTypes.elementType.isRequired,
};

export default memo(PaginatedItems);
