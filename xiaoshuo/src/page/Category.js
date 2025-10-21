import React, { useState } from "react";
import styles from "./Category.module.css";
import api from "../api";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Category() {
  //搜索关键词
  const query = new URLSearchParams(useLocation().search);
  const searchKeyword = query.get("searchKey") || "";


  //分类选择
  const [activeFilters, setActiveFilters] = useState({
    gender: "全部",
    type: "全部",
    status: "全部",
  });
  //全部书
  const [allBooks, setAllBooks] = useState([]);
  //搜索结果
  const [searchResult, setSearchResult] = useState(null);
  //页面显示书
  const [books, setBooks] = useState([]);
  //当前页
  const [currentPage, setCurrentPage] = useState(1);
  //每页多少书
  const [pageSize] = useState(3);


  //获取分类全部书
  useEffect(() => {
    api.category().then(res => {
      setAllBooks(res.data.data)
      setBooks(res.data.data);
    });
  }, []);


  // 搜索
  useEffect(() => {
    if (searchKeyword) {
      api.search(searchKeyword).then(res => {
        setSearchResult(res.data.result || []);
        setCurrentPage(1);
        setActiveFilters({ gender: "全部", type: "全部", status: "全部" });
      }).catch(err => console.error(err));
    } else {
      setSearchResult(null);
    }
  }, [searchKeyword]);


  //分类，搜索
  useEffect(() => {
    let result = searchResult || [...allBooks]; // 搜索结果优先
    if (activeFilters.gender !== "全部") {
      result = result.filter(novel => novel.tag.includes(activeFilters.gender));
    }
    if (activeFilters.type !== "全部") {
      result = result.filter(novel => novel.tag.includes(activeFilters.type));
    }
    if (activeFilters.status !== "全部") {
      result = result.filter(novel => novel.tag.includes(activeFilters.status));
    }
    setBooks(result);
    setCurrentPage(1);
  }, [activeFilters, allBooks, searchResult]);


  //分类点击
  const handleFilterClick = (group, value) => {
    setActiveFilters((prev) => ({ ...prev, [group]: value }));
  };
  const filterButton = (group, label) => (
    <button
      key={label}
      className={`btn ${styles.filterBtn} ${
        activeFilters[group] === label ? styles.active : ""
      }`}
      onClick={() => handleFilterClick(group, label)}
    >
      {label}
    </button>
  );


  //分页
  const paginatedBooks = (books || []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  console.log(paginatedBooks)
  // 总页数
  const totalPages = Math.ceil((books?books.length:1) / pageSize);

  return (
    <div className={styles.pageWrapper}>
      {/* 分类页头部 */}
      <header className={styles.categoryHeader}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold">小说分类</h1>
        </div>
      </header>

      <main className="container">
        {/* 筛选区域 */}
        <section className={styles.filterSection}>
          <h3 className={styles.filterTitle}>分类筛选</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5 className={styles.filterTitle}>性别分类</h5>
              <div className={styles.filterOption}>
                {["全部", "男频", "女频"].map((item) => filterButton("gender", item))}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <h5 className={styles.filterTitle}>小说类型</h5>
              <div className={styles.filterOption}>
                {[
                  "全部", "玄幻", "都市", "仙侠", "历史", "科幻",
                  "悬疑", "言情", "武侠", "军事", "竞技", "轻小说",
                ].map((item) => filterButton("type", item))}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <h5 className={styles.filterTitle}>小说状态</h5>
              <div className={styles.filterOption}>
                {["全部","连载", "完结"].map((item) => filterButton("status", item))}
              </div>
            </div>
          </div>
        </section>

        {/* 小说列表 */}
        <section className="novel-list">
          {paginatedBooks.map((novel) => (
            <div className="col-12 mb-4" key={novel.title}>
              <div className={styles.novelCard}>
                <div className={styles.novelCover}>{novel.cover}</div>
                <div className={styles.novelMeta}>
                  <h3 className={styles.novelTitle}>{novel.title}</h3>
                  <div className={styles.novelAuthor}>作者：{novel.author}</div>
                  <div className={styles.novelStats}>
                    <span>{novel.stats?.[0] || '暂无数据'}</span>
                    <span>{novel.stats?.[1] || '暂无数据'}</span>
                  </div>
                  {(novel.tag || []).map((element, index) => (
                    <span key={index} className={styles.novelTag}>
                      {element}
                    </span>
                  ))}
                </div>
                <p className={styles.novelDesc}>{novel.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* 分页 */}
        {totalPages > 1 && (
        <nav aria-label="小说分页">
          <ul className="pagination justify-content-center mt-4">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>上一页</button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <li key={num} className={`page-item ${num === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(num)}>{num}</button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>下一页</button>
            </li>
          </ul>
        </nav>
      )}
      </main>
    </div>
  );
}
