import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { novelApi, statisticsApi } from '../../api';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { TAG_CHANNEL, TAG_STATUS } from '../../constants/tags';

function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    "热门连载《剑来》每日爆更",
    "新书上线《深空彼岸》震撼来袭",
    "限时活动：阅读打卡赢好礼"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev: any) => (prev + 1) % banners.length);
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
  const [tags, setTags] = useState<string[]>([])

  //获取tags
  useEffect(() => {
    novelApi.tags().then(res => {
      const tags: [Record<string, string>] = res.data.result;
      const iniTags: string[] = tags.map((item: Record<string, string>) => item.name);
      const filteredTags = iniTags.filter((tag: string) => tag !== TAG_STATUS.SERIAL &&
        tag !== TAG_STATUS.FINISHED &&
        tag !== TAG_CHANNEL.FEMALE &&
        tag !== TAG_CHANNEL.MALE
      );
      const finalTags = [...filteredTags, '更多'];
      setTags(finalTags);
    });
  }, []);

  return (
    <section className="mb-5">
      <h3 className="section-title">小说分类</h3>
      <div className="row text-center">
        {tags.map((category: any, index: any) => (
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
    statisticsApi.hot().then(res => {
      setHot(res.data.data.slice(0, 4))
    })
  }, [])

  return (
    <section className="mb-5">
      <h3 className="section-title">🔥 热门推荐</h3>
      <div className="row">
        {hot.map((hot: any, index: any) => (
          <NovelCard key={index} novel={hot} type="hot" />
        ))}
      </div>
    </section>
  );
}
function NovelCard({
  novel,
  type = 'hot'
}: any) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className={`card ${styles.novelCard}  h-100`}>
        <div className={`${styles.novelCover}`}>
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
              to={`/mulu?id=${novel.id}`}
              className="btn btn-sm btn-outline-primary"
              target='_blank'
              end
            >
              开始阅读
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
function LatestUpdate() {
  const [latest, setHot] = useState([])

  useEffect(() => {
    statisticsApi.latest().then(res => {
      setHot(res.data.data.slice(0, 4))
    })
  }, [])

  return (
    <section className="mb-5">
      <h3 className="section-title">🆕 最新更新</h3>
      <div className="row">
        {latest.map((novel: any, index: any) => (
          <NovelCard key={index} novel={novel} type="latest" />
        ))}
      </div>
    </section>
  );
}
function RankingList({
  title,
  rankId,
  data
}: any) {

  const safeData = Array.isArray(data) ? data : [];
  const rankCount = 10;

  return (
    <>
      <h5 className="section-title">{title}</h5>
      <ol className={`rank-list ${styles.rankList}`} id={rankId}>
        {safeData.slice(0, rankCount).map((item, index) => {
          return (
            <li key={item.id || index}>
              <span className={`${styles.rankNumber} ${index < 3 ? 'top-three' : ''}`}>
                {index + 1}
              </span>
              <div>
                <div className="fw-bold text-start">{item.title}</div>
                <small className="text-muted text-start d-block">{item.author}</small>
                <div className="text-primary small text-start">
                  {item.hot || item.collects || item.score || '0'}
                </div>
              </div>
            </li>
          );
        })}
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
    statisticsApi.collects().then(res => {
      setCollect(res.data.data)
    })
    statisticsApi.hot().then(res => {
      setHot(res.data.data);
    })
    statisticsApi.score().then(res => {
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
