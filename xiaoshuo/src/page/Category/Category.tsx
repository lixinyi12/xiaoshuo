import React, { useState, useEffect } from "react";
import styles from "./Category.module.css";
import { novelApi } from "../../api";
import { useLocation } from "react-router-dom";
import NovelCard from "../../components/NovelCard";
import Pagination from "../../components/Pagination";
import { TAG_CHANNEL, TAG_STATUS, TAG_TYPE_CATEGORY, TAG_TYPE_CHANNEL, TAG_TYPE_STATUS } from "../../constants/tags";

interface Tag {
  name: string,
  type: string
}

export default function Category() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchKeyword = query.get("searchKey") || "";
  const typeParam = query.get("type") || "";

  // 分类选择状态
  const [activeFilters, setActiveFilters] = useState({
    gender: "全部",
    type: "全部",
    status: "全部",
  });

  // 分组后的标签数组
  const [channelTags, setChannelTags] = useState(["全部"]);
  const [categoryTags, setCategoryTags] = useState(["全部"]);
  const [statusTags, setStatusTags] = useState(["全部"]);
  // 标签名到类型的映射
  const [tagTypeMap, setTagTypeMap] = useState<Record<string, string>>({});

  // 全部书籍
  const [allBooks, setAllBooks] = useState([]);
  // 搜索结果
  const [searchResult, setSearchResult] = useState(null);
  // 当前展示的书籍
  const [books, setBooks] = useState([]);
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 获取标签并分组
  useEffect(() => {
    novelApi.tags()
      .then((res) => {
        const tags = res.data.result || [];

        const map: Record<string, string> = {};
        tags.forEach((tag: Tag) => {
          map[tag.name] = tag.type;
        });
        setTagTypeMap(map);

        const channels = tags
          .filter((tag: Tag) => tag.type === TAG_TYPE_CHANNEL)
          .map((tag: Tag) => tag.name);
        const categories = tags
          .filter((tag: Tag) => tag.type === TAG_TYPE_CATEGORY)
          .map((tag: Tag) => tag.name);
        const statuses = tags
          .filter((tag: Tag) => tag.type === TAG_TYPE_STATUS)
          .map((tag: Tag) => tag.name);

        // 设置分组标签
        setChannelTags(["全部", ...(channels.length ? channels : [TAG_CHANNEL.MALE, TAG_CHANNEL.FEMALE])]);
        setCategoryTags(["全部", ...categories]);
        setStatusTags(["全部", ...(statuses.length ? statuses : [TAG_STATUS.SERIAL, TAG_STATUS.FINISHED])]);
      })
      .catch((err) => {
        console.error("获取标签失败", err);
        setChannelTags(["全部", TAG_CHANNEL.MALE, TAG_CHANNEL.FEMALE]);
        setCategoryTags(["全部"]);
        setStatusTags(["全部", TAG_STATUS.SERIAL, TAG_STATUS.FINISHED]);
      });
  }, []);

  // 获取全部书籍
  useEffect(() => {
    novelApi.card()
      .then((res) => {
        setAllBooks(res.data.data || []);
        setBooks(res.data.data || []);
      })
      .catch((err) => console.error("获取书籍失败", err));
  }, []);

  // 搜索
  useEffect(() => {
    if (searchKeyword) {
      novelApi.search(searchKeyword)
        .then((res) => {
          setSearchResult(res.data.result || []);
          setCurrentPage(1);
          setActiveFilters({ gender: "全部", type: "全部", status: "全部" });
        })
        .catch((err) => console.error(err));
    } else {
      setSearchResult(null);
    }
  }, [searchKeyword]);

  useEffect(() => {
    if (!typeParam) return;

    if (typeParam === "更多") {
      setActiveFilters({ gender: "全部", type: "全部", status: "全部" });
    } else {
      let group = tagTypeMap[typeParam];
      if (!group) {
        if (typeParam === TAG_CHANNEL.MALE || typeParam === TAG_CHANNEL.FEMALE) {
          group = TAG_TYPE_CHANNEL;
        } else if (typeParam === TAG_STATUS.SERIAL || typeParam === TAG_STATUS.FINISHED) {
          group = TAG_TYPE_STATUS;
        } else {
          group = TAG_TYPE_CATEGORY;
        }
      }

      const groupKey = group === TAG_TYPE_CHANNEL ? "gender" : group === TAG_TYPE_STATUS ? "status" : "type";
      setActiveFilters({
        gender: "全部",
        type: "全部",
        status: "全部",
        [groupKey]: typeParam,
      });
    }
  }, [typeParam, tagTypeMap]);

  // 筛选
  useEffect(() => {
    let result = searchResult || [...allBooks];

    if (activeFilters.gender !== "全部") {
      result = result.filter((novel: any) => novel.tag.includes(activeFilters.gender));
    }
    if (activeFilters.type !== "全部") {
      result = result.filter((novel: any) => novel.tag.includes(activeFilters.type));
    }
    if (activeFilters.status !== "全部") {
      result = result.filter((novel: any) => novel.tag.includes(activeFilters.status));
    }

    setBooks(result);
    setCurrentPage(1);
  }, [activeFilters, allBooks, searchResult]);

  // 筛选按钮点击
  const handleFilterClick = (group: any, value: any) => {
    setActiveFilters((prev: any) => ({
      ...prev,
      [group]: value
    }));
  };

  // 单个筛选按钮
  const filterButton = (group: 'gender' | 'type' | 'status', label: string) => (
    <button
      key={label}
      className={`btn ${styles.filterBtn} ${activeFilters[group] === label ? styles.active : ""
        }`}
      onClick={() => handleFilterClick(group, label)}
    >
      {label}
    </button>
  );

  // 分页数据
  const paginatedBooks = (books || []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil((books ? books.length : 1) / pageSize);

  return (
    <div className={styles.pageWrapper}>
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
                {channelTags.map((item: any) => filterButton("gender", item))}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <h5 className={styles.filterTitle}>小说类型</h5>
              <div className={styles.filterOption}>
                {categoryTags.map((item: any) => filterButton("type", item))}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <h5 className={styles.filterTitle}>小说状态</h5>
              <div className={styles.filterOption}>
                {statusTags.map((item: any) => filterButton("status", item))}
              </div>
            </div>
          </div>
        </section>

        {/* 小说列表 */}
        <section className="novel-list">
          {paginatedBooks.map((novel: any) => <NovelCard key={novel.title} novel={novel} />)}
        </section>

        {/* 分页 */}
        {totalPages > 1 && (
          <Pagination
            totalItems={books.length}
            itemsPerPage={pageSize}
            initialPage={1}
            onChange={({
              currentPage
            }: any) => setCurrentPage(currentPage)}
          />
        )}
      </main>
    </div>
  );
}