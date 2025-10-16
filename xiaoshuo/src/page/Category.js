import React, { useState } from "react";
import styles from "./Category.module.css";

export default function Category() {
  const [activeFilters, setActiveFilters] = useState({
    gender: "全部",
    type: "全部",
    sort: "最新更新",
  });

  const handleFilterClick = (group, value) => {
    setActiveFilters((prev) => ({ ...prev, [group]: value }));
    console.log("筛选条件改变:", group, value);
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

  return (
    <div className={styles.pageWrapper}>
      {/* 分类页头部 */}
      <header className={styles.categoryHeader}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold">小说分类</h1>
          <p className="lead">探索各种类型的小说，找到您喜欢的作品</p>
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
              <h5 className={styles.filterTitle}>排序方式</h5>
              <div className={styles.filterOption}>
                {["最新更新", "最热作品", "评分最高"].map((item) => filterButton("sort", item))}
              </div>
            </div>
          </div>
        </section>

        {/* 小说列表 */}
        <section className="novel-list">
          {[
            {
              cover: "玄幻小说",
              title: "圣墟",
              author: "辰东",
              stats: ["🔥 12.5万", "📖 456章"],
              tag: "玄幻",
              desc: "在破败中崛起，在寂灭中复苏...一个全新的世界就此揭开神秘的一角。",
            },
            {
              cover: "都市小说",
              title: "全职高手",
              author: "蝴蝶蓝",
              stats: ["🔥 9.8万", "📖 1728章"],
              tag: "竞技",
              desc: "网游荣耀中被誉为教科书级别的顶尖高手叶修...重新投入了游戏。",
            },
            {
              cover: "言情小说",
              title: "何以笙箫默",
              author: "顾漫",
              stats: ["🔥 7.2万", "📖 41章"],
              tag: "言情",
              desc: "一段年少时的爱恋，牵出一生的纠缠...终于使才气出众的他为她停留驻足。",
            },
            {
              cover: "科幻小说",
              title: "三体",
              author: "刘慈欣",
              stats: ["🔥 15.3万", "📖 90章"],
              tag: "科幻",
              desc: "军方探寻外星文明的‘红岸工程’取得突破...她彻底改变了人类的命运。",
            },
            {
              cover: "历史小说",
              title: "明朝那些事儿",
              author: "当年明月",
              stats: ["🔥 18.9万", "📖 7卷"],
              tag: "历史",
              desc: "从朱元璋的出身开始写起...叙述了明朝最艰苦卓绝的开国过程。",
            },
            {
              cover: "仙侠小说",
              title: "诛仙",
              author: "萧鼎",
              stats: ["🔥 14.2万", "📖 246章"],
              tag: "仙侠",
              desc: "这世间本是没有什么神仙的...决非人力所能为，所能抵挡。",
            },
          ].map((novel) => (
            <div className="col-12 mb-4" key={novel.title}>
              <div className={styles.novelCard}>
                <div className={styles.novelCover}>{novel.cover}</div>
                <div className={styles.novelMeta}>
                  <h3 className={styles.novelTitle}>{novel.title}</h3>
                  <div className={styles.novelAuthor}>作者：{novel.author}</div>
                  <div className={styles.novelStats}>
                    <span>{novel.stats[0]}</span>
                    <span>{novel.stats[1]}</span>
                  </div>
                  <span className={styles.novelTag}>{novel.tag}</span>
                </div>
                <p className={styles.novelDesc}>{novel.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* 分页 */}
        <nav aria-label="小说分页">
          <ul className="pagination justify-content-center mt-4">
            <li className="page-item disabled"><a className="page-link" href="#">上一页</a></li>
            {[1, 2, 3, 4, 5].map((num) => (
              <li key={num} className={`page-item ${num === 1 ? "active" : ""}`}>
                <a className="page-link" href="#">{num}</a>
              </li>
            ))}
            <li className="page-item"><a className="page-link" href="#">下一页</a></li>
          </ul>
        </nav>
      </main>
    </div>
  );
}
