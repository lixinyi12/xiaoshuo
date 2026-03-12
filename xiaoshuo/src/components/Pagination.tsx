import React, { useState, useEffect, useCallback } from 'react';

// 使用示例
// export function PaginationExample() {
//   const [data, setData] = useState([]);
//   const [paginationState, setPaginationState] = useState(null);

//   // 模拟数据加载
//   useEffect(() => {
//     // 这里应该是从API加载数据的逻辑
//     const mockData = Array.from({ length: 125 }, (_, i) => ({
//       id: i + 1,
//       name: `项目 ${i + 1}`
//     }));
//     setData(mockData);
//   }, []);

//   // 处理分页变化
//   const handlePaginationChange = (pagination) => {
//     setPaginationState(pagination);
//   };

//   // 获取当前页的数据（模拟）
//   const getCurrentPageData = () => {
//     if (!paginationState || data.length === 0) return [];

//     const { startItem, endItem } = paginationState;
//     return data.slice(startItem - 1, endItem);
//   };

//   const currentData = getCurrentPageData();

//   return (
//     <div>
//       <h3>分页示例</h3>

//       {/* 数据列表 */}
//       <ul className="list-group mb-4">
//         {currentData.map(item => (
//           <li key={item.id} className="list-group-item">
//             {item.name}
//           </li>
//         ))}
//       </ul>

//       {/* 分页组件 */}
//       <Pagination
//         totalItems={data.length}
//         itemsPerPage={10}
//         initialPage={1}
//         showInfo={true}
//         showJump={true}
//         showSizeChanger={true}
//         onChange={handlePaginationChange}
//       />
//     </div>
//   );
// }

/**
 * 分页组件
 * @param {Object} props
 * @param {number} props.totalItems - 总数据条数
 * @param {number} props.itemsPerPage - 每页显示条数（默认10）
 * @param {number} props.initialPage - 初始页码（默认1）
 * @param {number} props.maxPagesToShow - 显示的最大页码数（默认7）
 * @param {boolean} props.showInfo - 是否显示分页信息（默认true）
 * @param {boolean} props.showJump - 是否显示跳转输入框（默认false）
 * @param {boolean} props.showSizeChanger - 是否显示每页条数选择器（默认false）
 * @param {number[]} props.pageSizeOptions - 每页条数选项（默认[10, 20, 50, 100]）
 * @param {Function} props.onChange - 分页变化回调函数，返回分页信息
 * @param {Object} props.classNames - 自定义类名
 * @returns {JSX.Element}
 */
export default function Pagination({
  totalItems = 0,
  itemsPerPage = 10,
  initialPage = 1,
  maxPagesToShow = 7,
  showInfo = true,
  showJump = false,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  classNames = {}
}: any) {
  // 计算总页数
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // 状态管理
  const [currentPage, setCurrentPage] = useState(Math.min(initialPage, totalPages));
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);
  const [jumpPage, setJumpPage] = useState('');

  // 计算当前页的数据范围
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * currentItemsPerPage + 1;
  const endItem = Math.min(currentPage * currentItemsPerPage, totalItems);

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / currentItemsPerPage));
    if (currentPage > newTotalPages) {
      handlePageChange(newTotalPages);
    }
  }, [totalItems, currentItemsPerPage, currentPage]);

  // 监听分页变化，触发回调
  useEffect(() => {
    if (onChange) {
      onChange({
        currentPage,
        itemsPerPage: currentItemsPerPage,
        totalPages,
        totalItems,
        startItem,
        endItem
      });
    }
  }, [currentPage, currentItemsPerPage, totalPages, totalItems, startItem, endItem]);

  // 页码跳转
  const handlePageChange = useCallback((newPage: any) => {
    const page = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(page);
    setJumpPage('');
  }, [totalPages]);

  // 每页条数变化
  const handleItemsPerPageChange = (e: any) => {
    const newSize = parseInt(e.target.value, 10);
    // 计算新页码
    const firstItemIndex = (currentPage - 1) * currentItemsPerPage;
    const newPage = Math.floor(firstItemIndex / newSize) + 1;

    setCurrentItemsPerPage(newSize);
    setCurrentPage(Math.min(newPage, Math.ceil(totalItems / newSize)));
  };

  // 跳转到指定页
  const handleJump = () => {
    if (jumpPage === '') return;

    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
    } else {
      setJumpPage('');
    }
  };

  // 跳转输入框按键处理
  const handleJumpKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };

  // 生成页码数组
  const getPageNumbers = useCallback(() => {
    if (totalPages <= 1) return [];

    if (totalPages <= maxPagesToShow) {
      // 总页数较少时，显示所有页码
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfMax = Math.floor(maxPagesToShow / 2);

    let startPage = currentPage - halfMax;
    let endPage = currentPage + halfMax;

    if (startPage < 1) {
      endPage += 1 - startPage;
      startPage = 1;
    }

    if (endPage > totalPages) {
      startPage -= endPage - totalPages;
      endPage = totalPages;
    }

    startPage = Math.max(1, startPage);
    endPage = Math.min(totalPages, endPage);

    // 添加第一页
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('left-ellipsis');
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 添加最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('right-ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxPagesToShow]);

  // 获取分页信息文本
  const getPaginationInfo = () => {
    if (totalItems === 0) return '暂无数据';
  };

  // 如果没有数据，不显示分页
  if (totalItems <= 0 || totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className={`pagination-wrapper ${classNames.wrapper || ''}`}>
      {/* 分页信息 */}
      {showInfo && (
        <div className={`pagination-info mb-2 ${classNames.info || ''}`}>
          <span className="text-muted">{getPaginationInfo()}</span>
        </div>
      )}

      <nav aria-label="数据分页">
        <ul className={`pagination justify-content-center mb-0 ${classNames.pagination || ''}`}>
          {/* 第一页 */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="第一页"
            >
              &laquo;
            </button>
          </li>

          {/* 上一页 */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="上一页"
            >
              上一页
            </button>
          </li>

          {/* 页码 */}
          {pageNumbers.map((page: any, index: any) => {
            if (page === 'left-ellipsis' || page === 'right-ellipsis') {
              return (
                <li key={`${page}-${index}`} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              );
            }
            return (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              </li>
            );
          })}

          {/* 下一页 */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="下一页"
            >
              下一页
            </button>
          </li>

          {/* 最后一页 */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="最后一页"
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>

      {/* 分页控制选项 */}
      <div className="d-flex flex-wrap justify-content-center align-items-center mt-2 gap-2">
        {/* 每页条数选择器 */}
        {showSizeChanger && totalItems > 0 && (
          <div className="d-flex align-items-center">
            <label htmlFor="pageSizeSelect" className="form-label mb-0 me-2">
              每页显示：
            </label>
            <select
              id="pageSizeSelect"
              className="form-select form-select-sm"
              value={currentItemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ width: 'auto' }}
            >
              {pageSizeOptions.map((size: any) => (
                <option key={size} value={size}>
                  {size} 条
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 页码跳转 */}
        {showJump && totalPages > 1 && (
          <div className="d-flex align-items-center">
            <span className="me-2">跳转到</span>
            <input
              type="number"
              className="form-control form-control-sm"
              style={{ width: '70px' }}
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e: any) => setJumpPage(e.target.value)}
              onKeyPress={handleJumpKeyPress}
              placeholder="页码"
            />
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={handleJump}
              disabled={!jumpPage}
            >
              跳转
            </button>
          </div>
        )}

        {/* 页码显示 */}
        <div className="text-muted">
          第 <strong>{currentPage}</strong> / <strong>{totalPages}</strong> 页
        </div>
      </div>
    </div>
  );
}