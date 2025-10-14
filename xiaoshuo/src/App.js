import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import CategoryNavigation from './components/CategoryNavigation';
import HotRecommendation from './components/HotRecommendation';
import LatestUpdate from './components/LatestUpdate';
import RankingList from './components/RankingList';
import Footer from './components/Footer';

function App() {
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
      <Navbar />
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
      
      <Footer />
    </div>
  );
}

export default App;
