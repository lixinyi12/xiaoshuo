import api from '../api';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Person = () => {
  // 模拟用户数据
  const userData = {
    nickname: "书海漫游者",
    signature: "在文字的世界里寻找灵魂的栖息地",
    avatar: "/images/avatar.jpg", // 替换为实际头像路径
    phone: "138****1234",
    email: "reader@example.com",
    username: "booklover2024",
    bookshelf: ["《三体》", "《百年孤独》", "《平凡的世界》", "《活着》"],
    footprint: ["《解忧杂货店》", "《白夜行》", "《追风筝的人》"],
    comments: 128,
    likes: 356,
    works: ["《星空下的约定》", "《时光倒流》", "《城市边缘》"],
    creationData: {
      todayRead: 1245,
      monthCollect: 89,
      monthComment: 45,
      totalLikes: 2560
    },
    followers: 1234,
    following: 567
  };

  //初始化表单
  const [formData, setFormData] = useState({
      list:[]
  });

  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.token);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/SignIn', { replace: true });
    }
    api.list().then(res => {
      if(res.data.status === 200){
        setFormData({
          ...formData,
          list:res.data.list
        })
      }else{
        navigate('/SignIn', { replace: true })
      }
    })
  },[isLoggedIn]);

  return (
    <div className="container-fluid py-4">
      {/* 顶部个人信息区域 */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                {/* 头像区域 */}
                <div className="col-md-2 text-center">
                  <img 
                    src={userData.avatar} 
                    alt="头像" 
                    className="rounded-circle img-fluid"
                    style={{width: '100px', height: '100px', objectFit: 'cover'}}
                  />
                </div>
                
                {/* 基本信息 */}
                <div className="col-md-6">
                  <h2 className="card-title text-primary">{userData.nickname}</h2>
                  <p className="card-text text-muted">{userData.signature}</p>
                  <div className="d-flex flex-wrap gap-3">
                    <span className="badge bg-primary">粉丝: {userData.followers}</span>
                    <span className="badge bg-secondary">关注: {userData.following}</span>
                    <span className="badge bg-success">获赞: {userData.likes}</span>
                  </div>
                </div>
                
                {/* 创作数据 */}
                <div className="col-md-4">
                  <div className="row text-center">
                    <div className="col-6 mb-2">
                      <div className="border-end">
                        <h5 className="mb-0 text-warning">{userData.creationData.todayRead}</h5>
                        <small className="text-muted">今日阅读</small>
                      </div>
                    </div>
                    <div className="col-6 mb-2">
                      <div className="border-end">
                        <h5 className="mb-0 text-info">{userData.creationData.monthCollect}</h5>
                        <small className="text-muted">月收藏</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border-end">
                        <h5 className="mb-0 text-success">{userData.creationData.monthComment}</h5>
                        <small className="text-muted">月评论</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div>
                        <h5 className="mb-0 text-danger">{userData.creationData.totalLikes}</h5>
                        <small className="text-muted">总点赞</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* 左侧栏 - 个人信息和书架 */}
        <div className="col-lg-4 mb-4">
          {/* 个人信息卡片 */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0">个人信息</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">手机号</span>
                  <span>{userData.phone}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">邮箱号</span>
                  <span>{userData.email}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">账号</span>
                  <span>{userData.username}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 书架 */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">我的书架</h5>
              <span className="badge bg-primary rounded-pill">{userData.bookshelf.length}</span>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {userData.bookshelf.map((book, index) => (
                  <span key={index} className="badge bg-light text-dark border">
                    {book}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 足迹 */}
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">阅读足迹</h5>
              <span className="badge bg-primary rounded-pill">{userData.footprint.length}</span>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {userData.footprint.map((book, index) => (
                  <li key={index} className="list-group-item px-0">
                    <small>{book}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 右侧栏 - 作品和互动数据 */}
        <div className="col-lg-8">
          {/* 我的作品 */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">我的作品</h5>
              <span className="badge bg-primary rounded-pill">{userData.works.length}</span>
            </div>
            <div className="card-body">
              <div className="row">
                {userData.works.map((work, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title">{work}</h6>
                        <div className="d-flex justify-content-between text-muted small">
                          <span>字数: 12.5万</span>
                          <span>收藏: 234</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 创作数据详情 */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">评论记录</h5>
                </div>
                <div className="card-body text-center">
                  <h2 className="text-primary">{userData.comments}</h2>
                  <p className="text-muted">累计评论数</p>
                  <button className="btn btn-outline-primary btn-sm">查看评论历史</button>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">粉丝互动</h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6">
                      <h5 className="text-success">{userData.followers}</h5>
                      <small className="text-muted">粉丝数</small>
                    </div>
                    <div className="col-6">
                      <h5 className="text-info">{userData.following}</h5>
                      <small className="text-muted">关注数</small>
                    </div>
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button className="btn btn-primary btn-sm">管理关注</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Person;