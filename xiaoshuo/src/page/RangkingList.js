import React, { useState } from 'react';
import styles from './RangkingList.module.css';
import { useEffect } from 'react';
import api from '../api';
import NovelCard from '../components/NovelCard';

const RankingList = () => {
    //榜单选择
    const [activeTab, setActiveTab] = useState('热度榜');
    //热度榜
    const [hot,setHot] = useState([])
    //收藏榜
    const [collect, setCollect] = useState([])
    //评分榜
    const [score, setScore] = useState([])
    //完结榜
    const [finished, setFinished] = useState([]);

    //根据当前状态返回不同数据
    const getCurrentData = () => {
    switch (activeTab) {
        case '热度榜':
            return hot;
        case '收藏榜':
            return collect;
        case '评分榜':
            return score;
        case '完结榜':
            return finished;
        default:
            return [];
        }
    };

    // 获取数据
    useEffect(() => {
        api.hot().then(res => setHot(res.data.data)).catch(() => setHot([]));
        api.collects().then(res => setCollect(res.data.data)).catch(() => setCollect([]));
        api.score().then(res => setScore(res.data.data)).catch(() => setScore([]));
        api.finished().then(res => setFinished(res.data.data)).catch(() => setFinished([]));
    }, []);

    //点击榜单切换
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const currentData = getCurrentData();

    return (
        <div>
            {/* 排行榜头部 */}
            <header className={styles.rankingHeader}>
                <div className="container text-center">
                    <h1 className="display-4 fw-bold">小说排行榜</h1>
                </div>
            </header>

            <main className="container">
                {/* 榜单分类 */}
                <section className={styles.rankingTabs}>
                    <div className="d-flex flex-wrap">
                        {['热度榜', '收藏榜', '评分榜', '完结榜'].map((tab, index) => (
                            <button
                                key={index}
                                className={`${styles.rankingTab} ${activeTab === tab ? styles.active : ''}`}
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 排行榜列表 */}
                <section>
                    {currentData.length > 0 ? (
                        currentData.map((novel) => (
                        <NovelCard key={novel.title} novel={novel} />
                        ))
                    ) : (
                        <p className="text-center">暂无数据</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default RankingList;
