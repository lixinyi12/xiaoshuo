import React, { useState } from 'react';
import styles from './RangkingList.module.css';
import { useEffect } from 'react';
import { statisticsApi } from '../../api';
import NovelCard from '../../components/NovelCard';
import Pagination from '../../components/Pagination';

const RankingList = () => {
    //榜单选择
    const [activeTab, setActiveTab] = useState('热度榜');
    //热度榜
    const [hot, setHot] = useState([])
    //收藏榜
    const [collect, setCollect] = useState([])
    //评分榜
    const [score, setScore] = useState([])
    //完结榜
    const [finished, setFinished] = useState([]);
    //当前页
    const [currentPage, setCurrentPage] = useState(1);
    //每页显示多少条数据
    const ITEMS_PER_PAGE = 10

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

    //获取数据
    useEffect(() => {
        statisticsApi.hot().then(res => setHot(res.data.data)).catch(() => setHot([]));
        statisticsApi.collects().then(res => setCollect(res.data.data)).catch(() => setCollect([]));
        statisticsApi.score().then(res => setScore(res.data.data)).catch(() => setScore([]));
        statisticsApi.finished().then(res => setFinished(res.data.data)).catch(() => setFinished([]));
    }, []);

    //点击榜单切换
    const handleTabClick = (tab: any) => {
        setActiveTab(tab);
    };

    // 获取分页后的数据
    const getPagedData = () => {
        const data = getCurrentData();
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };
    //当切换榜单时，重置页码
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const currentData = getPagedData();
    const totalItems = getCurrentData().length;   // 提取总条数

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
                        currentData.map((novel: any) => <NovelCard key={novel.title} novel={novel} />)
                    ) : (
                        <p className="text-center">暂无数据</p>
                    )}
                </section>

                {/* 分页组件 */}
                <Pagination
                    totalItems={totalItems}                // 传递数字
                    itemsPerPage={ITEMS_PER_PAGE}
                    initialPage={1}
                    showInfo={true}
                    showJump={false}
                    showSizeChanger={false}
                    onChange={({
                        currentPage
                    }: any) => setCurrentPage(currentPage)}
                />
            </main>
        </div>
    );
};

export default RankingList;
