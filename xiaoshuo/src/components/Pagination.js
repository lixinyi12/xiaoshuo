import React from 'react';

/**
 * 
 * @param {currentPage, totalPages, onPageChange} param0 
 * currentPage:当前的页数
 * totalPages:一页总共多少条数据
 * onPageChange:传递参数：新页码；翻页时做什么事
 * @returns 
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const maxPagesToShow = 7; // 显示的最大页码数
    const pages = [];
    
    if (totalPages <= maxPagesToShow) {
      // 总页数较少时，显示所有页码
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // 计算要显示的页码范围
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // 调整页码范围，确保显示足够多的页码
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - (maxPagesToShow - 2));
    }
    
    // 确保显示的页码数量一致
    while (endPage - startPage + 1 < maxPagesToShow - 2 && (startPage > 2 || endPage < totalPages - 1)) {
      if (startPage > 2) startPage--;
      if (endPage < totalPages - 1) endPage++;
    }

    pages.push(1); // 第一页

    // 添加左侧省略号（如果需要）
    if (startPage > 2) {
      pages.push('left-ellipsis');
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) { // 确保不重复添加第一页和最后一页
        pages.push(i);
      }
    }

    // 添加右侧省略号（如果需要）
    if (endPage < totalPages - 1) {
      pages.push('right-ellipsis');
    }

    // 添加最后一页（如果不是第一页）
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="小说分页">
      <ul className="pagination justify-content-center mt-4">
        {/* 上一页 */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一页
          </button>
        </li>

        {/* 页码 */}
        {pages.map((page, index) => {
          if (page === 'left-ellipsis' || page === 'right-ellipsis') {
            return (
              <li key={`${page}-${index}`} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            );
          }
          return (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          );
        })}

        {/* 下一页 */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一页
          </button>
        </li>
      </ul>
    </nav>
  );
}