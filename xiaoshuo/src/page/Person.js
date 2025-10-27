import api from '../api';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import store from '../store';
import { set } from 'lodash';
import { NavLink } from 'react-router-dom';

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

  //用户基本信息
  const [user,setUser] = useState({})
  //关注、粉丝
  const [follow,setFollow] = useState([])
  const [followList,setFollowList] = useState([])
  const [fan,setFan] = useState([])
  const [fanList,setFanList] = useState([])
  const [like,setLike] = useState([])
  const [likeCommentList,setlikeCommentList] = useState([])
  const [comments,setComments] = useState([])
  const [collectCount,setCollectCount] = useState(0)
  const [collectList,setCollectList] = useState([])
  const [worksCount,setWorksCount] = useState(0)
  const [worksList,setWorksList] = useState([])
  const [historyCount,setHistoryCount] = useState(0)
  const [historyList,setHistoryList] = useState([])


  useEffect(()=>{
    const token = localStorage.getItem('TOKEN');
    api.user({token}).then(res =>{
      setUser(res.data.result)
    })
    api.follow({token}).then(res =>{
      setFollow(res.data.data.followingCount)
      setFollowList(res.data.data.following)
      setFan(res.data.data.followersCount)
      setFanList(res.data.data.followers)
    })
    api.like({token}).then(res =>{
      setlikeCommentList(res.data.data.comments)
      setLike(res.data.data.totalLikes)
    })
    api.commentsCount({token}).then(res =>{
      setlikeCommentList(res.data.result.comments)
      setComments(res.data.result.total_comments)
    })
    api.collectCount({token}).then(res =>{
      setCollectCount(res.data.result.total_collects)
      setCollectList(res.data.result.novel_titles)
    })
    api.worksCount({token}).then(res =>{
      setWorksCount(res.data.result.count)
      setWorksList(res.data.result.works)
    })
    api.historyCount({token}).then(res =>{
      setHistoryCount(res.data.result.total_reading)
      setHistoryList(res.data.result.novel_titles)
    })
  },[])

  //初始化表单
  const [formData, setFormData] = useState({
      list:[]
  });
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('TOKEN');
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
                  <h2 className="card-title text-primary">{user.nick}</h2>
                  <p className="card-text text-muted">{userData.signature}</p>
                  <div className="d-flex flex-wrap gap-3">
                    <span className="badge bg-primary">粉丝: {fan}</span>
                    <span className="badge bg-secondary">关注: {follow}</span>
                    <span className="badge bg-success">获赞: {like}</span>
                  </div>
                </div>
                
                {/* 创作数据 */}
                <div className="col-md-4">
                  <div className="row text-center">
                    <div className="col-6 mb-2">
                      <div className="border-end">
                        <h5 className="mb-0 text-warning">{userData.creationData.todayRead}</h5>
                        <small className="text-muted">作品数</small>
                      </div>
                    </div>
                    <div className="col-6 mb-2">
                      <div className="border-end">
                        <h5 className="mb-0 text-info">{collectCount}</h5>
                        <small className="text-muted">收藏数</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border-end">
                        <h5 className="mb-0 text-success">{comments}</h5>
                        <small className="text-muted">评论数</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div>
                        <h5 className="mb-0 text-danger">{like}</h5>
                        <small className="text-muted">获赞数</small>
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
        <div className="col-lg-6 mb-4">
          {/* 个人信息卡片 */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0">个人信息</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">账号</span>
                  <span>{user.nick}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">手机号</span>
                  <span>{user.phone}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">邮箱号</span>
                  <span>{user.email}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 书架 */}
          <div className="card shadow-sm mb-4">
            <div className={`card-header bg-light d-flex justify-content-between align-items-center `}>
              <h5 className="card-title mb-0">我的书架</h5>
              <NavLink 
              to='/BookShelf'
              className="badge bg-primary rounded-pill" 
              style={{ cursor: "pointer" }}
              target='_blank'
              end>
                管理书架
              </NavLink>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {collectList.map((book, index) => (
                  index<10?
                  <span key={index} className="badge bg-light text-dark border">
                    {book}
                  </span>:null
                ))}
              </div>
              <div>
                {
                  collectCount>10?<span>...</span>:null
                }
              </div>
            </div>
          </div>

          {/* 足迹 */}
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">阅读足迹</h5>
              <NavLink 
              to='/ReadHistory'
              className="badge bg-primary rounded-pill" 
              style={{ cursor: "pointer" }}
              target='_blank'
              end>
                阅读历史
              </NavLink>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {historyList.map((book, index) => (
                  index<4?
                  <li key={index} className="list-group-item px-0">
                    <small>{book}</small>
                  </li>:null
                ))}
                {historyCount>4?<span>...</span>:null}
              </ul>
            </div>
          </div>
        </div>

        {/* 右侧栏 - 作品和互动数据 */}
        <div className="col-lg-6">
          {/* 我的作品 */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">我的作品</h5>
              <span className="badge bg-primary rounded-pill">管理作品</span>
            </div>
            <div className="card-body">
              <div className="row">
                {worksList.map((work, index) => (
                  index<=6?
                  <div key={index} className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title">{work}</h6>
                      </div>
                    </div>
                  </div>:null
                ))}
                {worksCount>6?<span>...</span>:null}
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
                  <h2 className="text-primary">{comments}</h2>
                  <p className="text-muted">累计评论数</p>
                  <NavLink
                    to='/CommentHistory'
                    className="btn btn-outline-primary btn-sm"
                    target='_blank'
                    end
                  >查看评论历史</NavLink>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">关注与粉丝</h5>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6">
                      <h5 className="text-success">{fan}</h5>
                      <small className="text-muted">粉丝数</small>
                    </div>
                    <div className="col-6">
                      <h5 className="text-info">{follow}</h5>
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