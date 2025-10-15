import React, { useState, useEffect } from 'react';

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
    <div className="banner-container">
      <div className="banner-slide">
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
  const categories = [
    "玄幻", "都市", "仙侠", "历史", "科幻", 
    "悬疑", "言情", "武侠", "军事", "竞技", 
    "轻小说", "更多"
  ];
  
  return (
    <section className="mb-5">
      <h3 className="section-title">小说分类</h3>
      <div className="row text-center">
        {categories.map((category, index) => (
          <div key={index} className="col-6 col-md-3 col-lg-2 mb-3">
            <a href="#" className="btn btn-outline-primary w-100">{category}</a>
          </div>
        ))}
      </div>
    </section>
  );
}
function HotRecommendation({ novels }) {
  return (
    <section className="mb-5">
      <h3 className="section-title">🔥 热门推荐</h3>
      <div className="row">
        {novels.map((novel, index) => (
          <NovelCard key={index} novel={novel} type="hot" />
        ))}
      </div>
    </section>
  );
}
function NovelCard({ novel, type = 'hot' }) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="card novel-card h-100">
        <div className="novel-cover">
          {novel.title}
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{novel.title}</h5>
            <span className="category-badge">{novel.category}</span>
          </div>
          <p className="card-text"><small className="text-muted">作者：{novel.author}</small></p>
          <p className="card-text">{novel.desc}</p>
        </div>
        <div className="card-footer bg-transparent">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {type === 'hot' ? `排名 #${novel.rank}` : novel.update}
            </small>
            <button className="btn btn-sm btn-outline-primary">开始阅读</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function LatestUpdate({ novels }) {
  return (
    <section className="mb-5">
      <h3 className="section-title">🆕 最新更新</h3>
      <div className="row">
        {novels.map((novel, index) => (
          <NovelCard key={index} novel={novel} type="latest" />
        ))}
      </div>
    </section>
  );
}
function RankingList({ title, rankId, data }) {
  return (
    <>
      <h5 className="section-title">{title}</h5>
      <ol className="rank-list" id={rankId}>
        {data.map((item, index) => (
          <li key={index}>
            <span className={`rank-number ${index < 3 ? 'top-three' : ''}`}>
              {index + 1}
            </span>
            <div>
              <div className="fw-bold">{item.title}</div>
              <small className="text-muted">{item.author}</small>
              <div className="text-primary small">
                {item.clicks || item.collects || item.recommends}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function Home() {
    // 模拟数据 - 热门推荐
    const hotNovelsData = [
        { 
        title: "剑来", 
        author: "烽火戏诸侯", 
        category: "仙侠",
        desc: "我陈平安，唯有一剑，可搬山，倒海，降妖，镇魔，敕神，摘星，断江，摧城，开天！",
        rank: 1
        },
        { 
        title: "夜的命名术", 
        author: "会说话的肘子", 
        category: "科幻",
        desc: "蓝与紫的霓虹中，浓密的钢铁苍穹下，数据洪流的前端，是科技革命之后的世界，也是现实与虚幻的分界。",
        rank: 2
        },
        { 
        title: "深空彼岸", 
        author: "辰东", 
        category: "科幻",
        desc: "浩瀚的宇宙中，一片星系的生灭，也不过是刹那的斑驳流光。",
        rank: 3
        },
        { 
        title: "灵境行者", 
        author: "卖报小郎君", 
        category: "悬疑",
        desc: "亘古通今，传闻世有灵境。关于灵境的说法，历朝历代的名人雅士众说纷纭。",
        rank: 4
        }
    ];
    // 模拟数据 - 最新更新
    const latestNovelsData = [
        { 
        title: "光阴之外", 
        author: "耳根", 
        category: "仙侠",
        desc: "天地是万物众生的客舍，光阴是古往今来的过客。",
        update: "10分钟前"
        },
        { 
        title: "明克街13号", 
        author: "纯洁滴小龙", 
        category: "悬疑",
        desc: "我喜欢坐在夜晚空无一人的大街上，听着『他们』的窃窃私语，享受着『他们』的喧嚣。",
        update: "25分钟前"
        },
        { 
        title: "开局签到荒古圣体", 
        author: "J神", 
        category: "玄幻",
        desc: "穿越到玄幻世界，君逍遥成为荒古世家神子，获得签到系统，踏上了横扫九天十地的无敌之路！",
        update: "1小时前"
        },
        { 
        title: "赤心巡天", 
        author: "情何以甚", 
        category: "仙侠",
        desc: "山河千里写伏尸，乾坤百年描饿虎。天地至公如无情，我有赤心一颗、以巡天！",
        update: "2小时前"
        }
    ];
    // 模拟数据 - 排行榜
    const clickRankData = [
        { title: "剑来", author: "烽火戏诸侯", clicks: "1254万" },
        { title: "夜的命名术", author: "会说话的肘子", clicks: "987万" },
        { title: "深空彼岸", author: "辰东", clicks: "856万" },
        { title: "灵境行者", author: "卖报小郎君", clicks: "743万" },
        { title: "光阴之外", author: "耳根", clicks: "689万" }
    ];
    const collectRankData = [
        { title: "剑来", author: "烽火戏诸侯", collects: "245万" },
        { title: "夜的命名术", author: "会说话的肘子", collects: "187万" },
        { title: "深空彼岸", author: "辰东", collects: "156万" },
        { title: "赤心巡天", author: "情何以甚", collects: "143万" },
        { title: "明克街13号", author: "纯洁滴小龙", collects: "128万" }
    ];
    const recommendRankData = [
        { title: "剑来", author: "烽火戏诸侯", recommends: "89万" },
        { title: "夜的命名术", author: "会说话的肘子", recommends: "76万" },
        { title: "深空彼岸", author: "辰东", recommends: "65万" },
        { title: "灵境行者", author: "卖报小郎君", recommends: "58万" },
        { title: "光阴之外", author: "耳根", recommends: "52万" }
    ];

    return (
        <div className="App">
            <Banner />
            <main className="container my-4">
                <CategoryNavigation />
                <HotRecommendation novels={hotNovelsData} />
                <LatestUpdate novels={latestNovelsData} />
                
                <section className="row">
                <div className="col-md-6 col-lg-4 mb-4">
                    <RankingList title="📈 点击榜" data={clickRankData} />
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                    <RankingList title="❤️ 收藏榜" data={collectRankData} />
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                    <RankingList title="⭐ 推荐榜" data={recommendRankData} />
                </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
