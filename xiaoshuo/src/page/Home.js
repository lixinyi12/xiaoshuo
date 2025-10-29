import React, { useState, useEffect } from 'react';
import styles from '../page/Home.module.css';
import api from '../api';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    "热门连载《剑来》每日爆更",
    "新书上线《深空彼岸》震撼来袭",
    "限时活动：阅读打卡赢好礼"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className={`banner-container ${styles.bannerContainer}`}>
      <div className={`banner-slide ${styles.bannerSlide}`}>
        <div>{banners[currentBanner]}</div>
      </div>
      <div className="banner-indicators">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`banner-indicator ${index === currentBanner ? 'active' : ''}`}
            onClick={() => setCurrentBanner(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}
function CategoryNavigation() {
  //tags
  const [tags, setTags] = useState([])

  //获取tags
  useEffect(() => {
    api.tags().then(res => {
      const iniTags = res.data.tagsArray;
      const filteredTags = iniTags.filter(tag => tag !== "连载" && tag !== "完结" && tag !== "男频" && tag !== "女频");
      const finalTags = [...filteredTags, '更多'];
      setTags(finalTags);
    });
  }, []);

  return (
    <section className="mb-5">
      <h3 className="section-title">小说分类</h3>
      <div className="row text-center">
        {tags.map((category, index) => (
          <div key={index} className="col-6 col-md-3 col-lg-2 mb-3">
            <Link
              to={`/Category?type=${encodeURIComponent(category)}`}
              className="btn btn-outline-primary w-100"
            >
              {category}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
function HotRecommendation() {
  const [hot, setHot] = useState([])

  useEffect(() => {
    api.hot().then(res => {
      setHot(res.data.data.slice(0, 4))
    })
  }, [])

  return (
    <section className="mb-5">
      <h3 className="section-title">🔥 热门推荐</h3>
      <div className="row">
        {hot.map((hot, index) => (
          <NovelCard key={index} novel={hot} type="hot" />
        ))}
      </div>
    </section>
  );
}
function NovelCard({ novel, type = 'hot' }) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className={`card novel-card ${styles.novelCard}  h-100`}>
        <div className={`novel-cover ${styles.novelCover}`}>
          {novel.title}
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{novel.title}</h5>
          </div>
          <p className="card-text"><small className="text-muted">作者：{novel.author}</small></p>
          <p className="card-text">{novel.desc}</p>
        </div>
        <div className="card-footer bg-transparent">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {type === 'hot' ? `排名 #${novel.rank}` : novel.update}
            </small>
            <NavLink 
                to={`/NovelRead?id=${novel.id}`} 
                className="btn btn-sm btn-outline-primary"
                target='_blank'
                end
              >
                开始阅读
            </NavLink>
            {/* <button className="btn btn-sm btn-outline-primary">开始阅读</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
function LatestUpdate() {
  const [latest, setHot] = useState([])

  useEffect(() => {
    api.latest().then(res => {
      setHot(res.data.data.slice(0, 4))
    })
  }, [])

  return (
    <section className="mb-5">
      <h3 className="section-title">🆕 最新更新</h3>
      <div className="row">
        {latest.map((novel, index) => (
          <NovelCard key={index} novel={novel} type="latest" />
        ))}
      </div>
    </section>
  );
}
function RankingList({ title, rankId, data }) {
  //展示多少行
  const rankCount = 10
  return (
    <>
      <h5 className="section-title">{title}</h5>
      <ol className={`rank-list ${styles.rankList}`} id={rankId}>
        {data.slice(0,rankCount).map((item, index) => (
          <li key={index}>
            <span className={`${styles.rankNumber} ${index < 3 ? 'top-three' : ''}`}>
              {index + 1}
            </span>
            <div>
              <div className="fw-bold text-start">{item.title}</div>
              <small className="text-muted text-start d-block">{item.author}</small>
              <div className="text-primary small text-start">
                {item.hot || item.collects || item.score}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function Home() {
  //排行榜
  const [collect, setCollect] = useState([])
  const [score, setScore] = useState([])
  const [hot, setHot] = useState([])

  useEffect(() => {
    api.collects().then(res => {
      setCollect(res.data.data)
    })
    api.hot().then(res => {
      setHot(res.data.data)
    })
    api.score().then(res => {
      setScore(res.data.data)
    })
  }, [])

  return (
    <div className="App">
      <Banner />
      <main className="container my-4">
        <CategoryNavigation />
        <HotRecommendation />
        <LatestUpdate />

        <section className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <RankingList title="🔥 热度榜" data={hot} />
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <RankingList title="❤️ 收藏榜" data={collect} />
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <RankingList title="⭐ 评分榜" data={score} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
