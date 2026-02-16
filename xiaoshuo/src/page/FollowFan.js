import styles from './FollowFan.module.css';
import { useState, useEffect, useId } from 'react';
import api from '../api';
import Pagination from '../components/Pagination';
import {decodeToken} from '../utils/token'
import { TOKEN } from '../constants';

const FollowFan = () => {
    const token = localStorage.getItem(TOKEN);
    const { uid, phone, email } = decodeToken(token)
    const [followList, setFollowList] = useState([]);
    const [fanList, setFanList] = useState([]);
    const [followStatus, setFollowStatus] = useState({})
    const [fanStatus, setFanStatus] = useState({})

    // 分页
    const [currentFanPage, setCurrentFanPage] = useState(1);
    const [currentFollowPage, setCurrentFollowPage] = useState(1);
    const itemsPerPage = 10; // 每页显示多少条

    useEffect(() => {
        api.followFan({ token }).then((res) => {
            setFollowList(res.data.result.following || []);
            setFanList(res.data.result.fans || []);
        });
    }, []);
    useEffect(() => {
        const newFollowStatus = {};
        followList.forEach(follow => {
            newFollowStatus[follow.id] = true;
        });
        setFollowStatus(newFollowStatus);
    }, [followList]);
    useEffect(() => {
        const newFanStatus = {};
        fanList.forEach(fan => {
            newFanStatus[fan.id] = false;
            if (followStatus[fan.id]) {
                newFanStatus[fan.id] = true;
            }
        });
        setFanStatus(newFanStatus);
    }, [fanList, followStatus]);

    // 计算分页数据
    const paginatedFans = fanList.slice(
        (currentFanPage - 1) * itemsPerPage,
        currentFanPage * itemsPerPage
    );
    const paginatedFollows = followList.slice(
        (currentFollowPage - 1) * itemsPerPage,
        currentFollowPage * itemsPerPage
    );

    const totalFanPages = Math.ceil(fanList.length / itemsPerPage);
    const totalFollowPages = Math.ceil(followList.length / itemsPerPage);

    function followClick(id) {
        api.follows({ follower_id: uid, followee_id: id }).then(res => {
            const newFollowStatus = { ...followStatus, [id]: !followStatus[id] };
            setFollowStatus(newFollowStatus);
            const newFanStatus = { ...fanStatus, [id]: !fanStatus[id] };
            setFanStatus(newFanStatus);
        })
    }

    return (
        <div className={`container ${styles.wideContainer} py-4`}>
            <div className="row justify-content-center">
                <div className={`col-lg-12 ${styles.wideListContainer}`}>
                    <div className="card shadow-sm">
                        {/* 头部 */}
                        <div className="card-header bg-white">
                            <ul className={`nav nav-tabs card-header-tabs ${styles.navTabs}`} id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link active ${styles.navLink}`}
                                        id="followers-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#followers"
                                        type="button"
                                        role="tab"
                                    >
                                        粉丝列表 ({fanList.length})
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${styles.navLink}`}
                                        id="following-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#following"
                                        type="button"
                                        role="tab"
                                    >
                                        关注列表 ({followList.length})
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="card-body p-0">
                            <div className={`tab-content ${styles.tabContent}`} id="myTabContent">
                                {/* 粉丝列表 */}
                                <div className="tab-pane fade show active" id="followers" role="tabpanel">
                                    <div className="list-group list-group-flush">
                                        {paginatedFans.map((fan, index) => (
                                            <div className={`list-group-item py-3 ${styles.listGroupItem}`} key={index}>
                                                <div className={styles.listGroupItemContent}>
                                                    <div className={`d-flex align-items-center ${styles.userInfo}`}>
                                                        <img
                                                            src="https://picsum.photos/60/60?random=2"
                                                            alt="粉丝头像"
                                                            className={`${styles.followerAvatar} rounded-circle me-4`}
                                                        />
                                                        <div className={styles.userDetails}>
                                                            <h6 className={`mb-0 ${styles.userName}`}>{fan.nick}</h6>
                                                            <small className="text-muted">{fan.desc}</small>
                                                        </div>
                                                    </div>
                                                    {
                                                        fanStatus[fan.id] ?
                                                            <button className={`btn btn-outline-secondary btn-sm ${styles.btnFollow}`} onClick={() => followClick(fan.id)}>已关注</button> :
                                                            <button className={`btn btn-outline-primary btn-sm ${styles.btnFollow}`} onClick={() => followClick(fan.id)}>回关</button>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* 分页 */}
                                    {totalFanPages > 1 && (
                                        <Pagination
                                            totalItems={fanList.length}
                                            onChange={(page) => setCurrentFanPage(page)}
                                        />
                                    )}
                                </div>

                                {/* 关注列表 */}
                                <div className="tab-pane fade" id="following" role="tabpanel">
                                    <div className="list-group list-group-flush">
                                        {paginatedFollows.map((follow, index) => (
                                            <div className={`list-group-item py-3 ${styles.listGroupItem}`} key={index}>
                                                <div className={styles.listGroupItemContent}>
                                                    <div className={`d-flex align-items-center ${styles.userInfo}`}>
                                                        <img
                                                            src="https://picsum.photos/60/60?random=2"
                                                            alt="关注头像"
                                                            className={`${styles.followerAvatar} rounded-circle me-4`}
                                                        />
                                                        <div className={styles.userDetails}>
                                                            <h6 className={`mb-0 ${styles.userName}`}>{follow.nick}</h6>
                                                            <small className="text-muted">{follow.desc}</small>
                                                        </div>
                                                    </div>
                                                    {
                                                        followStatus[follow.id] ?
                                                            <button className={`btn btn-outline-secondary btn-sm ${styles.btnFollow}`} onClick={() => followClick(follow.id)}>已关注</button> :
                                                            <button className={`btn btn-outline-primary btn-sm ${styles.btnFollow}`} onClick={() => followClick(follow.id)}>关注</button>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* 分页 */}
                                    {totalFollowPages > 1 && (
                                        <Pagination
                                            totalItems={followList.length}
                                            onChange={(page) => setCurrentFollowPage(page)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowFan;
