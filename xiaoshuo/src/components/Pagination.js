import React from 'react';

/**
 * 
 * @param {{ currentPage, totalPages, onPageChange }} param0 
 * @returns 
 */

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="小说分页">
      <ul className="pagination justify-content-center mt-4">
        {/* 上一页 */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            上一页
          </button>
        </li>

        {/* 页码 */}
        {pages.map((num) => (
          <li key={num} className={`page-item ${num === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(num)}>
              {num}
            </button>
          </li>
        ))}

        {/* 下一页 */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            下一页
          </button>
        </li>
      </ul>
    </nav>
  );
}
