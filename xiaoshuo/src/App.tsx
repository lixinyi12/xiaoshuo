import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './page/Home';
import Category from './page/Category';
import Person from './page/Person';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import RangkingList from './page/RangkingList';
import ResetPassword from './page/ResetPassword';
import FlashMessageList from './components/FlashMessage';
import CommentHistory from './page/CommentHistory'
import NovelRead from './page/NovelRead';
import BookShelf from './page/BookShelf';
import Publish from './page/Publish';
import Mulu from './page/Mulu';
import FollowFan from './page/FollowFan'
import Works from './page/Works';
import PersonalInfo from './page/PersonalInfo';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from './constants/link';
import WorksManagement from './page/WorksManagement';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchCurrentUser } from './actions/auth';
import AdminReview from './page/AdminReview';
import React from 'react';

/**
 * 内部组件，用于处理路由相关逻辑
 */
function AppContent() {
  const location = useLocation();
  // 需要隐藏导航栏的路径
  const hideNavbarPaths = ['/novel/', ROUTES.NOVEL_READ, ROUTES.COMMENT_HISTORY];
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
        <Route path={ROUTES.HOME} Component={Home} />
        {/* 分类页面路由 */}
        <Route path={ROUTES.CATEGORY} Component={Category} />
        {/* 排行榜页面路由 */}
        <Route path={ROUTES.RANGKING_LIST} Component={RangkingList} />
        {/* 个人中心页面路由 */}
        <Route path={ROUTES.PERSON} Component={Person} />
        {/* 登录页面路由 */}
        <Route path={ROUTES.SIGNIN} Component={SignIn} />
        {/* 注册页面路由 */}
        <Route path={ROUTES.SIGNUP} Component={SignUp} />
        {/* 重置密码页面路由 */}
        <Route path={ROUTES.RESET_PASSWORD} Component={ResetPassword} />
        {/* 小说阅读页面路由 */}
        <Route path={ROUTES.NOVEL_READ} Component={NovelRead} />
        {/* 评论历史路由 */}
        <Route path={ROUTES.COMMENT_HISTORY} Component={CommentHistory} />
        {/* 书架路由 */}
        <Route path={ROUTES.BOOK_SHELF} Component={BookShelf} />
        {/* 关注粉丝路由 */}
        <Route path={ROUTES.FOLLOW_FAN} Component={FollowFan} />
        {/* 作品管理路由 */}
        <Route path={ROUTES.WORKS} Component={Works} />
        {/* 个人信息编辑路由 */}
        <Route path={ROUTES.PERSONAL_INFO} Component={PersonalInfo} />
        {/* 小说目录路由 */}
        <Route path={ROUTES.MULU} Component={Mulu} />
        {/* 发布作品路由 */}
        <Route path={ROUTES.PUBLISH} Component={Publish} />
        {/* 编辑作品路由 */}
        <Route path={ROUTES.WORKS_MANAGEMENT} Component={WorksManagement} />
        {/* 审核路由 */}
        <Route path={ROUTES.ADMIN_REVIEW} Component={AdminReview} />
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
