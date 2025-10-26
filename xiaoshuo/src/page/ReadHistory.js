import styles from './ReadHistory.module.css'
import api from '../api';
import { useState, useEffect } from 'react';
import NovelCard from '../components/NovelCard';
import Pagination from '../components/Pagination';
import { set } from 'lodash';

const ReadHistory = () => {
    //token
    const token = localStorage.getItem('TOKEN')
    //小说
    const [novels, setNovels] = useState([])
    //时间
    const [time, setTime] = useState({})
    //当前页
    const [currentPage, setCurrentPage] = useState(1);
    //每页显示多少条数据
    const ITEMS_PER_PAGE = 10

    //获取数据
    useEffect(() => {
        api.history({ token }).then(res => {
            setNovels(res.data.result)
            res.data.result.forEach(element => {
                setTime(pre => ({
                    ...pre,
                    [element.updated_at]: element.updated_at
                }))
            });
        })
    }, []);

    //获取分页后的数据
    const getPagedData = () => {
        const data = novels;
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };

    const currentData = getPagedData();
    const totalPages = Math.ceil(novels.length / ITEMS_PER_PAGE);

    return (
        <div>
            <header className={styles.readHistoryHeader}>
                <div className="container text-center">
                    <h1 className="display-4 fw-bold">历史阅读</h1>
                </div>
            </header>
            <main>
                {currentData.length > 0 ? (
                    currentData.map((novel) => (
                        <div key={novel.title} className={styles.novelItemWrapper}>
                            {/* 时间 */}
                            <div className={styles.novelTime}>
                                {novel.updated_at}
                            </div>

                            {/* 小说 */}
                            <div className="container">
                                <NovelCard novel={novel} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">暂无数据</p>
                )}
            </main>
        </div>
    );
};

export default ReadHistory;