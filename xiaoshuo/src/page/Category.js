import React, { useState } from "react";
import styles from "./Category.module.css";
import api from "../api";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NovelCard from "../components/NovelCard";
import Pagination from "../components/Pagination";

export default function Category() {
  //搜索关键词
  const query = new URLSearchParams(useLocation().search);
  const searchKeyword = query.get("searchKey") || "";
  const type = query.get("type") || "全部";


  //分类选择
  const [activeFilters, setActiveFilters] = useState({
    gender: "全部",
    type: "全部",
    status: "全部",
  });
  //tags
  const [tags, setTags] = useState([])
  //全部书
  const [allBooks, setAllBooks] = useState([]);
  //搜索结果
  const [searchResult, setSearchResult] = useState(null);
  //页面显示书
  const [books, setBooks] = useState([]);
  //当前页
  const [currentPage, setCurrentPage] = useState(1);
  //每页多少书
  const [pageSize] = useState(1);


  //获取tags
  useEffect(() => {
    api.tags().then(res => {
      const iniTags = res.data.tagsArray;
      const filteredTags = iniTags.filter(tag => tag !== "连载" && tag !== "完结" && tag !== "男频" && tag !== "女频");
      const finalTags = ["全部", ...filteredTags];
      setTags(finalTags);
    });
  }, []);


  //首页跳转时设置分类
  useEffect(() => {
    if (type === '更多') {
      setActiveFilters(prev => ({
        ...prev,
        type: '全部'
      }));
    } else {
      setActiveFilters(prev => ({
        ...prev,
        type: type
      }));
    }
  }, [useLocation().search]);


  //获取分类全部书
  useEffect(() => {
    api.card().then(res => {
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
      className={`btn ${styles.filterBtn} ${activeFilters[group] === label ? styles.active : ""
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
  // 总页数
  const totalPages = Math.ceil((books ? books.length : 1) / pageSize);

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
                {tags.map((item) => filterButton("type", item))}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <h5 className={styles.filterTitle}>小说状态</h5>
              <div className={styles.filterOption}>
                {["全部", "连载", "完结"].map((item) => filterButton("status", item))}
              </div>
            </div>
          </div>
        </section>

        {/* 小说列表 */}
        <section className="novel-list">
          {paginatedBooks.map((novel) => (
            <NovelCard key={novel.title} novel={novel} />
          ))}
        </section>

        {/* 分页 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
