import { userApi } from '../api';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/link';

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
  const [user, setUser] = useState({})
  //关注、粉丝
  const [follow, setFollow] = useState([])
  const [fan, setFan] = useState([])
  const [like, setLike] = useState([])
  const [comments, setComments] = useState([])
  const [collectCount, setCollectCount] = useState(0)
  const [collectList, setCollectList] = useState([])
  const [worksCount, setWorksCount] = useState(0)
  const [worksList, setWorksList] = useState([])


  useEffect(() => {
    userApi.user().then(res => {
      setUser(res.data.result)
    })
    userApi.follow().then(res => {
      setFollow(res.data.data.followingCount)
      setFan(res.data.data.followersCount)
    })
    userApi.like().then(res => {
      setLike(res.data.data.totalLikes)
    })
    userApi.commentsCount().then(res => {
      setComments(res.data.result.total_comments)
    })
    userApi.collectCount().then(res => {
      setCollectCount(res.data.result.total_collects)
      setCollectList(res.data.result.novel_titles)
    })
    userApi.worksCount().then(res => {
      setWorksCount(res.data.result.count)
      setWorksList(res.data.result.works)
    })
  }, [])

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
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>

                {/* 基本信息 */}
                <div className="col-md-6">
                  <h2 className="card-title text-primary">{user.nick}</h2>
                  <p className="card-text text-muted">{user.desc}</p>
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
                        <h5 className="mb-0 text-warning">{userData?.creationData?.todayRead ?? 0}</h5>
                        <small className="text-muted">作品数</small>
                      </div>
                    </div>
                    <div className="col-6 mb-2">
                      <div className="border-end">
                        <h5 className="mb-0 text-info">{collectCount ?? 0}</h5>
                        <small className="text-muted">收藏数</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="border-end">
                        <h5 className="mb-0 text-success">{comments ?? 0}</h5>
                        <small className="text-muted">评论数</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div>
                        <h5 className="mb-0 text-danger">{like ?? 0}</h5>
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

      <div className="row mb-4">
        {/* 左侧列 */}
        <div className="col-lg-6 d-flex flex-column">
          {/* 个人信息卡片 - 高度自适应 */}
          <div className="card shadow-sm mb-4">
            <div className={`card-header bg-light d-flex justify-content-between align-items-center `}>
              <h5 className="card-title mb-0">个人信息</h5>
              <NavLink
                to={ROUTES.PERSONAL_INFO}
                className="badge bg-primary rounded-pill"
                style={{ cursor: "pointer" }}
                target='_blank'
                end>
                编辑信息
              </NavLink>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">账号</span>
                  <span>{user.nick ?? '未知用户'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">手机号</span>
                  <span>{user.phone ?? '未绑定手机'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">邮箱号</span>
                  <span>{user.email ?? '未绑定邮箱'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 书架卡片 */}
          <div className="card shadow-sm flex-grow-1">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">我的书架</h5>
              <NavLink to={ROUTES.BOOK_SHELF} className="badge bg-primary rounded-pill" target="_blank">管理书架</NavLink>
            </div>
            <div className="card-body">
              <div className="row">
                {collectList.map((book, index) => (
                  index < 6 ? (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">{book}</h6>
                        </div>
                      </div>
                    </div>
                  ) : null
                ))}
                {collectCount > 6 && <span>...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧列 */}
        <div className="col-lg-6 d-flex flex-column">
          {/* 我的作品卡片 - 高度自适应 */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">我的作品</h5>
              <NavLink
                to={ROUTES.WORKS}
                className="badge bg-primary rounded-pill"
                style={{ cursor: "pointer" }}
                target='_blank'
                end>
                管理作品
              </NavLink>
            </div>
            <div className="card-body">
              <div className="row">
                {worksList.map((work, index) => (
                  index < 6 ?
                    <div key={index} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">{work}</h6>
                        </div>
                      </div>
                    </div> : null
                ))}
                {worksCount >= 6 ? <span>...</span> : null}
              </div>
            </div>
          </div>

          <div className="row flex-grow-1">
            <div className="col-md-6 d-flex">
              <div className="card shadow-sm h-100 w-100">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">评论记录</h5>
                </div>
                <div className="card-body text-center d-flex flex-column justify-content-between">
                  <h2 className="text-primary">{comments}</h2>
                  <p className="text-muted">累计评论数</p>
                  <NavLink to={ROUTES.COMMENT_HISTORY} className="btn btn-outline-primary btn-sm" target="_blank" style={{ width: '120px', margin: '0 auto' }}>查看评论历史</NavLink>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex">
              <div className="card shadow-sm h-100 w-100">
                <div className="card-header bg-light">
                  <h5 className="card-title mb-0">关注与粉丝</h5>
                </div>
                <div className="card-body text-center d-flex flex-column justify-content-between">
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
                  <NavLink to="/FollowFan" className="btn btn-outline-primary btn-sm mt-3" style={{ width: '120px', margin: '0 auto' }} target="_blank">管理关注</NavLink>
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