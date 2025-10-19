import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './page/Home';
import Category from './page/Category';
import BookShelf from './page/BookShelf';
import Person from './page/Person';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import RangkingList from './page/RangkingList';
import ResetPassword from './page/ResetPassword';
import FlashMessageList from './components/FlashMessage';
import NovelRead from './page/NovelRead';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

/**
 * 内部组件，用于处理路由相关逻辑
 */
function AppContent() {
  const location = useLocation();
  // 需要隐藏导航栏的路径
  const hideNavbarPaths = ['/novel/', '/RangkingList'];
  const shouldHideNavbar = hideNavbarPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {/* 条件渲染Navbar组件 */}
      {!shouldHideNavbar && <Navbar />}
      <FlashMessageList />

      {/* Routes组件用于渲染与当前URL匹配的路由 */}
      <Routes>
        {/* 首页路由，精确匹配根路径 */}
        <Route path='/' exact Component={Home} />
        {/* 分类页面路由 */}
        <Route path='/Category' Component={Category} />
        {/* 排行榜页面路由 */}
        <Route path='/RangkingList' Component={RangkingList} />
        {/* 书架页面路由 */}
        <Route path='/BookShelf' Component={BookShelf} />
        {/* 个人中心页面路由 */}
        <Route path='/Person' Component={Person} />
        {/* 登录页面路由 */}
        <Route path='/SignIn' Component={SignIn} />
        {/* 注册页面路由 */}
        <Route path='/SignUp' Component={SignUp} />
        {/* 重置密码页面路由 */}
        <Route path='/ResetPassword' Component={ResetPassword} />
        {/* 小说阅读页面路由 */}
        <Route path='/novel/:novelId' Component={NovelRead} />
      </Routes>

      {/* 条件渲染Footer组件 */}
      {!shouldHideNavbar && <Footer />}
    </>
  );
}

/**
 * App组件 - 应用程序的主入口组件
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
