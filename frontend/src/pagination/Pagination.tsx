import React from "react";
import './Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <button
                className="pagination-button"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
            >
                İlk
            </button>
            <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Önceki
            </button>
            {pageNumbers.slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 3, totalPages)).map(number => (
                <button
                    key={number}
                    className={`pagination-button ${number === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </button>
            ))}
            <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Sonraki
            </button>
            <button
                className="pagination-button"
                onClick={() => handlePageChange(totalPages)} // totalPages değerine git
                disabled={currentPage === totalPages}
            >
                Son
            </button>
        </div>
    );
};

export default Pagination;
